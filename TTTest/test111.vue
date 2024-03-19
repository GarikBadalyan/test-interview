<template>
  <v-navigation-drawer
      id="browserProfilesFiltersBar"
      ref="navigationDrawer"
      :value="show"
      temporary
      right
      absolute
      style="position: fixed; top: 0; width: 400px; height: 100%; z-index: 99999;"
      @transitionend="$emit('close')"
  >
    <div
        ref="drawerContent"
        style="padding: 16px"
        @scroll="handleScroll22"
    >
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
                hide-details
                class="densed-input custom-users-autocomplete"
                :disabled="profile && profile.role === 'user'"
                @change="filterByUsers"
                @click:append="handleMenuOpen"
                @focus="fixLabelAndAppendInnerPosition"
                @input="fixLabelAndAppendInnerPosition"
            >
              <template #selection="{item}">
                <div class="custom-users-autocomplete__item-wrapper aaa-bbb">
                  <v-chip
                      class="delete-selected-item"
                      close
                      @click:close="toggleItem(item)"
                  >
                    <div class="selected-item-full-name">
                      <span v-if="item.displayName">
                        {{ item.displayName }}11--
                      </span>
                      <span>
                        {{ '(' + item.username + ')' }}22++
                      </span>
                    </div>
                  </v-chip>
                </div>
              </template>
              <!--              <template #label>-->
              <!--                <span class="custom-label">{{ $t('common.users') }}</span>-->
              <!--              </template>-->
              <template #[`item`]="{item}">
                <v-simple-checkbox
                    color="primary"
                    :value="isSelected(item)"
                    @click="toggleItem(item, $event)"
                />
                <!-- отображаемое имя -->
                <span class="user-display-name">
                  {{ item.displayName || item.username }}
                  <span v-if="item.id === profile.id">({{ $t('common.you').toLowerCase() }})
                  </span>
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

  mounted () {
    this.fixLabelAndAppendInnerPosition()

    this.$refs.autocomplete.$el.querySelector('.custom-users-autocomplete .v-select__slot').addEventListener('scroll', this.handleScroll)

    // const autocompleteSlot = this.$refs.navigationDrawer.$el.querySelector('.custom-users-autocomplete .v-select__slot')
    // autocompleteSlot.addEventListener('scroll', this.handleScroll)

    // const drawerContent = this.$refs.navigationDrawer.$el.querySelector('.v-navigation-drawer__content')
    // drawerContent.addEventListener('scroll', this.handleScroll22)
    //
    // const drawerContent1 = this.$refs.autocomplete.$el.querySelector('.custom-users-autocomplete .v-select__slot')
    // drawerContent1.addEventListener('scroll', this.handleScroll2233)
  },

  beforeDestroy () {
    // Remove the scroll event listener when the component is destroyed
    // this.$refs.autocomplete.$el.querySelector('.custom-users-autocomplete .v-select__slot').removeEventListener('scroll', this.handleScroll)
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

  watch: {
    // profileSearchFields (newVal, oldVal) {
    //   if (newVal !== oldVal) {
    //     this.fixLabelAndAppendInnerPosition()
    //   }
    // }
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

    handleMenuOpen () {
      this.toggleAutocompleteMenu()
      // Accessing the v-autocomplete instance using the ref
      const autocompleteInstance = this.$refs.autocomplete

      // Using $nextTick to ensure the menu items are rendered
      this.$nextTick(() => {
        // Accessing the menu items
        const menuItems = autocompleteInstance.$refs.menu.$el.querySelectorAll('.v-list-item')

        // Accessing the first menu item
        const firstMenuItem = menuItems[0]
        if (firstMenuItem && this.computedUsers.length - 1 === this.filters.users.length) {
          if (this.$vuetify.theme.dark) {
            this.applyStylesToChildDiv(firstMenuItem, 'rgba(33, 150, 243, 0.25)', 'rgba(33, 150, 243, 0.7)')
          } else {
            this.applyStylesToChildDiv(firstMenuItem, 'rgba(25, 118, 210, 0.12)', '#1976d2')
          }
        }
      })
    },

    handleSearchWithEnter (evt) {
      if (evt.keyCode === 13) {
        this.search()
      }
    },

    handleScroll () {
      // const selectContainer = this.$refs.autocomplete.$el.querySelector('.custom-users-autocomplete .v-select__slot')
      // if (selectContainer) {
      //   if (selectContainer.offsetHeight <= 48) {
      //     selectContainer.style.margin = '2px 2px 0 2px'
      //   } else {
      //     selectContainer.style.margin = '10px 2px 2px 2px'
      //   }
      // }
    },
    handleScroll22 () {
      // console.log('ZZZZZZZZZZZZZZZZZ11')
      // const appendInnerInputIcon = this.$refs.autocomplete.$el.querySelector('.custom-users-autocomplete .v-input__icon--append')
      // appendInnerInputIcon.style.position = 'relative'
      // appendInnerInputIcon.style.top = '0px'
      // appendInnerInputIcon.style.left = '0px'
      //
      // console.log('appendInnerInputIcon', appendInnerInputIcon)
    },

    handleScroll2233 () {
      console.log('dddddddddd22222')
      // this.fixLabelAndAppendInnerPosition()
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

      if (firstDiv) {
        if (this.computedUsers.length - 1 !== this.filters.users.length) {
          this.updateStylesForTheme(firstDiv, this.$vuetify.theme.dark)
        } else {
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
          this.toggleAutocompleteMenu()
        })
        if (this.computedUsers.length - 1 !== this.filters.users.length) {
          this.computedUsers.forEach(el => {
            if (el.id !== 'all' && !this.filters.users.includes(el.id)) {
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
        this.applyStylesToChildDiv(anotherChildDiv, 'rgba(33, 150, 243, 0.25)', 'rgba(33, 150, 243, 0.7)')
      } else {
        this.applyStylesToChildDiv(anotherChildDiv, 'rgba(25, 118, 210, 0.12)', '#1976d2')
      }
    },

    getFirstChildElement () {
      return document.querySelector('.v-menu__content div:first-child')
    },

    filterByUsers (users) {
      const menu = this.$refs.autocomplete.$refs.menu

      if (!menu.isActive || users.length === 0) {
        const firstDiv = this.getFirstChildElement()
        if (firstDiv) {
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
          } else if (firstDiv && users.length > 1 && users[0] !== 'all' && users.length === this.computedUsers.length) {
            // when we select everything (click on Selectd all) and then click on Selectd all again and cancel the action
            this.updateStylesForTheme(firstDiv, this.$vuetify.theme.dark)
          } else if (users.length > 1 && users.length < this.computedUsers.length) {
            // When everything is selected, we begin to cancel the action separately and click on “select all”
            this.updateStylesForThemeV2(firstDiv, this.$vuetify.theme.dark)
          }
        })
        this.computedUsers.forEach(el => {
          if (!this.filters.users.includes(el.id) && el.id !== 'all' && !(users.length > 1)) {
            this.filters.users.push(el.id)
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
          if (firstDiv) {
            this.updateStylesForTheme(firstDiv, this.$vuetify.theme.dark)
          }
        } else {
          // And vice versa when we fill it separately to the end
          if (firstDiv) {
            this.updateStylesForThemeV2(firstDiv, this.$vuetify.theme.dark)
          }
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

    fixLabelAndAppendInnerPosition () {
      console.log('fixLabelAndAppendInnerPosition')
      this.$nextTick(() => {
        // const label = this.$refs.autocomplete.$el.querySelector('.v-label')
        // const inputControl = this.$refs.autocomplete.$el.querySelector('.v-input__control')
        //   const appendInner = this.$refs.autocomplete.$el.querySelector('.v-input__append-inner')
        //   const appendInnerLabel = this.$refs.autocomplete.$el.querySelector('.custom-users-autocomplete .v-label')
        //   const appendInnerInputIcon = this.$refs.autocomplete.$el.querySelector('.custom-users-autocomplete .v-input__icon--append')
        //   const appendInnerSelectSlot = this.$refs.autocomplete.$el.querySelector('.custom-users-autocomplete .v-select__slot')
        //   appendInnerSelectSlot.style.maxHeight = '160px'
        //   // if (appendInnerSelectSlot) {
        //   //   appendInnerSelectSlot.style.maxHeight = '160px'
        //   //   if (this.profileSearchFields.length !== 2) {
        //   //     appendInnerSelectSlot.style.maxHeight = '160px'
        //   //   } else {
        //   //     appendInnerSelectSlot.style.maxHeight = '115px'
        //   //   }
        //   // }
        const selectContainer = this.$refs.autocomplete.$el.querySelector('.custom-users-autocomplete .v-select__slot::-webkit-scrollbar-thumb')
        if (selectContainer) {
          console.log('111111111111111111')
          selectContainer.style.margin = '10px 4px 4px 4px'
        }

        //
        //   if (label && inputControl) {
        //     label.style.position = 'fixed'
        //     label.style.top = '8px'
        //     label.style.left = '12px'
        //     label.style.zIndex = '1000'
        //   }
        //
        //   if (appendInner && !(this.profileSearchFields.length === 2)) {
        //     console.log('AAAAAAAAAAAAAAAAAA')
        //     appendInner.style.position = 'fixed'
        //     appendInner.style.top = '240px'
        //     appendInner.style.right = '60px'
        //     appendInner.style.zIndex = '1000'
        //
        //     appendInnerLabel.style.position = 'fixed'
        //     appendInnerLabel.style.top = '248px'
        //     appendInnerLabel.style.left = '30px'
        //     appendInnerLabel.style.zIndex = '1000'
        //
        //     appendInnerInputIcon.style.position = 'fixed'
        //     appendInnerInputIcon.style.top = '244px'
        //     appendInnerInputIcon.style.left = '338px'
        //     appendInnerInputIcon.style.zIndex = '1000'
        //   } else {
        //     console.log('BBBBBBBBBBBBBBBBBBBBBB')
        //     appendInner.style.position = 'fixed'
        //     appendInner.style.top = '294px'
        //     appendInner.style.right = '60px'
        //     appendInner.style.zIndex = '1000'
        //
        //     appendInnerLabel.style.position = 'fixed'
        //     appendInnerLabel.style.top = '301px'
        //     appendInnerLabel.style.left = '30px'
        //     appendInnerLabel.style.zIndex = '1000'
        //
        //     appendInnerInputIcon.style.position = 'fixed'
        //     appendInnerInputIcon.style.top = '297px'
        //     appendInnerInputIcon.style.left = '328px'
        //     appendInnerInputIcon.style.zIndex = '1000'
        //   }
      })
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

.v-select__selections > :first-child {
  max-width: 223px!important;
}

.selected-item-full-name {
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-item-email {
  font-size: 14px;
  margin-left: 8px;
  color: grey;
  padding-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-display-name {
  white-space: nowrap;
}

.selected-option-background-color::before {
  background-color: transparent;
}

.custom-users-autocomplete .v-input__slot .v-select__slot label {
  padding-left: 8px !important;
}

.custom-users-autocomplete .v-input__append-inner {
  padding-right: 12px !important;
}

.custom-users-autocomplete .v-select__selections input {
  padding-left: 12px !important;
}

.custom-users-autocomplete .v-input__slot {
  padding: 0!important;
  //padding-top: 5px!important;
  //padding-left: 0!important;
  //padding-right: 0!important;
  ////padding-bottom: 5px!important;
}

.custom-users-autocomplete .v-select__selections{
  height: 100%;
}

.custom-users-autocomplete .v-select__slot .v-label--active {
  padding-top: 2px;
  //margin-top: -6px;
}

.custom-users-autocomplete .v-input__control fieldset {
  padding-left: 5px!important;
}

//.custom-users-autocomplete .v-input__control {
//  max-height: 160px;
//}

.custom-users-autocomplete .v-input__slot {
  //position: relative;
}

//.custom-users-autocomplete .v-input__slot {
//  overflow: hidden; /* or auto, depending on your design */
//}
//

.custom-users-autocomplete .v-select__slot .v-label {
  //display: inline-block!important;
  //position: sticky!important;

  left: 5px!important;
  //top: 12px!important;
  //bottom: 130px!important;
  z-index: 999!important;

  //right: 227px!important;
}

.custom-users-autocomplete .v-select__slot .v-input__append-inner:nth-child(3) {
  padding-right: 6px !important;
}

//.custom-users-autocomplete .v-select__slot .v-input__append-inner:nth-child(4) {
//  bottom: 117px;
//}

.custom-label{
  //position: sticky!important;
  //margin-top: 0!important;
}

.custom-users-autocomplete .v-input__control fieldset  {
  //top: -1px!important;
}

.custom-users-autocomplete .v-input__append-inner {
  position: sticky;
  top: 8px;
}

.custom-users-autocomplete .v-select__slot {
  //position: sticky;
  max-height: 160px!important;
  overflow: auto!important;
  overflow-x: hidden!important;
  margin-right: 2px!important;
  //margin-top: 6px!important;

  //flex-direction: column;

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
