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
                ref="autocomplete"
                :value="filters.users"
                :search-input.sync="filtersUsers"
                :item-value="user => user.id"
                :item-text="generateUserSelectItem"
                :items="computedUsers"
                :label="$t('common.users')"
                multiple
                small-chips
                deletable-chips
                clearable
                dense
                outlined
                full-width
                hide-details
                class="densed-input selected-items-list-block custom-users-autocomplete"
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
                    <div class="selected-item-full-name">
                      <span v-if="item.displayName">
                        {{ item.displayName }}
                      </span>
                      <span>
                        {{ '(' + item.username + ')' }}
                      </span>
                    </div>
                  </v-chip>
                </div>
              </template>
              <template #[`item`]="{item}">
                <v-simple-checkbox
                    color="primary"
                    :value="isSelected(item)"
                    @click="toggleItem(item, $event)"
                />
                <!-- отображаемое имя -->
                <span>
                  {{ item.displayName || item.username }}
                  <span v-if="item.id === profile.id">({{ $t('common.you').toLowerCase() }})</span>
                </span>

                <!-- почта, если есть отображаемое имя -->
                <span
                    v-if="item.displayName"
                    class="select-item-email"
                >{{ item.username }}
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
      const firstDiv = this.getFirstChildElement()

      // console.log('firstDiv-9-9-9-9', firstDiv)
      if (firstDiv) {
        if (this.computedUsers.length - 1 !== this.filters.users.length) {
          // console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLL')
          this.updateStylesForTheme(firstDiv, this.$vuetify.theme.dark)
        } else {
          // console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBB')
          this.updateStylesForThemeV2(firstDiv, this.$vuetify.theme.dark)
        }
      }

      if (item.id === 'all') {
        return this.computedUsers.length - 1 === this.filters.users.length
      } else {
        return this.filters.users.includes(item.id)
      }
    },

    toggleItem (item, event) {
      if (item.id === 'all') {
        this.$nextTick(() => {
          console.log('111aaa')
          this.toggleAutocompleteMenu()

          const parentDiv = event.currentTarget.closest('.v-list-item')
          console.log('parentDiv555555555', parentDiv)
          if (parentDiv) {
            console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBB11')
            this.updateStylesForThemeV2(parentDiv, this.$vuetify.theme.dark)
          }
        })
        if (this.computedUsers.length - 1 !== this.filters.users.length) {
          this.computedUsers.forEach(el => {
            if (el.id !== 'all' && !this.filters.users.includes(el.id)) {
              console.log('222bbb')
              this.filters.users.push(el.id)
            }
          })
        } else {
          this.filters.users = []
        }
      } else {
        this.filters.users = this.filters.users.includes(item.id)
            ? this.filters.users.filter(userId => userId !== item.id)
            : [...this.filters.users, item.id]
      }
    },

    applyStylesToChildDiv (div, backgroundColor, textColor) {
      div.style.backgroundColor = backgroundColor
      div.style.color = textColor
    },
    updateStylesForTheme (firstDiv, isDarkTheme) {
      const anotherChildDiv = firstDiv.querySelector('div')
      anotherChildDiv.classList.add('selected-option-background-color')
      if (isDarkTheme) {
        this.applyStylesToChildDiv(anotherChildDiv, 'rgba(33, 33, 33, 0.46)', '#FFFFFF')
      } else {
        this.applyStylesToChildDiv(anotherChildDiv, '#FFFFFF', 'rgba(0, 0, 0, 0.87)')
      }
    },
    updateStylesForThemeV2 (firstDiv, isDarkTheme) {
      const anotherChildDiv = firstDiv.querySelector('div')
      if (isDarkTheme) {
        this.applyStylesToChildDiv(anotherChildDiv, 'rgba(33, 150, 243, 0.2)', 'rgba(33, 150, 243, 0.7)')
      } else {
        this.applyStylesToChildDiv(anotherChildDiv, 'rgba(33, 150, 243, 0.1)', 'initial')
      }
    },

    getFirstChildElement () {
      return document.querySelector('.v-menu__content div:first-child')
    },

    filterByUsers (users) {
      console.log('event099999999', event.target)
      const menu = this.$refs.autocomplete.$refs.menu
      console.log(' menu.isActive ', menu.isActive)
      console.log('users', users)
      console.log('userslength', users.length)

      if (!menu.isActive || users.length === 0) {
        const firstDiv = this.getFirstChildElement()
        console.log('firstDiv', firstDiv)
        if (firstDiv) {
          console.log('GGGGGGGGGGGGGGGGGGGGGG')
          // When we select everything and click on the cross
          this.updateStylesForTheme(firstDiv, this.$vuetify.theme.dark)
        }
      }

      if (users.includes('all')) {
        this.$nextTick(() => {
          this.toggleAutocompleteMenu()
          const firstDiv = this.getFirstChildElement()

          if (firstDiv && users[0] === 'all') {
            // when we select everything (click on Selectd all)
            this.updateStylesForThemeV2(firstDiv, this.$vuetify.theme.dark)
            console.log('anotherChildDiv444444')
          } else if (firstDiv && users.length > 1 && users[0] !== 'all' && users.length === this.computedUsers.length) {
            // when we select everything (click on Selectd all) and then click on Selectd all again and cancel the action
            this.updateStylesForTheme(firstDiv, this.$vuetify.theme.dark)
            console.log('this.computedUsers88888', this.computedUsers)
          } else if (users.length > 1 && users.length < this.computedUsers.length) {
            console.log('NNNNNNNNNNNNNNNNNNNNNNN')
            // When everything is selected, we begin to cancel the action separately and click on “select all”
            this.updateStylesForThemeV2(firstDiv, this.$vuetify.theme.dark)
          }
        })
        this.computedUsers.forEach(el => {
          if (!this.filters.users.includes(el.id) && el.id !== 'all' && !(users.length > 1)) {
            this.filters.users.push(el.id)
            console.log('SSSSSSSSSSSSSSS')
          } else if (users.length < this.computedUsers.length && users.includes('all') && !this.filters.users.includes(el.id) && el.id !== 'all') {
            this.filters.users.push(el.id)
          } else {
            this.filters.users = []
          }
        })
      } else {
        const firstDiv = this.getFirstChildElement()
        if (this.computedUsers.length - 1 !== users.length) {
          // When everything is selected and we begin to cancel the action separately
          this.updateStylesForTheme(firstDiv, this.$vuetify.theme.dark)
        } else {
          // And vice versa when we fill it separately to the end
          this.updateStylesForThemeV2(firstDiv, this.$vuetify.theme.dark)
        }

        this.filtersUsers = ''
        this.$store.dispatch('browserProfiles/setFilter', { filter: 'users', data: users })
        this.$store.dispatch('browserProfiles/loadTags')
      }
    },

    toggleAutocompleteMenu () {
      const menu = this.$refs.autocomplete.$refs.menu
      menu.isActive = !menu.isActive
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

.selected-item-full-name {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-item-email {
  font-size: 12px;
  margin-left: 8px;
  color: grey;
  padding-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-option-background-color::before {
  background-color: transparent;
}

.custom-users-autocomplete .v-input__slot .v-select__slot label {
  padding-left: 12px !important;
}

.custom-users-autocomplete .v-input__append-inner {
  padding-right: 12px !important;
}

.custom-users-autocomplete .v-select__selections input {
  padding-left: 12px !important;
}

.custom-users-autocomplete .v-input__slot {
  padding: 0!important;
}

.custom-users-autocomplete .v-select__selections{
  height: 100%;
}

.custom-users-autocomplete .v-select__slot{
  max-height: 160px!important;
  overflow: auto!important;
  overflow-x: hidden!important;
  margin: 2px;

  &::-webkit-scrollbar {
    background-color: transparent !important;
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-corner {
    background-color: #1E1E1E;
  }

  /* Dark theme styles */
  .theme--dark & {
    &::-webkit-scrollbar {
      background-color: #1E1E1E;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #474747;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #666666;
    }
  }

  /* Light theme styles */
  .theme--light & {
    &::-webkit-scrollbar {
      background-color: #FFFFFF;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9E9E9E;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #BDBDBD;
    }
  }
}

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
