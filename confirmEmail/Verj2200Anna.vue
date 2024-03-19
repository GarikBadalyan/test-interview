<template>
  <v-navigation-drawer
      id="browserProfilesFiltersBar"
      :value="show"
      temporary
      right
      absolute
      style="position: fixed; top: 0; width: 400px; height: 100%; z-index: 99999;"
      @transitionend="$emit('close')"
  >
    <div style="padding: 16px">
      <div class="mb-4 d-flex align-center">
        <span>
          <v-btn
              id="browserProfilesFiltersBarCloseButton"
              color="grey"
              fab
              x-small
              outlined
              class="mr-2"
              @click="$emit('close')"
          >
            <v-icon :size="14">
              fas fa-chevron-right
            </v-icon>
          </v-btn>
        </span>
        <span class="anty-advanced-search">
          {{ $t('common.advancedSearch') }}
        </span>
      </div>

      <v-row class="profile-search-filter-wrapper d-flex flex-column">
        <v-col
            cols="12"
            class="profile-filter-columns"
        >
          <div class="anty-search-filter-title d-flex flex-column mt-4 mb-3">
            <span>{{ $t('common.findProfiles1') }}</span>
            <span>{{ $t('common.findProfiles2') }}</span>
          </div>
          <div
              v-for="(profileSearchField, index) in profileSearchFields"
              :key="index"
              class="d-flex flex-column profile-search-field-box"
          >
            <v-text-field
                id="browserProfileSearch"
                class="anty-search-field"
                dense
                single-line
                hide-details
                clearable
                outlined
                :value="profileSearchFields[index].inputValue || '' "
                :spellcheck="false"
                @input="handleChangeMoreSearchFields($event, profileSearchField.id)"
                @blur="search"
            />
          </div>
        </v-col>

        <v-col
            cols="12"
            class="profile-filter-container profile-filter-columns d-flex flex-column"
        >
          <div class="anty-search-filter-title">
            {{ $t('common.filters') }}
          </div>
          <!-- ФИЛЬТР ПО ЮЗЕРАМ -->
          <div v-if="profile && profile.role && ['admin', 'teamlead'].includes(profile.role)">
            <v-autocomplete
                id="browserProfilesFiltersBarUsersTextarea"
                :value="filters.users"
                :search-input.sync="filtersUsers"
                style="max-height: 200px; overflow: auto"
                :item-value="user => user.id"
                :item-text="generateUserSelectItem"
                :items="computedUsers"
                :label="$t('common.users')"
                :menu-props="{closeOnContentClick:isSelectedOpen}"
                multiple
                small-chips
                deletable-chips
                clearable
                dense
                outlined
                full-width
                hide-details
                class="densed-input"
                :disabled="profile && profile.role === 'user'"
                @change="filterByUsers"
            >
              <template #selection="{item}">
                <div>
                  <v-chip
                      class="delete-selected-item"
                      close
                      label
                      @click:close="toggleItem(item)"
                  >
                    <div
                        style="max-width: 220px; overflow: hidden;text-overflow: ellipsis"
                    >
                      <span>  {{ item.name }}</span>
                      <span>  {{ item.username }}</span>
                    </div>
                  </v-chip>
                </div>
              </template>
              <template #[`item`]="{item}">
                <v-simple-checkbox
                    color="primary"
                    :value="isSelected(item)"
                    @click="toggleItem(item)"
                />
                <!-- отображаемое имя -->
                <span>
                  {{ item.displayName || item.username }}
                  <span v-if="item.id === profile.id">({{ $t('common.you').toLowerCase() }})</span>
                </span>

                <!-- почта, если есть отображаемое имя -->
                <span
                    v-if="item.displayName"
                    style="font-size: 12px; margin-left: 8px; color: grey; padding-top: 4px; overflow: hidden; text-overflow: ellipsis"
                >
                  {{ item.username }}
                </span>
              </template>
            </v-autocomplete>
          </div>

          <!-- ФИЛЬТР ПО ТЕГАМ -->
          <div>
            <v-autocomplete
                id="browserProfilesFiltersBarTagsTextarea"
                :value="filters.tags"
                :search-input.sync="filtersTags"
                :item-value="item => item.name"
                :item-text="item => item.name"
                :items="computedTags"
                :label="$t('common.tags')"
                multiple
                small-chips
                deletable-chips
                clearable
                dense
                outlined
                hide-details
                class="densed-input"
                @change="filterByTags"
            />
          </div>

          <!-- ФИЛЬТР ПО СТАТУСУ -->
          <div>
            <v-autocomplete
                id="browserProfilesFiltersBarStatusesTextarea"
                :value="filters.statuses"
                :search-input.sync="filtersStatuses"
                :item-value="item => item.id"
                :item-text="item => item.name"
                :items="computedBrowserProfilesStatuses"
                :label="$t('common.statuses')"
                multiple
                small-chips
                clearable
                dense
                outlined
                hide-details
                class="densed-input"
                @change="filterByStatuses"
            >
              <template #[`item`]="{item}">
                <v-chip
                    outlined
                    label
                    small
                    :color="item.color"
                    style="text-transform: uppercase; font-weight: bold; cursor: pointer;"
                >
                  {{ item.name }}
                </v-chip>
              </template>
              <template #[`selection`]="{item}">
                <v-chip
                    outlined
                    label
                    small
                    :color="item.color"
                    style="text-transform: uppercase; font-weight: bold; cursor: pointer;"
                >
                  {{ item.name }}
                </v-chip>
              </template>
            </v-autocomplete>
          </div>

          <!-- ФИЛЬТР ПО ОСНОВНОМУ САЙТУ -->
          <div>
            <v-autocomplete
                id="browserProfilesFiltersBarMainWebsiteTextarea"
                :value="filters.mainWebsites"
                :search-input.sync="filtersMainWebsites"
                :item-text="item => item.name"
                :item-value="item => item.value"
                :items="websites"
                :label="$t('browserProfiles.mainWebsites')"
                multiple
                small-chips
                deletable-chips
                clearable
                dense
                outlined
                hide-details
                class="densed-input"
                @change="filterByMainWebsites"
            />
          </div>

          <!-- ФИЛЬТР ПО ПРОКСИ -->
          <div>
            <v-autocomplete
                id="browserProfilesFiltersBarProxyTextarea"
                :value="filters.proxies"
                :search-input.sync="filtersProxies"
                :item-text="item => item.name"
                :item-value="item => item.id"
                :items="proxiesTruncated"
                :label="$t('common.proxy')"
                multiple
                small-chips
                deletable-chips
                clearable
                dense
                outlined
                hide-details
                class="densed-input"
                @change="filterByProxies"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'BrowserProfilesFiltersBar',

  props: {
    show: {
      type: Boolean,
      default: false
    },

    activeFiltersCount: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      isSelectedOpen: false,
      filtersUsers: '',
      filtersStatuses: '',
      filtersTags: '',
      filtersMainWebsites: '',
      filtersProxies: '',
      allTags: [],
      profileSearchFields: [{ id: 0, inputValue: '' }],
      websites: [
        {
          name: this.$t('browserProfiles.noWebsite'),
          value: 'none'
        },
        {
          name: 'Facebook',
          value: 'facebook'
        },
        {
          name: 'Google',
          value: 'google'
        },
        {
          name: 'TikTok',
          value: 'tiktok'
        },
        {
          name: 'Crypto',
          value: 'crypto'
        }
      ]
    }
  },

  created () {
    document.addEventListener('keydown', this.handleSearchWithEnter)
    this.profileSearchFields = this.filters.browserProfileSearchFields
  },

  destroyed () {
    document.removeEventListener('keydown', this.handleSearchWithEnter)
  },

  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      pagination: 'browserProfiles/pagination',
      users: 'users/users',
      filters: 'browserProfiles/filters',
      browserProfilesStatuses: 'browserProfilesStatuses/statuses',
      sortedTags: 'browserProfiles/sortedTags',
      profile: 'main/profile'
    }),
    ...mapFields('proxy', ['proxies']),

    computedTags () {
      const tags = this.$_.cloneDeep(this.sortedTags)

      for (const i of this.filters.tags) {
        const existedTag = this.sortedTags.find(y => y.name === i)
        if (existedTag === undefined) {
          tags.push({
            count: 0,
            name: i
          })
        }
      }
      return tags
    },

    computedBrowserProfilesStatuses () {
      const statuses = this.browserProfilesStatuses.all.filter(item => !item.deleted)

      statuses.push({
        name: this.$t('browserProfiles.noStatus'),
        id: 'none',
        color: 'grey'
      })

      return statuses
    },

    computedUsers () {
      let users = []

      if (this.profile && this.profile.role === 'admin') {
        users = this.users.all
      }
      if (this.profile && this.profile.role === 'teamlead') {
        users = this.users.all.filter(item => item.teamleads && item.teamleads.includes(parseInt(this.profile.id, 10)))
      }

      if (this.users.all.length && this.profile.team.isOwner) {
        return [{ username: this.$t('common.selectAllUser'), id: 'all' }, ...users]
      }

      console.log('users', users)
      return users
    },

    proxiesTruncated () {
      return this.proxies.all.map(proxy => ({
        ...proxy,
        ...{ name: proxy.name.length <= 45 ? proxy.name : proxy.name.slice(0, 45) + '...' }
      }))
    }
  },

  methods: {
    handleChangeMoreSearchFields (value, searchFieldId) {
      // Checking if you clicked on the trash of the first input, all inputs should be cleared, and only the last one remains with empty value
      // When you click on the trash, the inputs are cleared, and the value is exactly null.

      if (searchFieldId === 0 && value === null) {
        this.profileSearchFields = [{ id: 0, inputValue: '' }]
        this.search()

        return
      }

      const searchFields = [...this.profileSearchFields]
      const foundChangedFieldIndex = searchFields.findIndex(field => field.id === searchFieldId)

      if (foundChangedFieldIndex !== -1) {
        searchFields[foundChangedFieldIndex] = {
          ...searchFields[foundChangedFieldIndex],
          inputValue: value || ''
        }

        // The maximum number of inputs should be 5
        if (foundChangedFieldIndex === searchFields.length - 1 && searchFields.length < 5) {
          // When entering the last input, another empty input should appear
          this.profileSearchFields = [...searchFields, { id: searchFieldId + 1, inputValue: '' }]
        } else {
          this.profileSearchFields = searchFields
        }
      }
    },

    search () {
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'browserProfileSearchFields', data: this.profileSearchFields })
    },

    handleSearchWithEnter (evt) {
      if (evt.keyCode === 13) {
        this.search()
      }
    },

    generateUserSelectItem (user) {
      let text

      if (user.displayName) {
        text = `${user.displayName} (${user.username})`
      } else {
        text = user.username
      }

      if (user.id === this.profile.id) {
        text += ` (${this.$t('common.you').toLowerCase()})`
      }

      return text
    },

    isSelected (item) {
      if (item.id === 'all') {
        return this.computedUsers.length - 1 === this.filters.users.length
      } else {
        return this.filters.users.includes(item.id)
      }
    },

    toggleItem (item) {
      // this.closeOnContentClick = true

      this.isSelectedOpen = true
      console.log('item22', item)
      if (item.id === 'all') {
        if (this.computedUsers.length - 1 !== this.filters.users.length) {
          this.computedUsers.forEach(el => {
            if (el.id !== 'all' && !this.filters.users.includes(el.id)) {
              console.log('GGGGGGGGGG ++++')
              this.filters.users.push(el.id)
            }
          })
        } else {
          console.log('AAAA ------')
          this.filters.users = []
        }
      } else {
        if (this.filters.users.includes(item.id)) {
          this.filters.users = this.filters.users.filter(userId => userId !== item.id)

          return
        }
        this.filters.users.push(item.id)
      }
    },

    filterByUsers (users) {
      console.log('users55', users)
      if (users.includes('all')) {
        console.log('includes all')
        this.computedUsers.forEach(el => {
          if (!this.filters.users.includes(el.id) && el.id !== 'all' && !(users.length > 1)) {
            console.log('KKKKKKKKKKKKKKKKK')
            this.filters.users.push(el.id)
          } else if (users.length < this.computedUsers.length && users.includes('all') && !this.filters.users.includes(el.id) && el.id !== 'all') {
            console.log('JJJJJJJJJKKKKKKKKKKK')
            this.filters.users.push(el.id)
          } else {
            console.log('MMMMMMMMMMMMMM')
            this.filters.users = []
          }
        })
      } else {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        this.filtersUsers = ''
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'users', data: users })
        this.$store.dispatch('browserProfiles/loadTags')
      }
    },

    filterByTags (tags) {
      this.filtersTags = ''
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'tags', data: tags })
    },

    filterByStatuses (statuses) {
      this.filtersStatuses = ''
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'statuses', data: statuses })
    },

    filterByMainWebsites (mainWebsites) {
      this.filtersMainWebsites = ''
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'mainWebsites', data: mainWebsites })
    },

    filterByProxies (proxies) {
      this.filtersProxies = ''
      this.$store.dispatch('browserProfiles/setFilter', { filter: 'proxies', data: proxies })
    }
  }
}
</script>
<style lang='scss'>
.anty-search-field {
  width: 100%;
}

.profile-search-filter-wrapper {
  gap: 30px;
}

.anty-advanced-search {
  color: var(--v-gray-0-base);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
}

.anty-search-filter-title {
  color: var(--v-gray-0-base);
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
}

.v-menu__content {
  max-width: 510px !important;
}

.delete-selected-item {
  border-radius: 12px!important;
  font-size: 12px!important;
  height: 24px!important;
}

//.v-chip__content {
//    display: inline-block!important;
//    overflow: hidden!important;
//    width: 200px!important;
//    text-overflow: ellipsis!important;
//  padding-right: 10px!important;
//}
//
//.v-icon  {
//  position: absolute!important;
//  right: 4px!important;
//}
//
//.v-chip__close {
//
//  margin-right: 0!important;
//  top: 3px!important;
//}

.profile-search-field-box {
  width: 100%;
  margin-top: 13px;
  gap: 13px;
}

.profile-filter-columns {
  padding: 0 20px!important;
}

.profile-filter-container {
  gap: 13px;
}
</style>
