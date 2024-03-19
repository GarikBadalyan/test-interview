<template>
  <div>
    <!-- ADS MANAGER -->
    <v-list-item
        value="fbAdsmanager"
        @click="goTo('/app/fb/adsmanager/accounts')"
    >
      <v-list-item-icon>
        <v-icon>
          fab fa-facebook-square
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $t('sidebar.adsManager') }}
      </v-list-item-title>
    </v-list-item>

    <!-- ЗАЛИТЬ РЕКЛАМУ -->
    <v-list-item
        v-if="profile.fbPlan !== 'Fb Base' && isAllowedTariffPlan"
        value="fbUpload"
        @click="goTo('/app/fb/upload/wizard')"
    >
      <v-list-item-icon>
        <v-icon
            :size="20"
            style="margin-left: -2px;"
        >
          fas fa-cloud-upload-alt
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $t('sidebar.createAds') }}
      </v-list-item-title>
    </v-list-item>

    <!-- АВТОПРАВИЛА -->
    <v-list-item
        v-if="isAllowedTariffPlanRules"
        value="fbRules"
        @click="goTo('/app/fb/rules/rules')"
    >
      <v-list-item-icon>
        <v-icon
            :size="18"
            style="margin-left: 0px;"
        >
          fas fa-project-diagram
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $t('sidebar.automationRules') }}
      </v-list-item-title>
    </v-list-item>

    <!-- КОММЕНТАРИИ -->
    <v-list-item
        v-if="isAllowedTariffPlan"
        v-show="profile.role_id !== 4"
        value="fbComments"
        @click="goTo('/app/fb/comments/feed')"
    >
      <v-list-item-icon>
        <v-icon
            :size="20"
            style="margin-left: 0px;"
        >
          fas fa-comments
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $t('sidebar.comments') }}
      </v-list-item-title>
    </v-list-item>

    <!-- БАНКОВСКИЕ КАРТЫ -->
    <v-list-item
        v-show="showOnLocalhost"
        value="fbBankCards"
        @click="goTo('/app/fb/bankcards')"
    >
      <v-list-item-icon>
        <v-icon
            :size="20"
            style="margin-left: 0px;"
        >
          far fa-credit-card
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $t('sidebar.bankCards') }}
      </v-list-item-title>
    </v-list-item>

    <!-- ПРОКСИ -->
    <v-list-item
        value="fbProxy"
        @click="goTo('/app/fb/proxy')"
    >
      <v-list-item-icon>
        <v-icon style="margin-left: 2px;">
          fas fa-plug
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $t('common.proxy') }}
      </v-list-item-title>
    </v-list-item>

    <!-- НАСТРОЙКИ -->
    <v-list-item
        v-show="profile.role !== 'farmer'"
        value="fbSettings"
        @click="goTo('/app/fb/settings')"
    >
      <v-list-item-icon>
        <v-icon style="">
          fas fa-cog
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $t('common.settings') }}
      </v-list-item-title>
    </v-list-item>

    <!-- ПРОФИЛЬ -->
    <v-list-item
        v-show="profile.isTeamOwner"
        value="fbProfile"
        @click="goTo('/app/fb/profile')"
    >
      <v-list-item-icon>
        <v-icon>
          far fa-user-circle
        </v-icon>
      </v-list-item-icon>
      <v-list-item-title>
        {{ $t('sidebar.profile') }}
      </v-list-item-title>
    </v-list-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SidebarFacebookItems',

  computed: {
    ...mapGetters({
      profile: 'main/profile'
    }),

    showOnLocalhost() {
      return location.hostname === 'localhost';
    },

    // isAllowedTariffPlan() {
    //   if (this.profile && this.profile.fbSubscription && (this.profile.fbSubscription.plan.slug !== 'fb_light' || this.profile.fbSubscription.plan.slug !== 'fb_start')) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },

    // isAllowedTariffPlan() {
    //   if (this.profile && this.profile.fbSubscription && (this.profile.fbSubscription.plan.slug !== 'fb_light' || this.profile.fbSubscription.plan.slug !== 'fb_start')) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },

    // isAllowedTariffPlanRules() {
    //   if (this.profile && this.profile.fbSubscription &&  this.profile.fbSubscription.plan.slug !== 'fb_light') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },

    isAllowedTariffPlan() {
      if (this.profile && this.profile.fbSubscription) {
        const planSlug = this.profile.fbSubscription.plan.slug;
        return planSlug !== 'fb_light' && planSlug !== 'fb_start';
      } else {
        return false;
      }
    }
  },

  async created() {
    await this.$store.dispatch('main/loadProfile');
  },

  methods: {
    goTo(path) {
      if (this.$route.path !== path) {
        this.$router.push({ path });

        if (path === '/app/fb/adsmanager/accounts')  {
          this.$store.dispatch('accounts/loadAccounts');
        }

        if (path === '/app/fb/proxy')  {
          this.$store.dispatch('proxy/loadProxy');
        }
      }
    }
  }
};
</script>