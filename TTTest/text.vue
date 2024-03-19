<template>
  <div v-if="profile && profile.role && ['admin', 'teamlead'].includes(profile.role)">
    <v-autocomplete
        id="browserProfilesFiltersBarUsersTextarea"
        :value="filters.users"
        :search-input.sync="filtersUsers"
        :item-value="user => user.id"
        :item-text="generateUserSelectItem"
        :items="computedUsers"
        :label="$t('common.users')"
        :menu-props="{ closeOnContentClick: isSelectedOpen }"
        multiple
        small-chips
        deletable-chips
        clearable
        dense
        outlined
        full-width
        hide-details
        class="densed-input selected-items-list-block"
        :disabled="profile && profile.role === 'user'"
        @change="filterByUsers"
    >
      <template #[`item`]="{item}">
        <div
            style="display: flex"
        >
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
              class="select-item-email"
          >{{ item.username }}
                  </span>
        </div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>



<template>
  <div v-if="profile && profile.role && ['admin', 'teamlead'].includes(profile.role)">
    <v-autocomplete
        ref="autocomplete"
        id="browserProfilesFiltersBarUsersTextarea"
        :value="filters.users"
        :search-input.sync="filtersUsers"
        :item-value="user => user.id"
        :item-text="generateUserSelectItem"
        :items="computedUsers"
        :label="$t('common.users')"
        :menu-props="{ closeOnContentClick: isSelectedOpen }"
        multiple
        small-chips
        deletable-chips
        clearable
        dense
        outlined
        full-width
        hide-details
        class="densed-input selected-items-list-block"
        :disabled="profile && profile.role === 'user'"
        @change="filterByUsers"
    >
      <template #[`item`]="{ item }">
        <div
            style="display: flex"
        >
          <v-simple-checkbox
              color="primary"
              :value="isSelected(item)"
              @click="handleCheckboxClick(item)"
          />
          <!-- отображаемое имя -->
          <span>
            {{ item.displayName || item.username }}
            <span v-if="item.id === profile.id">({{ $t('common.you').toLowerCase() }})</span>
          </span>

          <!-- почта, если есть отображаемое имя -->
          <span v-if="item.displayName" class="select-item-email">{{ item.username }}</span>
        </div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedItems: [],
    };
  },
  methods: {
    handleCheckboxClick(item) {
      // Handle checkbox click logic

      // Toggle selection
      if (this.isSelected(item)) {
        this.selectedItems = this.selectedItems.filter((selectedItem) => selectedItem !== item);
      } else {
        this.selectedItems.push(item);
      }
    },
    isSelected(item) {
      // Check if the item is selected
      return this.selectedItems.includes(item);
    },
  },
};
</script>

<style scoped>
.v-select-list {
  background-color: blue; /* Change this to the desired color */
  color: white; /* Change text color if needed */
}
</style>
