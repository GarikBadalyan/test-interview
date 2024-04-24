<template>
  <v-navigation-drawer
      :value="$vuetify.breakpoint.mdAndDown ? sidebar : true"
      :expand-on-hover="expandOnHover"
      :mini-variant.sync="mini"
      disable-resize-watcher
      fixed
      width="275"
      :hide-overlay="$vuetify.breakpoint.lgAndUp"
      class="dolphin-main-sidebar"
      @input="$store.dispatch('main/setSidebar', $event)"
      ref="navigatorDriver"
  >
    <v-list nav>
      <!-- ПЕРЕКЛЮЧЕНИЕ РЕКЛАМНЫХ СИСТЕМ -->
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary">
            {{ currrentPlatform.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          <v-btn-toggle
              :value="currrentPlatformValue"
              mandatory
              dense
              max
              color="primary"
          >
            <v-btn
                v-for="(platform, index) in platforms"
                :key="`sidebar-platform-${platform}-${index}`"
                small
                :value="platform.value"
                :disabled="['google'].includes(platform.value)"
                @click="goTo(platform.path)"
            >
              <v-icon
                  :size="platform.value === 'facebook' ? 18 : 16"
                  :color="currrentPlatformValue === platform.value ? 'primary' : '#757575'"
              >
                {{ platform.icon }}
              </v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-list-item-title>
      </v-list-item>

      <v-list-item-group
          :value="listItem"
          color="primary"
          mandatory
      >
        <component :is="currrentPlatform.component" />

        <v-divider class="my-3" />

        <!-- ANTY -->
        <v-btn
            text
            block
            class="px-2"
            style="text-indent: inherit; text-transform: inherit; letter-spacing: inherit; text-align: start"
            @click="openLink('https://anty.dolphin.ru.com/?utm_source=ecosystem&utm_medium=cpc&utm_campaign=dolphin_app&utm_content=sidebar')"
        >
          <v-list-item-icon>
            <img
                src="~@/assets/logoAnty.svg"
                class="dolphin-anty-icon"
            >
          </v-list-item-icon>
          <v-list-item-title
              class="dolphin-anty-title"
          >
            Dolphin{anty}
          </v-list-item-title>
        </v-btn>

        <v-btn
            text
            class="px-2 sidebar__text_inherit"
            @click="openLink(telegramChatLink)"
        >
          <img
              :src="telegramIcon"
              alt="telegram logo"
              width="24px"
              height="auto"
          >
          <span class="sidebar__list_item">
            {{ $t('sidebar.telegramChat') }}
          </span>
        </v-btn>

        <v-btn
            v-if="isPro"
            text
            class="px-2 sidebar__text_inherit"
            @click="openLink(telegramLinkPrivate)"
        >
          <v-icon
              width="24"
              size="22"
              class="telegram_private_icon"
          >
            🐬
          </v-icon>
          <span class="sidebar__list_item">
            {{ $t('sidebar.telegramChatPrivate') }}
          </span>
        </v-btn>

        <v-divider class="my-3" />

        <!-- ЛИЧНЫЙ КАБИНЕТ -->
        <v-list-item
            v-if="currrentPlatform.value === 'tiktok'"
            value="personalArea"
            @click="goTo(redirectToPersonalArea)"
        >
          <v-list-item-icon>
            <v-icon
                :size="22"
                style="margin-left: 3px;"
            >
              fas fa-user
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ $t('common.personalArea') }}
          </v-list-item-title>
        </v-list-item>

        <!-- ВЫЙТИ -->
        <v-list-item @click="logOut">
          <v-list-item-icon>
            <v-icon
                :size="22"
                style="margin-left: 3px;"
            >
              fas fa-sign-out-alt
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ $t('sidebar.logOut') }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <!-- ЧАТ -->
    <template #append>
      <v-list-item
          :class="{chat_active: livechatVisible}"
          :input-value="livechatVisible"
          @click="toggleLiveChat"
      >
        <v-list-item-icon>
          <v-icon
              :color="supportIconActive ? 'primary' : 'inherit'"
              :size="22"
          >
            fas fa-headset
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          <span :style="{color: supportIconActive ? '#2196f3' : ''}">{{ $t('sidebar.support') }}</span>
        </v-list-item-title>
        <div
            v-if="newMessage"
            class="support-icon-informer"
        />
      </v-list-item>
      <!-- ОБРАТНАЯ СВЯЗЬ -->
      <v-list-item
          class="mb-2"
          color="green"
          :input-value="true"
          @click="$store.dispatch('main/openDialog', 'feedback')"
      >
        <v-list-item-icon
            style="margin-top: auto !important; margin-bottom: auto !important; justify-content: center;"
        >
          <v-icon
              color="green"
              :size="18"
          >
            fas fa-lightbulb
          </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('sidebar.feedback') }}
        </v-list-item-title>
      </v-list-item>

      <!-- ЯЗЫК -->
      <language-switcher :mini="mini" />

      <!-- ДАРК МОД -->
      <dark-mode :mini="mini" />
    </template>
  </v-navigation-drawer>
