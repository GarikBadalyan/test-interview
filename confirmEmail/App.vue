<template>
  <v-app>
    <alert />
    <main-top-bar v-if="isAuthenticated" />
    <v-progress-linear v-if="loading.profile" indeterminate />
    <dialog-unsubscribe v-if="dialogs.unsubscribe" />
    <unsubscribe-plan-dialog v-if="dialogs.unsubscribePlan" />
    <dialog-two-factor-auth-enable v-if="dialogs.enableTwoFactorAuthDialog" />
    <dialog-two-factor-auth-manage v-if="dialogs.manageTwoFactorAuthDialog" />
    <popup-two-factor v-if="dialogs.popTwoFactor" />

    <v-main>
      <!-- РЕНДЕРИТЬ ТАБЫ -->
      <tabs v-if="showTabs" />

      <!-- НЕ РЕНДЕРИТЬ ТАБЫ -->
      <router-view v-else />
    </v-main>

    <!-- ОПРОСНИК -->
    <quiz-wrapper :visibility="showQuizBlock" :handle-onboarding-close="handleOnboardingClose" />
  </v-app>
</template>

<script>
import Tabs from '@/views/Tabs.vue'
import MainTopBar from '@/components/MainTopBar.vue'
import DialogUnsubscribe from '@/components/dialogs/DialogUnsubscribe.vue'
import Alert from '@/components/Alert.vue'
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import moment from 'moment'
import Cookies from 'js-cookie'
import UnsubscribePlanDialog from './components/plans/UnsubscribePlanDialog'
import QuizWrapper from './components/QuizWrapper'
import setPaymentsMethodsMixin from '@/mixins/setPaymentsMethods'
import paymentMixin from '@/mixins/payment'
import DialogTwoFactorAuthEnable from './components/dialogs/twoFactor/DialogTwoFactorAuthEnable'
import DialogTwoFactorAuthManage from './components/dialogs/twoFactor/DialogTwoFactorAuthManage'
import PopupTwoFactor from './components/dialogs/twoFactor/PopupTwoFactor'
import { getRefLink } from '@/utils/auth/ref'

let balanceRequestsInPending = 0

