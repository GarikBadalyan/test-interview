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
            :input-value="isCustomNaming1"
            :label="$t('upload.wizard.static.customNaming')"
            :disabled="!selectedCabs.length"
            dense
            hide-details
            class="ml-3 mt-0 pt-0"
            @change="changeCabOption($event,'selectedFields', 'customNaming')"
        />

        <v-switch
            :input-value="isUrlParams"
            :label="$t('common.urlParams')"
            :disabled="!selectedCabs.length"
            dense
            hide-details
            class="ml-3 mt-0 pt-0"
            @change="changeCabOption($event,'selectedFields', 'urlParams')"
        />

        <v-switch
            :input-value="isDisplayUrl"
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
      updateSelectedCabinet: []
    };
  },

  computed: {
    ...mapGetters({
      onlySelectedCabs: 'upload_wizard/onlySelectedCabs',
      selectedCabs: 'upload_wizard/selectedCabs',
      job: 'upload_wizard/job',
      cabsOptions: 'upload_wizard/cabsOptions',
      isCustomNaming: 'upload_wizard/isCustomNaming',
      isUrlParams: 'upload_wizard/isUrlParams',
      isDisplayUrl: 'upload_wizard/isDisplayUrl',
    }),

    objective() {
      return this.job && this.job.objective;
    },

    isCustomNaming() {
      return this.cabsOptions
    },


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
          await this.updateSelectedCabs();
        }
      }
    }
  },

  methods: {
    async handleOnlySelectedCabs(value) {
      await this.$store.dispatch('upload_wizard/onlySelectedCabs', value);
      this.$store.dispatch('upload_wizard/loadCabs');
    },

    async updateSelectedCabs() {
      const optionsToUpdate = [
        { condition: this.isCustomNaming, field: 'customNaming'},
        { condition: this.isUrlParams, field: 'urlParams'},
        { condition: this.isDisplayUrl, field: 'displayUrl'},
      ];

      for (const option of optionsToUpdate) {
        if (option.condition) {
          await this.changeCabOption(true, 'selectedFields', option.field);
        }
      }
    },

    async updateInputFieldStatus(value, selectedValue) {
      switch (selectedValue) {
        case 'customNaming':
          await this.$store.dispatch('upload_wizard/isCustomNaming', value);
          break;

        case 'urlParams':
          await this.$store.dispatch('upload_wizard/isUrlParams', value);
          break;

        case 'displayUrl':
          await this.$store.dispatch('upload_wizard/isDisplayUrl', value);
          break;

        default:
          console.log(`Unknown selectedValue: ${selectedValue}`);
          break;
      }
    },

    async changeCabOption(isAdd, key, selectedValue) {
      await this.updateInputFieldStatus(isAdd, selectedValue);
      // console.log('this.cabsOptions-4-4', this.cabsOptions);
      // console.log(' this.updateSelectedCabinet',  this.updateSelectedCabinet);
      for (const id in this.cabsOptions) {
        if (!this.updateSelectedCabinet.some(item => item.id === id)) {
          continue;
        }

        let selectedFields = [...this.cabsOptions[id].selectedFields];
        // console.log('selectedFields22', selectedFields);
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
};
</script>