</template>

<script>
import telegramIcon       from '@/assets/telegram.svg';
import {
  PRIVATE_CHAT_LINK,
  chatLink
}                         from '@/constants/telegramLinks.js'
import moment             from 'moment';
import { mapGetters }     from 'vuex';

import DarkMode           from './sidebar/SidebarDarkMode';
import FacebookItems      from './sidebar/SidebarFacebookItems';
import GoogleItems        from './sidebar/SidebarGoogleItems';
import LanguageSwitcher   from './sidebar/SidebarLanguageSwitcher';
import TiktokItems        from './sidebar/SidebarTiktokItems';

export default {
  name: 'Sidebar',

  components: {
    DarkMode,
    LanguageSwitcher,
    FacebookItems,
    TiktokItems,
    GoogleItems
  },

  data() {
    return {
      browserIsFirefox: window.navigator.userAgent.toLowerCase().includes('firefox'),
      mouseOver: false,
      livechatVisible: false,
      mini: this.$vuetify.breakpoint.mdAndDown ? false : true,
      newMessage: false,
      platforms: [
        {
          value: 'facebook',
          icon: 'fab fa-facebook',
          component: 'FacebookItems',
          path: '/app/fb/adsmanager/accounts'
        },
        {
          value: 'tiktok',
          icon: 'fab fa-tiktok',
          component: 'TiktokItems',
          path: '/app/tt/adsmanager/accounts'
        },
        {
          value: 'google',
          icon: 'fab fa-google',
          component: 'GoogleItems',
          path: '/app/google'
        }
      ],
      supportChatDialog: false,
      supportIconActive: false,
      chatLink,
      telegramIcon: telegramIcon,
    };
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      sidebar: 'main/sidebar',
      unreadNewsCount: 'news/unreadNewsCount',
      chatVariables: 'support/chatVariables',
      mode: 'main/mode',
      language: 'main/language'
    }),

    isPro() {
      return !!(this.profile && this.profile.fbPlan === 'Fb Pro');
    },

    telegramChatLink() {
      return chatLink.find(item => item.lang === this.language).link;
    },

    telegramLinkPrivate() {
      return PRIVATE_CHAT_LINK;
    },

    expandOnHover() {
      return this.$vuetify.breakpoint.lgAndUp && (!this.mouseOver && this.browserIsFirefox || !this.browserIsFirefox);
    },

    listItem() {
      const { path } = this.$route;

      if (path.startsWith('/app/fb')) {
        if (path.startsWith('/app/fb/adsmanager/')) {
          return 'fbAdsmanager';
        } else if (path.startsWith('/app/fb/upload/')) {
          return 'fbUpload';
        } else if (path.startsWith('/app/fb/rules/')) {
          return 'fbRules';
        } else if (path.startsWith('/app/fb/comments/')) {
          return 'fbComments';
        } else if (path === '/app/fb/bankcards') {
          return 'fbBankCards';
        } else if (path === '/app/fb/proxy') {
          return 'fbProxy';
        } else if (path === '/app/fb/settings') {
          return 'fbSettings';
        } else if (path.startsWith('/app/fb/profile')) {
          return 'fbProfile';
        }
      } else if (path.startsWith('/app/tt')) {
        if (path.startsWith('/app/tt/adsmanager/')) {
          return 'ttAdsmanager';
        } else if (path.startsWith('/app/tt/create-ads/')) {
          return 'ttCreateAds';
        } else if (path === '/app/tt/user-apps') {
          return 'ttUserApps';
        } else if (path === '/app/tt/proxy') {
          return 'ttProxy';
        }
      }

      if (path === '/app/tt/personalArea') {
        return 'personalArea';
      }

      return undefined;
    },

    redirectToPersonalArea() {
      if (this.currrentPlatformValue === 'facebook'){
        return '/app/fb/personalArea';
      }
      else{
        return '/app/tt/personalArea';
      }
    },

    showOnLocalhost() {
      return location.hostname === 'localhost';
    },

    currrentPlatform() {
      return this.platforms.find(i => i.value === this.currrentPlatformValue);

    },

    currrentPlatformValue() {
      if (this.$route.path.startsWith('/app/tt')) {
        return 'tiktok';
      }

      return 'facebook';
    },

    getPlatform() {
      if (this.$route.path.startsWith('/app/tt')) {
        return 'Dolphin(TT)';
      } else {
        return 'Dolphin(FB)';
      }
    },

    getPlan() {
      if (this.$route.path.startsWith('/app/tt')) {
        return this.profile.ttPlan;
      } else {
        return this.profile.fbPlan;
      }
    }
  },

  watch: {
    'profile.id': {
      handler (val) {
        if (val) {
          this.updateSupportChatVariables();
        }
      }
    },

    $route(to, from) {
      if (from.path !== to.path) {
        this.updateSupportChatVariables();
      }
    },

    'profile.language': {
      handler (val) {
        if (val) {

          console.log('language');
        }
      },
      deep: true
    },
  },

  async created () {
    await this.$store.dispatch('support/loadSupport');

    window.LiveChatWidget.once('ready', () => {
      window.LiveChatWidget.call('hide');
    });

    window.LiveChatWidget.call('set_customer_email', this.profile.username);
    this.setSupportChatVariables();
  },

  mounted() {
    if (this.browserIsFirefox) {
      document.addEventListener('mouseover', this.handleMouseOnSelect);
    }
  },

  destroyed () {
    if (this.browserIsFirefox) {
      document.removeEventListener('mouseover', this.handleMouseOnSelect);
    }
  },

  methods: {
    handleMouseOnSelect(event) {
      const navigatorDriverElement = this.$refs.navigatorDriver.$el;

      if (!navigatorDriverElement || !navigatorDriverElement.contains(event.target)) {
        this.mouseOver = false;
        return;
      }

      this.mouseOver = true;
    },

    openLink(link) {
      window.open(link, '_blank');
    },

    async logOut() {
      this.api.post('/auth/logout').then(() => {
        this.$store.dispatch('main/removeProfileId');
        localStorage.removeItem('apiToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');

        if(location.hostname.search('localhost') > -1) {
          window.location.href = '/app/auth/login';
        } else {
          window.location.href = '/';
        }
      });
    },

    goTo(path) {
      if (path !== this.$route.path) {
        this.$router.push({path});

        if (path === '/app/fb/adsmanager/accounts') {
          this.$store.dispatch('accounts/loadAccounts');
        }

        if (path === '/app/tt/adsmanager/accounts') {
          this.$store.dispatch('tiktokAdsmanagerAccounts/loadMainTableData', { endpoint: 'tiktok/accounts' });
        }
      }
    },

    toggleLiveChat () {
      if (this.livechatVisible) {
        this.hideLiveChat();
        this.livechatVisible = false;
      } else {
        this.showLiveChat();
        this.livechatVisible = true;
        this.newMessage = false;
      }
    },

    hideLiveChat () {
      window.LiveChatWidget.call('hide');
    },

    showLiveChat () {
      window.LiveChatWidget.call('maximize');
    },
    updateSupportChatVariables() {
      console.log('updateSupportChatVariables');
      console.log('navigator.language', navigator.language);
      window.LiveChatWidget.call('update_session_variables', {
        'owner': this.profile.owner,
        'email': this.profile.username,
        'revenue': this.profile.revenue,
        'plan': this.getPlan,
        'users count': this.profile.users_count,
        'days count': this.profile.days_count,
        'telegramUsername': this.profile.telegram_username ? this.profile.telegram_username : '',
        'browserLanguage': navigator.language,
      });
    },

    setSupportChatVariables() {
      console.log('setSupportChatVariables');
      window.LiveChatWidget.call('set_session_variables', {
        'owner': this.profile.owner,
        'email': this.profile.username,
        'revenue': this.profile.revenue,
        'plan': this.getPlan,
        'users count': this.profile.users_count,
        'days count': this.profile.days_count,
        'telegramUsername': this.profile.telegram_username ? this.profile.telegram_username : '',
        'browserLanguage': navigator.language,
      });
    }
  }
};
</script>


