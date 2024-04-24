<template>
  <div style="float: left;">
    <!-- МАССОВЫЕ ДЕЙСТВИЯ - НАЗНАЧИТЬ ТЕГИ -->
    <div style="float: left;">
      <v-tooltip nudge-right="10px">
        <template v-slot:activator="{ on }">
          <v-btn
              small
              :disabled="!adsets.selected.length"
              color="primary"
              text
              style="min-width: 0; width: 30px; margin-top: 1px;"
              @click="$store.dispatch('adsets/openDialog', 'assignTags')"
              v-on="on"
          >
            <v-icon :size="12">
              fas fa-tags
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('common.tags') }}</span>
      </v-tooltip>
    </div>

    <!-- ПАУЗА -->
    <v-tooltip
        v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
        top
    >
      <template v-slot:activator="{ on }">
        <v-btn
            small
            color="primary"
            text
            style="min-width: 0; width: 30px; margin-top: 1px;"
            :disabled="adsets.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('adsets/openDialog', 'pause')"
        >
          <v-icon :size="14">
            fas fa-pause
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.pause') }}</span>
    </v-tooltip>

    <!-- ЗАПУСТИТЬ -->
    <v-tooltip
        v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
        top
    >
      <template v-slot:activator="{ on }">
        <v-btn
            small
            color="primary"
            text
            style="min-width: 0; width: 30px; margin-top: 1px;"
            :disabled="adsets.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('adsets/openDialog', 'start')"
        >
          <v-icon :size="14">
            fas fa-play
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.start') }}</span>
    </v-tooltip>

    <!-- БЮДЖЕТ И СТАВКА -->
    <v-tooltip
        v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
        top
    >
      <template v-slot:activator="{ on }">
        <v-btn
            small
            color="primary"
            text
            style="min-width: 0; width: 30px; margin-top: 1px;"
            :disabled="adsets.selected.length === 0"
            v-on="on"
            @click="openDialogBudgetAndBid"
        >
          <v-icon :size="14">
            fas fa-dollar-sign
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.budgetAndBid') }}</span>
    </v-tooltip>

    <!-- ДУБЛИРОВАТЬ -->
    <v-tooltip
        v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
        top
    >
      <template v-slot:activator="{ on }">
        <v-btn
            small
            color="primary"
            text
            style="min-width: 0; width: 30px; margin-top: 1px;"
            :disabled="adsets.selected.length === 0"
            v-on="on"
            @click="$store.dispatch('adsets/openDialog', 'duplicate')"
        >
          <v-icon :size="14">
            fas fa-copy
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.duplicate') }}</span>
    </v-tooltip>

    <!-- ПРОЧИЕ ДЕЙСТВИЯ -->
    <v-menu
        offset-y
        open-on-hover
        close-on-click
        content-class="adsmanager-topbar-actions-menu"
    >
      <template v-slot:activator="{ on }">
        <v-btn
            :disabled="adsets.selected.length === 0"
            small
            color="primary"
            text
            style="min-width: 0; width: 30px; margin-top: 1px;"
            v-on="on"
        >
          <v-icon :size="12">
            fas fa-ellipsis-v
          </v-icon>
        </v-btn>
      </template>
      <v-list class="adsmanager-topbar-actions-menu__list">
        <!-- МАССОВЫЕ ДЕЙСТВИЯ - Переименовать -->
        <v-list-item
            dense
            @click="$store.dispatch('adsets/openDialog', 'renameInFb')"
        >
          <v-list-item-title>{{ $t('common.renameInFb') }}</v-list-item-title>
        </v-list-item>

        <!-- МАССОВЫЕ ДЕЙСТВИЯ - ПАУЗА -->
        <!--        <div @click="showModalInFunctionality">-->
        <v-list-item
            dense
            @click="editSettings"
        >
          <v-list-item-title
              :class="{'inactive-element': disabledPauseItem}">
            {{ $t('adsmanager.adsets.editAdsetSettings') }}112
          </v-list-item-title>
        </v-list-item>
        <!--        </div>-->

        <!-- МАССОВЫЕ ДЕЙСТВИЯ - ПАУЗА -->
        <v-list-item
            v-if="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
            dense
            @click="$store.dispatch('adsets/openDialog', 'pause')"
        >
          <v-list-item-title>{{ $t('common.pause') }}</v-list-item-title>
        </v-list-item>

        <!-- МАССОВЫЕ ДЕЙСТВИЯ - ЗАПУСТИТЬ -->
        <v-list-item
            v-if="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
            dense
            @click="$store.dispatch('adsets/openDialog', 'start')"
        >
          <v-list-item-title>{{ $t('common.start') }}</v-list-item-title>
        </v-list-item>

        <!-- МАССОВЫЕ ДЕЙСТВИЯ - ДУБЛИРОВАТЬ -->
        <v-list-item
            v-if="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
            dense
            @click="$store.dispatch('adsets/openDialog', 'duplicate')"
        >
          <v-list-item-title>{{ $t('common.duplicate') }}</v-list-item-title>
        </v-list-item>

        <v-list-item
            v-if="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
            dense
            @click="openDialogBudgetAndBid"
        >
          <v-list-item-title>{{ $t('common.budgetAndBid') }}</v-list-item-title>
        </v-list-item>

        <v-list-item
            dense
            @click="archive"
        >
          <v-list-item-title>{{ $t('common.archive') }}</v-list-item-title>
        </v-list-item>

        <v-list-item
            dense
            @click="unarchive"
        >
          <v-list-item-title>{{ $t('common.unarchive') }}</v-list-item-title>
        </v-list-item>

        <topbar-action-delete-in-fb />
      </v-list>
    </v-menu>

    <!-- СЧЕТЧИК -->
    <span
        class="body-2 ml-1 selected"
        :style="{color: adsets.selected.length > 0 ? '' : 'gray', fontSize: $vuetify.breakpoint.xs ? '12px !important' : ''}"
    >
      {{ $t('common.selected') }} : {{ adsets.selected.length }}
    </span>

  </div>
