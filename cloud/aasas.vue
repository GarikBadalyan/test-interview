<template>
  <div
      style="float: left;"
      class="d-flex"
  >
    <!-- МАССОВЫЕ ДЕЙСТВИЯ - НАЗНАЧИТЬ ТЕГИ -->
    <v-tooltip nudge-right="10px">
      <template #activator="{ on }">
        <v-btn
            small
            :disabled="cabs.selected.length === 0"
            color="primary"
            icon
            @click="$store.dispatch('cabs/openDialog', 'assignTags')"
            v-on="on"
        >
          <v-icon :size="12">
            fas fa-tags
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.tags') }}</span>
    </v-tooltip>
    <v-tooltip nudge-right="25px">
      <template #activator="{ on }">
        <v-btn
            small
            :disabled="cabs.selected.length === 0"
            color="primary"
            icon
            @click="archive"
            v-on="on"
        >
          <v-icon :size="12">
            fas fa-archive
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.archive') }}</span>
    </v-tooltip>

    <!-- СОЗДАТЬ РЕКЛАМУ -->
    <v-tooltip
        v-if="profile.fbPlan !== 'Fb Base'"
        top
    >
      <template #activator="{ on }">
        <div @click="showModalInFunctionality">
          <v-btn
              small
              color="primary"
              icon
              :disabled="hasAccessFunctionalForTariffs || cabs.selected.length === 0"
              v-on="on"
              @click="handleClick"
          >
            <v-icon :size="12">
              fas fa-cloud-upload-alt
            </v-icon>
          </v-btn>
        </div>
      </template>
      <span>{{ $t('common.createAd') }}</span>
    </v-tooltip>

    <!-- ПРОЧИЕ ДЕЙСТВИЯ -->
    <v-menu
        offset-y
        :open-on-hover="($vuetify.breakpoint.sm || $vuetify.breakpoint.xs) ? false : true"
        close-on-click
        :close-on-content-click="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? false : true"
        content-class="adsmanager-topbar-actions-menu"
    >
      <template v-slot:activator="{ on }">
        <v-btn
            :disabled="cabs.selected.length === 0"
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
      <v-list
          class="adsmanager-topbar-actions-menu__list"
          @scroll.native="scrollHandler"
      >
        <!-- ПРИВЯЗАТЬ КАРТУ МУЛЬТИ -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctional"
              @click="$store.dispatch('cabs/openDialog', 'attachCard')"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.attachBankCard') }}</v-list-item-title>
          </v-list-item>
        </div>
        <!-- ПРИВЯЗКА КАРТ БМа -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctionalForTariffs"
              @click="$store.dispatch('cabs/openDialog', 'attachCardToBm')"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.attachBankCardToBm') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- ПОПОЛНЕНИЕ КАБИНЕТА -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctional"
              @click="$store.dispatch('cabs/openDialog', 'adAccountPayment')"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.adAccountPayment') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- Перевод в предоплату -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctionalForTariffs"
              @click="$store.dispatch('cabs/openDialog', 'transferToPrepaid');"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.transferToPrepaid') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- ИЗМЕНИТЬ СТРАНУ -->
        <v-list-item
            dense
            @click="$store.dispatch('cabs/openDialog', 'changeCountry')"
        >
          <v-list-item-title>{{ $t('adsmanager.cabs.actions.changeBillingCountry') }}</v-list-item-title>
        </v-list-item>

        <!-- УДАЛИТЬ VAT/TAX ID UA -->
        <v-list-item
            dense
            @click="$store.dispatch('cabs/openDialog', 'deleteIdUA')"
        >
          <v-list-item-title>{{ $t('adsmanager.cabs.actions.deleteIdUA') }}</v-list-item-title>
        </v-list-item>

        <v-divider />

        <!-- ПЕРЕИМЕНОВАТЬ -->
        <v-list-item
            dense
            @click="rename"
        >
          <v-list-item-title>{{ $t('adsmanager.cabs.actions.rename') }}</v-list-item-title>
        </v-list-item>

        <!-- ДЕАКТИВИРОВАТЬ КАБИНЕТ -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctional"
              @click="$store.dispatch('cabs/openDialog', 'deactivateAdAccount')"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.deactivateAdAccount') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- СОЗДАТЬ ПИКСЕЛЬ -->
        <v-list-item
            dense
            @click="createPixel"
        >
          <v-list-item-title>{{ $t('adsmanager.cabs.actions.createPixel') }}</v-list-item-title>
        </v-list-item>
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctional"
              @click="setCostLimit"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.costLimit') }}</v-list-item-title>
          </v-list-item>
        </div>

        <v-divider />

        <!-- ПЕРЕДАТЬ КАБИНЕТ -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctionalForTariffs"
              @click="shareAdAccount"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.shareAdAccount') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- ПЕРЕДАТЬ КАБИНЕТ НА БМ -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctionalForTariffs"
              @click="shareAdAccountToBm"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.shareAdAccountToBm') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- ВКЛЮЧИТЬ УВЕДОМЛЕНИЯ -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctional"
              @click="notificationsOn"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.turnOnNotifications') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- ОТКЛЮЧИТЬ УВЕДОМЛЕНИЯ -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctional"
              @click="notificationsOff"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.turnOffNotifications') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- ПОДТВЕРДИТЬ АККАУНТ RISK PAYMENT -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctionalForTariffs"
              @click="$store.dispatch('cabs/openDialog', 'verifyAccountRiskPayment')"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.verifyAccountRiskPayment') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- ОТПРАВИТЬ ОБЖАЛОВАНИЕ БАНА -->
        <v-list-item
            v-if="showOnlyForSupport()"
            dense
            @click="$store.dispatch('cabs/openDialog', 'appealBlock')"
        >
          <v-list-item-title>{{ $t('adsmanager.cabs.appealCabBlock') }}</v-list-item-title>
        </v-list-item>
        <v-divider />

        <!-- ПРИМЕНИТЬ АВТОПРАВИЛО -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctional"
              @click="$store.dispatch('cabs/openDialog', 'applyAutomationRule')"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.applyAutomationRule') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- ПРИМЕНИТЬ ГРУППУ АВТОПРАВИЛ -->
        <div @click="showModalInFunctionality">
          <v-list-item
              dense
              :disabled="hasAccessFunctional"
              @click="$store.dispatch('cabs/openDialog', 'applyAutomationRulesGroup')"
          >
            <v-list-item-title>{{ $t('adsmanager.cabs.actions.applyAutomationRulesGroup') }}</v-list-item-title>
          </v-list-item>
        </div>

        <!-- ЭКСПОРТ -->
        <v-list-item
            dense
        >
          <v-list-item-title>
            {{ $t('adsmanager.cabs.actions.dataExport') }}
            <data-export :scroll-pos="scrollPos" />
          </v-list-item-title>
        </v-list-item>
        <!-- КОНЕЦ ЭКСПОРТ -->

        <v-list-item
            dense
            @click="unArchive"
        >
          <v-list-item-title>{{ $t('common.unarchive') }}</v-list-item-title>
        </v-list-item>

        <!-- КНОПКИ ДЕЙСТВИЙ - СТОЛБЦЫ -->
        <v-list-item
            v-if="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
            dense
        >
          <topbar-cols />
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- СЧЕТЧИК -->
    <span
        class="body-2 ml-1 selected"
        :style="{color: cabs.selected.length > 0 ? '' : 'gray', fontSize: $vuetify.breakpoint.xs ? '12px !important' : ''}"
    >
      {{ $t('common.selected') }} : {{ cabs.selected.length }}
    </span>
  </div>
