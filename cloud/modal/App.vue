<template>
  <v-app
      :class="{'application-mobile': $vuetify.breakpoint.mdAndDown, 'application-mobile--xs': $vuetify.breakpoint.xs, 'application-mobile--sm': $vuetify.breakpoint.sm}"
      hide-details
  >
    <topbar v-show="false" />
    <sidebar v-if="showAppInner && !isAdmin && !isLogs && !isRouteOverview" />
    <sidebar-dialog-feedback v-if="dialogs.feedback" />
    <dialog-functionality-not-available v-if="functionalityNotAvailable" />
    <api-error v-if="dialogs.apiError" />
    <proxy-have-wrong-port-format v-if="dialogs.proxyHaveWrongPortFormat" />
    <fb-api-log v-if="fbApiLogDialogs.logSidebar" />
    <alert />

    <v-content
        :style="{paddingLeft: isAdmin || isRouteOverview ? '0' : '56px', paddingTop: '0', maxHeight: '100%'}"
    >
      <router-view />
    </v-content>
    <info-bar v-if="(!($vuetify.breakpoint.smAndDown)) && showInfoBar" />
    <v-btn
        v-if="$vuetify.breakpoint.mdAndDown"
        class="mobile-sidebar-open-button"
        elevation="3"
        fab
        small
        fixed
        right
        bottom
        :color="sidebarStatus ? 'red' : 'primary'"
        @click="$store.dispatch('main/setSidebar', !sidebarStatus)"
    >
      <v-icon color="white">
        {{ sidebarStatus ? 'close' : 'fas fa-bars' }}
      </v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import InfoBar                  from '@/components/InfoBar';
import ProxyHaveWrongPortFormat from '@/components/ProxyHaveWrongPortFormat.vue';
import { mapGetters }           from 'vuex';

import Alert                    from './components/Alert';
import ApiError                 from './components/ApiError';
import Sidebar                  from './components/Sidebar';
import FbApiLog                 from './components/fb-api-log/fbApiLog';
import SidebarDialogFeedback    from './components/sidebar/SidebarDialogFeedback';
import Topbar                   from './components/topbar/Topbar';
import DialogFunctionalityNotAvailable from '@/components/common/dialogs/DialogFunctionalityNotAvailable.vue';

export default {
  name: 'App',

  components: {
    DialogFunctionalityNotAvailable,
    ProxyHaveWrongPortFormat,
    Alert,
    InfoBar,
    FbApiLog,
    Topbar,
    Sidebar,
    SidebarDialogFeedback,
    ApiError
  },

  data() {
    return {
      isAdmin: '',
      isLogs: false,
      isRouteOverview: false,
    };
  },

  computed: {
    ...mapGetters({
      dialogs: 'main/dialogs',
      fbApiLogDialogs: 'fbApiLog/dialogs',
      profile: 'main/profile',
      sidebarStatus: 'main/sidebar',
      filters: 'adsmanager/filters',
      functionalityNotAvailable: 'main/functionalityNotAvailable'
    }),

    showAppInner() {
      return ['AuthLogin', 'AuthRegistration'].indexOf(this.$route.name) === -1;
    },

    showInfoBar() {
      return ['Admin'].indexOf(this.$route.name) === -1;
    },
  },

  watch: {
    '$route.path': {
      handler(val) {
        if (val.startsWith('/app/fb-logs')) {
          this.isLogs = true;
        } else {
          this.isLogs = false;
        }
        this.isAdmin = val === '/app/admin';
        this.isRouteOverview = val === '/app/fb/overview';
      },
      deep: true
    }
  },

  created() {
    this.setInnerHeight();
    this.setInterceptors();
  },

  methods: {
    setInnerHeight() {
      this.$store.dispatch('main/setInnerHeight', window.innerHeight);
      window.addEventListener('resize', (data) => {
        this.$store.dispatch('main/setInnerHeight', data.target.innerHeight);
      });
    },

    setInterceptors () {
      this.api.interceptors.response.use(
          (response) => response,
          (error) => {
            const { response } = error;

            if (response &&
                response.config &&
                response.config.url === '/fb_export_cost/platform' &&
                response.data &&
                response.data.status === 713
            ) {
              return Promise.reject(error);
            }

            if (response &&
                response.data &&
                response.data.status === 716
            ) {
              return Promise.reject(error);
            }

            if (['AuthLogin', 'AuthRegistration'].indexOf(this.$route.name) === -1 && error && error.response && error.response.data) {
              this.$store.dispatch('main/apiError', {
                status: error.response.data.status,
                message: error.response.data.errors ? error.response.data.errors.message : '',
                error,
              });
            }

            return Promise.reject(error);
          }
      );
    },
  }
};
</script>
