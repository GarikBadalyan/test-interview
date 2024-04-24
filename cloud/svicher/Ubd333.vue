<template>
  <div class="d-flex justify-space-between align-center pa-2">
    <div class="d-flex justify-space-between align-center pa-2">
      <v-switch
          :input-value="onlySelectedCabs"
          :label="$t('upload.wizard.static.filter.onlySelected')"
          :disabled="!selectedCabs.length"
          dense
          hide-details
          class="ml-3 mt-0 pt-0"
          @change="handleOnlySelectedCabs"
      />

      <div
          v-if="hasAdvertiserAds"
          class="d-flex justify-space-between align-center pa-2"
      >
        <v-switch
            :input-value="isCustomNaming()"
            :label="$t('upload.wizard.static.customNaming')"
            :disabled="!selectedCabs.length"
            dense
            hide-details
            class="ml-3 mt-0 pt-0"
            @change="changeCabOption($event,'selectedFields', 'customNaming')"
        />

        <v-switch
            :input-value="isUrlParams()"
            :label="$t('common.urlParams')"
            :disabled="!selectedCabs.length"
            dense
            hide-details
            class="ml-3 mt-0 pt-0"
            @change="changeCabOption($event,'selectedFields', 'urlParams')"
        />

        <v-switch
            :input-value="isDisplayUrl()"
            :label="$t('common.displayUrl')"
            :disabled="!selectedCabs.length"
            dense
            hide-details
            class="ml-3 mt-0 pt-0"
            @change="changeCabOption($event,'selectedFields', 'displayUrl')"
        />
      </div>
    </div>

    <div
        v-if="objectiveList.includes(objective)"
        class="d-flex align-center"
    >
      <v-btn
          text
          color="primary"
          @click="forAll = true;"
      >
        <v-icon
            small
            left
        >
          fas fa-plus
        </v-icon>
        {{ objective === 'APP_INSTALLS' ? $t('upload.wizard.static.links.deepLinkForAll') : $t('upload.wizard.static.links.linkForAll') }}
      </v-btn>

      <dialogs-for-all
          v-if="forAll"
          :is-opened="forAll"
          @closeDialog="forAll = false;"
      />
    </div>
  </div>
</template>

<script>
import {
  CONVERSIONS,
  APP_INSTALLS,
  CONVERSIONS_LANDING_PAGE_VIEWS,
  TRAFFIC
} from '@/constants/upload/consideration-types';
import { mapGetters } from 'vuex';

import DialogsForAll  from '../dialogs/UploadWizardMainStepperAdAccountsDialogsForAll';

