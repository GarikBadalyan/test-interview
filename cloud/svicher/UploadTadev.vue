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

    isCustomNaming1() {
      const hasNamingCabs = this.selectedCabs.filter(item => {
        return this.cabsOptions[item.id].selectedFields.includes('customNaming');
      });
      console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      if (!hasNamingCabs.length) {
        return false;
      }

      if (hasNamingCabs.length === this.selectedCabs.length) {
        return true;
      }

      return true;
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
        // console.log('selectedCabs', this.selectedCabs);
        console.log('this.cabsOptions11', this.cabsOptions);
        console.log('newVal-5-5', newVal);
        console.log('oldValue-5-5', oldValue);
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

    async updateSelectedCabs(newSelectedCabs, oldSelectedCabs) {
      console.log('updateSelectedCabs111');

      let currentSelectedCabinet = newSelectedCabs.filter(obj1 => !oldSelectedCabs.some(obj2 => obj1['id'] === obj2['id']));
      const optionsToUpdate = [
        { condition: this.isCustomNaming1, field: 'customNaming'},
        { condition: this.isUrlParams, field: 'urlParams'},
        { condition: this.isDisplayUrl, field: 'displayUrl'},
      ];

      for (const option of optionsToUpdate) {
        if (option.condition) {
          await this.$store.dispatch('upload_wizard/setCabOption', {
            id: currentSelectedCabinet[0].id,
            key: 'selectedFields',
            value: [option.field],
          });
        }
      }
    },

    async updateInputFieldStatus(value, selectedValue) {
      switch (selectedValue) {
          // case 'customNaming':
          //   await this.$store.dispatch('upload_wizard/isCustomNaming', value);
          //   break;

        case 'urlParams':
          await this.$store.dispatch('upload_wizard/isUrlParams', value);
          break;

        case 'displayUrl':
          await this.$store.dispatch('upload_wizard/isDisplayUrl', value);
          break;
      }
    },

    async changeCabOption(isAdd, key, selectedValue) {
      // await this.updateInputFieldStatus(isAdd, selectedValue);

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
          console.log('id' ,id);
          console.log('key' ,key);
          console.log('selectedFields' ,selectedFields);
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







































