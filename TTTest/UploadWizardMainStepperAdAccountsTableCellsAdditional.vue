<template>
  <td class="pa-2 pl-0">
    <v-menu
        offset-y
        :close-on-content-click="false"
    >
      <template #activator="{ on, attrs }">
        <v-btn
            block
            color="grey"
            outlined
            :disabled="!selected"
            v-bind="attrs"
            v-on="on"
        >
          <v-icon
              size="12"
              color="primary"
              class="mr-1"
          >
            fas fa-plus
          </v-icon>
          {{ $t('upload.wizard.addFields') }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item-group
            :value="cabOption.selectedFields"
            multiple
            @change="changeCabOption($event, 'selectedFields')"
        >
          <v-list-item
              v-for="field in fields"
              :key="`UploadWizardMainStepperAdAccountsTableCellsStatus-${field.value}`"
              :value="field.value"
          >
            <template #default="{ active }">
              <v-list-item-action class="mr-3">
                <v-checkbox
                    :input-value="active"
                    color="primary"
                />
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t(field.translation) }}

                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-icon
                          class="ml-1"
                          :size="16"
                          v-on="on"
                      >
                        far fa-question-circle
                      </v-icon>
                    </template>
                    <span>{{ $t(field.hintTranslation) }}</span>
                  </v-tooltip>
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>

    <!-- КАСТОМНЫЙ НЕЙМИНГ -->
    <v-text-field
        v-if="wizardOptions.uploadWithNaming && !customIncludes('customNaming')"
        :value="cabOption.customNaming"
        :label="`${$t('upload.wizard.static.customCampaignName')}*`"
        outlined
        dense
        hide-details
        :disabled="!selected"
        class="centralize-append-outer mt-2"
        @input="changeCabOption($event, 'customNaming')"
    >
      <template #append-outer>
        <v-btn
            icon
            small
            @click="copyCustomNamingToAnother('customNaming', cabOption.customNaming)"
        >
          <v-icon>clear_all</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-text-field
        v-if="customIncludes('customNaming')"
        :value="cabOption.customNaming"
        :label="$t('upload.wizard.static.customNaming')"
        outlined
        dense
        :disabled="!selected"
        hide-details
        class="mt-2 centralize-append-outer"
        @input="changeCabOption($event, 'customNaming')"
    >
      <template #append-outer>
        <v-btn
            icon
            small
            @click="copyToAnother('customNaming')"
        >
          <v-icon>clear_all</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <!-- КАСТОМНЫЙ НЕЙМИНГ КОНЕЦ -->

    <!-- ПАРАМЕТРЫ URL -->
    <v-text-field
        v-if="customIncludes('urlParams')"
        :value="cabOption.urlParams"
        :label="$t('common.urlParams')"
        outlined
        dense
        :disabled="!selected"
        hide-details
        class="mt-2 centralize-append-outer"
        @input="changeCabOption($event, 'urlParams')"
    >
      <template #append-outer>
        <v-btn
            icon
            small
            @click="copyToAnother('urlParams')"
        >
          <v-icon>clear_all</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <!-- ПАРАМЕТРЫ URL КОНЕЦ -->

    <!-- ОТОБРАЖАЕМЫЙ URL -->
    <v-text-field
        v-if="customIncludes('displayUrl')"
        :value="cabOption.displayUrl"
        :label="$t('common.displayUrl')"
        outlined
        dense
        :disabled="!selected"
        hide-details
        class="mt-2 centralize-append-outer"
        @input="changeCabOption($event, 'displayUrl')"
    >
      <template #append-outer>
        <v-btn
            icon
            small
            @click="copyToAnother('displayUrl')"
        >
          <v-icon>clear_all</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <!-- ОТОБРАЖАЕМЫЙ URL КОНЕЦ -->

    <!-- ОТСЛЕЖИВАНИЕ ДОМЕНА -->
    <v-text-field
        v-if="customIncludes('domainTracking')"
        :value="cabOption.domainTracking"
        :label="$t('upload.wizard.static.domainTracking')"
        outlined
        dense
        :disabled="!selected"
        hide-details
        class="mt-2 centralize-append-outer"
        @input="changeCabOption($event, 'domainTracking')"
    >
      <template #append-outer>
        <v-btn
            icon
            small
            @click="copyToAnother('domainTracking')"
        >
          <v-icon>clear_all</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <!-- ОТСЛЕЖИВАНИЕ ДОМЕНА КОНЕЦ -->
  </td>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UploadWizardMainStepperAdAccountsTableCellsAdditional',

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      fields: [
        {
          value: 'customNaming',
          translation: 'upload.wizard.static.customNaming',
          hintTranslation: 'upload.wizard.static.customNaming',
        },
        {
          value: 'urlParams',
          translation: 'common.urlParams',
          hintTranslation: 'common.urlParams',
        },
        {
          value: 'displayUrl',
          translation: 'common.displayUrl',
          hintTranslation: 'common.displayUrl',
        },
        {
          value: 'domainTracking',
          translation: 'upload.wizard.static.domainTracking',
          hintTranslation: 'upload.wizard.static.domainTracking',
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      cabs: 'upload_wizard/cabs',
      cabsOptions: 'upload_wizard/cabsOptions',
      wizardOptions: 'upload_wizard/wizardOptions',
      selectedCabs: 'upload_wizard/selectedCabs',
    }),

    selected() {
      return this.cabs.selected.findIndex(i => i.id === this.item.id) > -1;
    },

    cabOption() {
      return this.cabsOptions[this.item.id] || {};
    }
  },

  methods: {
    changeCabOption(value, key) {
      console.log('value-0000000000', value);
      console.log('key-010101010101', key);
      console.log('selectedCabs1', this.selectedCabs);

      // console.log('this.cabsOptions', this.cabsOptions);
      // console.log('Object.keys', Object.keys(this.cabsOptions).length);
      this.$store.dispatch('upload_wizard/setCabOption', {
        id: this.item.id,
        key,
        value
      });
    },

    copyToAnother(key) {
      this.$store.dispatch('upload_wizard/copyAdditionalToOtherCabs', {
        id: this.item.id,
        key,
        value: this.cabOption[key],
      });
    },

    customIncludes(key) {
      return this.cabOption &&
          this.cabOption.selectedFields &&
          this.cabOption.selectedFields.includes(key);
    },

    copyCustomNamingToAnother(key, value) {
      this.$store.dispatch('upload_wizard/copyToOtherCabs', {
        id: this.item.id,
        key,
        value,
      });
    }
  }
};
</script>