export default {
  name: 'UploadWizardMainStepperAdAccountsTableTopbar',

  components: {
    DialogsForAll
  },

  data() {
    return {
      forAll: false,
      objectiveList: [CONVERSIONS, 'LINK_CLICKS', APP_INSTALLS],
      updateSelectedCabinet: [],
      customNaming: false,
      urlParams: false,
      displayUrl: false,
    };
  },

  computed: {
    ...mapGetters({
      onlySelectedCabs: 'upload_wizard/onlySelectedCabs',
      selectedCabs: 'upload_wizard/selectedCabs',
      job: 'upload_wizard/job',
      cabsOptions: 'upload_wizard/cabsOptions',
    }),

    objective() {
      return this.job && this.job.objective;
    },

    // isCustomNaming() {
    //   const hasNamingCabs = this.selectedCabs.filter(item => {
    //     return this.cabsOptions[item.id].selectedFields.includes('customNaming');
    //   });
    //
    //   if (!hasNamingCabs.length) {
    //     console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
    //     this.isNaming2 = false;
    //     return false;
    //   }
    //
    //   if (hasNamingCabs.length === this.selectedCabs.length) {
    //     console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    //     return true;
    //   }
    //
    //   return this.isNaming2;
    // },

    // isUrlParams() {
    //   const hasNamingCabs = this.selectedCabs.filter(item => {
    //     return this.cabsOptions[item.id].selectedFields.includes('urlParams');
    //   });
    //
    //   if (!hasNamingCabs.length) {
    //     return false;
    //   }
    //
    //   if (hasNamingCabs.length === this.selectedCabs.length) {
    //     return true;
    //   }
    //
    //   return true;
    // },

    // isDisplayUrl() {
    //   const hasNamingCabs = this.selectedCabs.filter(item => {
    //     return this.cabsOptions[item.id].selectedFields.includes('displayUrl');
    //   });
    //
    //   if (!hasNamingCabs.length) {
    //     return false;
    //   }
    //
    //   if (hasNamingCabs.length === this.selectedCabs.length) {
    //     return true;
    //   }
    //
    //   return true;
    // },

    hasAdvertiserAds() {
      return (this.job.objective === CONVERSIONS
          || this.job.objective === CONVERSIONS_LANDING_PAGE_VIEWS
          || this.job.objective === TRAFFIC
      );
    },
  },

  watch: {
    'selectedCabs': {
      async handler(newVal , oldValue) {
        if (this.onlySelectedCabs && this.$_.isEmpty(newVal)) {
          await this.handleOnlySelectedCabs(false);
        }
        this.updateSelectedCabinet = [...newVal];
        if (newVal.length > oldValue.length) {
          await this.updateSelectedCabs(newVal, oldValue);
        }
      }
    }
  },

  methods: {
    async handleOnlySelectedCabs(value) {
      await this.$store.dispatch('upload_wizard/onlySelectedCabs', value);
      this.$store.dispatch('upload_wizard/loadCabs');
    },

    isCustomNaming() {
      const hasNamingCabs = this.selectedCabs.filter(item => {
        return this.cabsOptions[item.id].selectedFields.includes('customNaming');
      });

      if (!hasNamingCabs.length) {
        console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
        this.customNaming = false;
        return false;
      }

      if (hasNamingCabs.length === this.selectedCabs.length) {
        this.customNaming = true;
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        return true;
      }

      return this.customNaming;
    },

    isUrlParams() {
      const hasNamingCabs = this.selectedCabs.filter(item => {
        return this.cabsOptions[item.id].selectedFields.includes('urlParams');
      });

      if (!hasNamingCabs.length) {
        this.urlParams = false;
        return false;
      }

      if (hasNamingCabs.length === this.selectedCabs.length) {
        this.urlParams = true;
        return true;
      }

      return this.urlParams;
    },

    isDisplayUrl() {
      const hasNamingCabs = this.selectedCabs.filter(item => {
        return this.cabsOptions[item.id].selectedFields.includes('displayUrl');
      });

      if (!hasNamingCabs.length) {
        this.displayUrl = false;
        return false;
      }

      if (hasNamingCabs.length === this.selectedCabs.length) {
        this.displayUrl = true;
        return true;
      }

      return this.displayUrl;
    },

    async updateSelectedCabs(newSelectedCabs, oldSelectedCabs) {
      //Конкретно какой кабинет выбрали
      let currentSelectedCabinet = newSelectedCabs.filter(item => !oldSelectedCabs.some(elem => item['id'] === elem['id']));
      let selectedFields = [];
      const optionsToUpdate = [
        { condition: this.isCustomNaming(), field: 'customNaming'},
        { condition: this.isUrlParams(), field: 'urlParams'},
        { condition: this.isDisplayUrl(), field: 'displayUrl'},
      ];

      for (const option of optionsToUpdate) {
        if (option.condition) {
          selectedFields.push(option.field);
          await this.$store.dispatch('upload_wizard/setCabOption', {
            id: currentSelectedCabinet[0].id,
            key: 'selectedFields',
            value: selectedFields
          });
        }
      }

    },

    async changeCabOption(isAdd, key, selectedValue) {
      console.log('this[selectedValue]',this[selectedValue]);
      this[selectedValue] = isAdd;

      for (const id in this.cabsOptions) {
        if (this.updateSelectedCabinet.some(item => item.id === id)) {
          let selectedFields = [...this.cabsOptions[id].selectedFields];
          // console.log('selectedFields333', selectedFields);
          const includesValue = selectedFields.includes(selectedValue);

          if (isAdd && !includesValue) {
            selectedFields = [...selectedFields, selectedValue];
          }

          if (!isAdd && includesValue) {
            selectedFields = selectedFields.filter(field => field !== selectedValue);
          }

          await this.$store.dispatch('upload_wizard/setCabOption', {
            id,
            key,
            value: selectedFields,
          });
        }
      }
    }
  }
};
</script>