export default {
  name: 'App',

  components: {
    DialogTwoFactorAuthManage,
    DialogTwoFactorAuthEnable,
    UnsubscribePlanDialog,
    Tabs,
    MainTopBar,
    Alert,
    DialogUnsubscribe,
    QuizWrapper,
    PopupTwoFactor
  },

  mixins: [setPaymentsMethodsMixin, paymentMixin],

  data() {
    return {
      moment,
      showQuizBlock: true
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      dialogs: 'main/dialogs',
      banners: 'main/banners',
      loading: 'main/loading',
      isAuthenticated: 'auth/isAuthenticated',
    }),
    ...mapFields('plans', ['selectedPlan']),
    ...mapFields('main', ['successfulPaymentAlert']),

    showTabs() {
      const tabs = [
        "Overview",
        "Affiliate",
        "Billing",
        "LoginHistory",
        "Api"
      ]
      return tabs.includes(this.$route.name)
    },
  },

  watch: {
    'profile': {
      deep: true,
      handler (newVal, oldVal) {
        if (newVal.subscription && oldVal.subscription && newVal.subscription.plan !== oldVal.subscription.plan) {
          this.successfulPaymentAlert = false
        }
        if (newVal.subscription && newVal.subscription.users) {
          this.selectedPlan.additionalUsers = newVal.subscription.users.limit - 1
        }
        if (newVal.team && newVal.team.promo && newVal.team.promo.trim() && parseInt(newVal.team.usedPromo, 10) === 0) {
          this.selectedPlan.promocode = newVal.team.promo
          this.selectedPlan.discount = newVal.team.promoDiscount
          this.selectedPlan.disablePromocode = true
        } else if (newVal.team && newVal.team.promo && newVal.team.promo.trim() && parseInt(newVal.team.usedPromo, 10) === 1) {
          this.selectedPlan.promocode = ''
          this.selectedPlan.discount = '0'
          this.selectedPlan.disablePromocode = false
        }

        if (
            newVal.team &&
            newVal.team.created_at &&
            this.moment(newVal.team.created_at).unix() <= 1631728799 &&
            !newVal.team.hadTransactions
        ) {
          if (this.selectedPlan.discount === '0' || parseInt(this.selectedPlan.discount, 10) < 20) {
            this.selectedPlan.discount = '20'
          }
        }
      }
    },

    'profile.id': {
      handler (val) { // Boot Intercom and send custom variables when user authorized
        if (val) {
          window.Intercom('update', {
            email: this.profile.username,
            name: this.profile.displayName,
            user_id: this.profile.id,
            user_hash: this.profile.hash,
          })

          this.setSupportChatVariables()

          // show nps quiz dialog
          // this.showNpsQuiz()
        }
      }
    }
  },

  mounted () {
    // try {
    //   if (localStorage.getItem('quizRequired') === "1") {
    //     this.showQuizBlock = 1
    //   } else {
    //     this.showQuizBlock = 0
    //   }
    // } catch (e) {
    //   console.log(`Error occurred on quiz show - ${e}`)
    // }
  },

  async created() {
    window.Intercom('boot', {
      app_id: process.env.VUE_APP_INTERCOM_APP_ID
    })

    await getRefLink()

    if (Cookies.get('dolphinAntyAccessToken')) {
      this.api.defaults.headers.Authorization = `Bearer ${window.atob(
          window.decodeURIComponent(Cookies.get('dolphinAntyAccessToken'))
      )}`
    }

    if (this.$route.query.token) {
      await this.signInByQueryToken()
    }

    this.$store.dispatch('main/loadUsdRates')

    if (this.$route.query.promo) {
      this.$store.dispatch(
          'main/setPromoFromQueryParam',
          this.$route.query.promo
      )
    }

    if (this.$route.query && +this.$route.query.popTwoFactor) {
      this.$store.dispatch('main/openDialog', 'popTwoFactor')
      this.$router.replace({
        query: {
          ...this.$route.query,
          popTwoFactor: undefined
        }
      })
    }

    if (this.$route.query && +this.$route.query.dialogTwoFactor) {
      this.$store.dispatch('main/openDialog', 'enableTwoFactorAuthDialog')
      this.$router.replace({
        query: {
          ...this.$route.query,
          dialogTwoFactor: undefined
        }
      })
    }
  },

  destroyed() {
    window.Intercom('shutdown')
  },

  methods: {
    signInByQueryToken() {
      const token = this.$route.query.token
      const refreshToken = this.$route.query.refreshToken

      Cookies.set('dolphinAntyAccessToken', window.decodeURIComponent(window.btoa(token)), {
        expires: 7
      })

      if (refreshToken) {
        Cookies.set('dolphinAntyRefreshToken', window.decodeURIComponent(window.btoa(refreshToken)), {
          expires: 7
        })
      }

      this.api.defaults.headers.Authorization = `Bearer ${token}`
      this.$router.replace({
        query: {
          ...this.$route.query,
          token: undefined,
          refreshToken: undefined
        }
      });
    },

    setSupportChatVariables () {
      if (this.profile.username) {
        window.Intercom('update', { email: this.profile.username })
      }

      if (this.profile.displayName) {
        window.Intercom('update', { name: this.profile.displayName })
      }

      let daysCount = ''
      if (this.profile.subscription.expiration) {
        const expires = new Date(this.profile.subscription.expiration)
        const now = new Date()
        daysCount = Math.round((expires - now) / (1000 * 60 * 60 * 24))
      }

      const profilesCount = `${this.profile.subscription?.browserProfiles?.count}/${this.profile.subscription?.browserProfiles?.limit}`
      const usersCount = `${this.profile.subscription?.users?.count}/${this.profile.subscription?.users?.limit}`

      window.Intercom('update', {
        channel: 'personal area Dolphin{anty}',
        'e-mail owner': this.profile.team?.ownerEmail,
        'e-mail user': this.profile.username,
        'user role': this.profile.team?.isOwner ? 'owner' : this.profile.role,
        'profiles count': profilesCount,
        'users count': usersCount,
        revenue: this.profile.revenue,
        'days count': daysCount,
        'user panel interface language': this.$i18n.locale,
      })
    },

    handleOnboardingClose() {
      this.showQuizBlock = false
    }
  }
};
</script>

<style>
@import './assets/styles/main.css';
</style>