</template>

<script>
import {mapGetters}          from 'vuex';

import TopbarCols            from '../AdsManagerTopbarCols';
import DataExport            from '../AdsmanagerTopbarActionDataExport.vue';

export default {
  name: 'CabsTopbarActions',

  components: {
    TopbarCols,
    DataExport,
  },

  data: () => ({
    scrollPos: 0
  }),

  computed: {
    ...mapGetters({
      cabs: 'cabs/cabs',
      profile: 'main/profile'
    }),

    selectedCabsIds() {
      return this.cabs.selected.map(cab => cab.id).join();
    },

    hasAccessFunctional() {
      return (
          this.profile.fbSubscription.plan.slug === 'fb_light'
      );
    },

    hasAccessFunctionalForTariffs() {
      return (
          this.profile.fbSubscription.plan.slug === 'fb_light' ||
          this.profile.fbSubscription.plan.slug === 'fb_start'
      );
    },
  },

  created() {
    console.log('this.profile.fbSubscription.plan.slug 332', this.profile.fbSubscription.plan.slug );
  },

  methods: {
    scrollHandler(e) {
      this.scrollPos = e.target.scrollTop;
    },

    shareAdAccountToBm() {
      this.$store.dispatch('cabs/openDialog', 'shareAdAccountToBm');
    },

    shareAdAccount() {
      this.$store.dispatch('cabs/openDialog', 'shareAdAccount');
    },

    rename() {
      this.$store.dispatch('cabs/openDialog', 'rename');
    },

    createPixel() {
      if (confirm(this.$t('common.confirmPlease'))) {
        this.$store.dispatch('cabs/openDialog', 'createPixel');
      }
    },

    setCostLimit() {
      this.$store.dispatch('cabs/openDialog', 'costLimit');
    },

    unarchive() {
      if (confirm(this.$t('common.confirmPlease'))) {
        this.$store.dispatch('cabs/openDialog', 'unarchive');
      }
    },

    notificationsOff() {
      if (confirm(this.$t('common.confirmPlease'))) {
        this.$store.dispatch('cabs/openDialog', 'notificationsOff');
      }
    },

    notificationsOn() {
      if (confirm(this.$t('common.confirmPlease'))) {
        this.$store.dispatch('cabs/openDialog', 'notificationsOn');
      }
    },

    showOnlyForSupport() {
      return location.href.search('193.168.3.107') > -1;
    },

    handleCreateAdClick() {
      this.$router.push({path: `/app/fb/upload/wizard/?cabs=${this.selectedCabsIds}`});
    },

    handleClick() {
      if (!(this.hasAccessFunctional || this.cabs.selected.length === 0)) {
        this.handleCreateAdClick();
      } else {
        this.showModalInFunctionality();
      }
    },

    archive() {
      if (confirm(this.$t('common.confirmPlease'))) {
        const data = {
          adAccountIds: this.cabs.selected.map(cab => cab.id),
          isArchive: true,
        };
        this.$store.dispatch('cabs/archive', data);
      }
    },

    unArchive() {
      if (confirm(this.$t('common.confirmPlease'))) {
        const data = {
          adAccountIds: this.cabs.selected.map(cab => cab.id),
          isArchive: false,
        };
        this.$store.dispatch('cabs/archive', data);
      }
    },

    showModalInFunctionality() {
      this.$store.dispatch('accounts/setFunctionalityNotAvailable', true);
    },
  }
};
</script>

<style>
.selected {
  white-space: nowrap;
}
.adsmanager-topbar-actions-menu__list {
  max-height: calc(100vh - 40px)!important;
  overflow-y: auto!important;
}
</style>