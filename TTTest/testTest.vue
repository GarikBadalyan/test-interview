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
        <div class="custom-users-autocomplete__item-wrapper">
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
      <template #label>
        <span class="custom-label">{{ $t('common.users') }}</span>
      </template>
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

</v-col>
</v-row>
  <script setup>
  </script>