</template>

<script>
import MultipleDelete         from '@/components/adsmanager/accounts/AccountsMultipleDelete.vue';
import MultipleTokensCheck    from '@/components/adsmanager/accounts/AccountsMultipleTokensCheck.vue';
import TopbarActionDeleteInFb from '@/components/adsmanager/adsets/adsetTopbarActions/AdsetTopbarActionDeleteInFb.vue';
import { mapFields }          from 'vuex-map-fields';
import { mapGetters }         from 'vuex';
import {FB_LIGHT} from '@/constants/common/tarrifs';

export default {
  name: 'AdsetsTopbarActions',

  components: {
    TopbarActionDeleteInFb,
    MultipleTokensCheck,
    MultipleDelete
  },

  computed: {
    ...mapGetters({
      adsets: 'adsets/adsets',
      selected: 'adsets/selected',
      profile: 'main/profile',
    }),

    ...mapFields('adsmanager', ['dialogBudgetAndBid']),

    disabledPauseItem() {

    },
  },

  methods: {
    openDialogBudgetAndBid() {
      this.dialogBudgetAndBid.type = 'adset';
      this.$store.dispatch('adsmanager/openDialog', 'budgetAndBid');
    },

    unarchive() {
      if (confirm(this.$t('common.confirmPlease'))) {
        const data = {
          adsetsIds: this.selected.map(adset => adset.id),
          isArchive: false,
        };
        this.handleArchive(data);
      }
    },

    archive() {
      if (confirm(this.$t('common.confirmPlease'))) {
        const data = {
          adsetsIds: this.selected.map(adset => adset.id),
          isArchive: true
        };
        this.handleArchive(data);
      }
    },

    async handleArchive(data) {
      try {
        await this.api.patch('/fb-adsets/archive', data);

        await this.$store.dispatch('main/alert', {
          color: 'success',
          message: data.isArchive ? this.$t('common.archiveDone') : this.$t('common.unarchived')
        }, {
          root: true
        });

        await this.$store.dispatch('adsets/loadAdsets');
        this.$store.dispatch('adsets/setSelected', []);
      } catch (e) {
        this.$store.dispatch('main/apiError', e, {
          root: true
        });
      }
    },

    showModalInFunctionality() {
      this.$store.dispatch('accounts/setFunctionalityNotAvailable', true);
    },

    editSettings() {
      if (this.disabledPauseItem){
        this.showModalInFunctionality();
        return;
      }

      this.$store.dispatch('adsets/openDialog', 'editSettings');
    },
  }
};
</script>

<style>
.menu-icon {
  min-width: 0;
  width: 30px;
  margin-top: 1px;
}

.selected {
  white-space: nowrap;
}

.adsmanager-topbar-actions-menu__list {
  max-height: calc(100vh - 40px)!important;
  overflow-y: auto!important;
  overflow-x: hidden;
}

.inactive-element {
  color: #fff9;
}
</style>
