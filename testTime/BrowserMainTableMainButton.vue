<template>
  <div
      style="
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      min-width: 200px;
    "
  >
    <!-- КНОПКА ПОДНЯТЬ ОКНО -->
    <v-tooltip bottom>
      <template #activator="{ on }">
        <div v-on="on">
          <v-icon
              v-if="showUpButton"
              id="anty-profile-bring-to-front-icon"
              small
              class="mr-1"
              @click="bringBrowserProfileToFront()"
          >
            mdi-arrow-up-drop-circle-outline
          </v-icon>
        </div>
      </template>
      <span>{{ $t('browserProfiles.bringToTop') }}</span>
    </v-tooltip>

    <!-- ИКОНКИ СИНХРОНИЗАТОРА -->
    <v-tooltip
        v-if="isInSynchronizer === 'master'"
        top
    >
      <template #activator="{ on, attrs }">
        <v-icon
            size="12"
            class="mr-2"
            style="background-color: #2196f3; border-radius: 100%; padding: 2px"
            :style="$vuetify.theme.dark ? 'color: #1E1E1E' : 'color: #FFFFFF'"
            v-bind="attrs"
            v-on="on"
        >
          mdi-crown
        </v-icon>
      </template>

      <span>{{ $t('browserProfiles.masterProfile') }}</span>
    </v-tooltip>

    <v-tooltip
        v-if="isInSynchronizer === 'managed'"
        top
    >
      <template #activator="{ on, attrs }">
        <v-icon
            size="16"
            class="mr-2"
            v-bind="attrs"
            v-on="on"
        >
          mdi-content-duplicate
        </v-icon>
      </template>
      <span>{{ $t('browserProfiles.managedProfile') }}</span>
    </v-tooltip>

    <!-- ИКОНКИ СОСТОЯНИЙ -->
    <div
        v-if="!browserProfiles.pendingRequest.includes(parseInt(browserProfile.id, 10))"
    >
      <!-- ИКОНКА ОШИБКИ СИНХРОНИЗАЦИИ -->
      <v-tooltip
          v-if="syncError && !disableIfFreePlan"
          top
      >
        <template #activator="{ on }">
          <span
              style="cursor: pointer"
              v-on="on"
              @click="openSyncError"
          >
            <ion-icon
                name="alert-circle-outline"
                style="
              font-size: 16px;
              margin-right: 8px;
              color: #f44336;
              margin-top: 8px;
            "
            />
          </span>
        </template>
        <span>{{ $t('browserProfiles.learnSyncError') }}</span>
      </v-tooltip>

      <!-- ИКОНКА ОШИБКИ СИНХРОНИЗАЦИИ -->
      <v-tooltip
          v-if="mainButtonError && !disableIfFreePlan"
          top
      >
        <template #activator="{ on }">
          <span
              style="cursor: pointer"
              v-on="on"
          >
            <ion-icon
                name="alert-circle-outline"
                style="
              font-size: 16px;
              margin-right: 8px;
              color: #f44336;
              margin-top: 8px;
            "
            />
          </span>
        </template>
        <span>{{ mainButtonError.error }}</span>
      </v-tooltip>

      <!-- ИКОНКА УСПЕХА -->
      <span
          v-if="
          browserProfiles.syncSuccess.includes(parseInt(browserProfile.id, 10))
        "
      >
        <ion-icon
            name="checkmark-circle-outline"
            style="
          font-size: 16px;
          margin-right: 8px;
          color: #4caf50;
          margin-top: 8px;
        "
        />
      </span>
    </div>

    <!-- СБРОСИТЬ -->
    <expired-plan-disabled-wrapper>
      <v-btn
          v-if="browserProfiles.pendingRequest.includes(parseInt(browserProfile.id, 10))"
          icon
          x-small
          color="grey"
          class="mr-1"
          :disabled="disableUi"
          @click="cancelButtonAction"
      >
        <ion-icon
            name="close-outline"
            style="font-size: 18px"
        />
      </v-btn>
    </expired-plan-disabled-wrapper>

    <v-tooltip
        v-if="teamProfileRunning"
        bottom
    >
      <template #activator="{ on }">
        <div v-on="on">
          <ion-icon
              name="lock-closed-outline"
              class="mr-1 mt-1"
          />
        </div>
      </template>
      <span>{{ runnedByTooltip }}</span>
    </v-tooltip>

    <!-- ОСТАНОВИТЬ -->
    <expired-plan-disabled-wrapper>
      <v-btn
          v-if="
          !cookieRobotIsWorking &&
            browserProfiles.running.includes(parseInt(browserProfile.id, 10))
        "
          small
          :width="100"
          outlined
          color="red"
          :disabled="disableStopButton"
          :loading="
          browserProfiles.loading.includes(parseInt(browserProfile.id, 10))
        "
          @click="browserProfileActionsStop(browserProfile)"
      >
        <ion-icon
            name="pause-outline"
            class="mr-1"
        />
        {{ $t('common.stop') }}
      </v-btn>
    </expired-plan-disabled-wrapper>

    <!-- ОСТАНОВИТЬ COOKIES ROBOT-->
    <div
        v-if="cookieRobotIsWorking"
        @click="stopCookieRobot"
    >
      <v-btn
          v-if="cookieRobotIsWorking"
          small
          :width="100"
          outlined
          color="light-blue lighten-1 light-blue--text text--lighten"
          :loading="cookieRobotIsWorking"
          @click="stopCookieRobot"
      >
        <template #loader>
          <v-progress-linear
              v-model="cookieRobotIsWorkingProgressStatusPercentage"
              background-color="transparent"
              color="light-blue darken-4"
              class="light-blue--text text--lighten-3"
              height="25"
              rounded
          >
            <v-progress-circular
                :width="1"
                :size="12"
                indeterminate
                color="light-blue lighten-4"
                class="mr-1"
            />
            <span class="light-blue--text text--lighten-3">
              {{ cookieRobotIsWorkingProgressStatus }}
            </span>
          </v-progress-linear>
        </template>
      </v-btn>
    </div>

    <!-- ЗАПУСТИТЬ -->
    <expired-plan-disabled-wrapper>
      <v-btn
          v-show="
          !cookieRobotIsWorking &&
            !browserProfiles.running.includes(parseInt(browserProfile.id, 10))
        "
          small
          :width="100"
          outlined
          color="green"
          :loading="
          browserProfiles.loading.includes(parseInt(browserProfile.id, 10))
        "
          :disabled="disableStartButton"
          @click="chromeExists ? startBrowserProfile() : openDialogChromeNotFound()"
      >
        <!--  -->
        <ion-icon
            name="play-outline"
            class="mr-1"
        />
        {{ $t('common.launch') }}
      </v-btn>
    </expired-plan-disabled-wrapper>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import amplitude from '@/mixins/amplitude.js'
import browserProfileActions from '@/mixins/browserProfileActions.js'
import ExpiredPlanDisabledWrapper from '@/components/ExpiredPlanDisabledWrapper.vue'

export default {
  name: 'BrowserMainTableMainButton',
  mixins: [amplitude, browserProfileActions],
  props: {
    browserProfile: {
      type: Object,
      default: () => ({
        id: 0
      })
    }
  },
  data () {
    return {
      showRunnedByTooltip: false
    }
  },
  computed: {
    ...mapGetters({
      browserProfiles: 'browserProfiles/browserProfiles',
      chromeExists: 'browserProfiles/chromeExists',
      synchronizer: 'browserProfiles/synchronizer',
      browserDownloading: 'main/browserDownloading',
      disableUi: 'main/disableUi',
      users: 'users/users',
      health: 'health/health',
      subscription: 'main/subscription'
    }),
    syncError () {
      for (const item of this.browserProfiles.syncErrors) {
        if (parseInt(item.id, 10) === parseInt(this.browserProfile.id, 10)) {
          return true
        }
      }
      return false
    },
    mainButtonError () {
      for (const item of this.browserProfiles.mainButtonErrors) {
        if (parseInt(item.id, 10) === parseInt(this.browserProfile.id, 10)) {
          return item
        }
      }
      return null
    },
    disableStartButton () {
      const id = parseInt(this.browserProfile.id, 10)

      return (
          this.browserProfiles.sync.includes(id) ||
          (this.browserProfile.access && !this.browserProfile.access.usage) ||
          this.browserDownloading.show ||
          this.disableUi ||
          this.health.antyBrowser?.downloaded === false
      )
    },
    disableStopButton () {
      const id = parseInt(this.browserProfile.id, 10)
      return (
          this.browserProfiles.sync.includes(id) ||
          (this.browserProfile.access && !this.browserProfile.access.usage) ||
          this.disableUi
      )
    },
    runnedByTooltip () {
      const teamRunningProfile = this.browserProfiles.teamProfileRunning.find(
          (i) => i.id === parseInt(this.browserProfile.id, 10)
      )
      let userRunningProfile = null
      if (teamRunningProfile) {
        userRunningProfile = this.users.all.find(
            (i) => parseInt(i.id, 10) === teamRunningProfile.userId
        )
      }
      if (userRunningProfile) {
        if (userRunningProfile.displayName) {
          return `${this.$t('browserProfiles.profileIsLaunchedBy')}: ${
              userRunningProfile.displayName
          } (${userRunningProfile.username})`
        } else {
          return `${this.$t('browserProfiles.profileIsLaunchedBy')}: ${
              userRunningProfile.username
          }`
        }
      } else {
        return ''
      }
    },
    showUpButton () {
      if (this.cookieRobotIsWorkingInHeadless) {
        return false
      }
      return (
          this.isNotLinux &&
          this.browserProfiles.running.includes(
              parseInt(this.browserProfile.id, 10)
          )
      )
    },
    cookieRobotIsWorking () {
      const id = parseInt(this.browserProfile.id, 10)
      const cookieRobotIsWorking =
          this.browserProfiles.cookieRobotsWorking.find((i) => i.profileId === id)
      if (cookieRobotIsWorking === undefined) {
        return false
      }
      return true
    },
    cookieRobotIsWorkingInHeadless () {
      const id = parseInt(this.browserProfile.id, 10)
      const cookieRobotIsWorking =
          this.browserProfiles.cookieRobotsWorking.find(
              (i) => i.profileId === id && i.headless === true
          )
      if (cookieRobotIsWorking === undefined) {
        return false
      }
      return true
    },
    cookieRobotIsWorkingProgressStatus () {
      const id = parseInt(this.browserProfile.id, 10)
      const cookieRobotIsWorking =
          this.browserProfiles.cookieRobotsWorking.find((i) => i.profileId === id)
      if (cookieRobotIsWorking === undefined) {
        return '0/0'
      }
      // const estimatedTime = (cookieRobotIsWorking.count - cookieRobotIsWorking.percentage * cookieRobotIsWorking.count / 100) * 30
      // return estimatedTime + 's left'
      let current = '0'
      if (
          cookieRobotIsWorking.percentage !== undefined &&
          cookieRobotIsWorking.count !== undefined
      ) {
        current = Math.round(
            (cookieRobotIsWorking.percentage * cookieRobotIsWorking.count) / 100
        )
      }
      const from =
          cookieRobotIsWorking.count !== undefined
              ? cookieRobotIsWorking.count
              : '-'
      return current + '/' + from
    },
    cookieRobotIsWorkingProgressStatusPercentage () {
      const id = parseInt(this.browserProfile.id, 10)
      const cookieRobotIsWorking =
          this.browserProfiles.cookieRobotsWorking.find((i) => i.profileId === id)
      if (cookieRobotIsWorking === undefined) {
        return 0
      }
      return cookieRobotIsWorking.percentage
    },
    teamProfileRunning () {
      return (
          this.browserProfiles.teamProfileRunning.findIndex(
              (i) => i.id === parseInt(this.browserProfile.id, 10)
          ) > -1
      )
    },
    currentOs () {
      const os = require('os')
      return os.platform()
    },
    disableIfFreePlan () {
      return this.subscription.plan === 'free' &&
          !this.subscription.browserProfiles.additionalProfiles &&
          !this.subscription.users.additionalUsers
    },

    isInSynchronizer () {
      if (this.synchronizer) {
        for (const value of Object.values(this.synchronizer)) {
          if (value.master === parseInt(this.browserProfile.id, 10)) {
            return 'master'
          }

          if (value.managed.includes(parseInt(this.browserProfile.id, 10))) {
            return 'managed'
          }
        }
      }

      return ''
    }
  },
  methods: {
    cancelButtonAction () {
      const id = parseInt(this.browserProfile.id, 10)
      if (this.browserProfiles.cancelTokens[id]) {
        this.browserProfiles.cancelTokens[id].cancel()
      }
      this.$store.dispatch('browserProfiles/setBrowserProfileTimer', {
        id: id,
        action: 'remove'
      })
      this.$store.dispatch('browserProfiles/removeLoading', id)
    },
    openDialogChromeNotFound () {
      this.$store.dispatch('browserProfiles/openDialog', 'chromeNotFound')
    },
    async openSyncError () {
      await this.$store.dispatch(
          'browserProfiles/setBrowserProfileSyncError',
          parseInt(this.browserProfile.id, 10)
      )
      await this.$store.dispatch('browserProfiles/openDialog', 'syncErrors')
    },
    async startBrowserProfile () {
      // this.$store.dispatch('browserProfiles/setStartTime', { browserProfileId: this.browserProfile.id, browserProfileLastStartTime: this.browserProfile.created_at })
      if (
          this.teamProfileRunning &&
          !localStorage.getItem('browserProfilesDoNotShowParallelStartWarning')
      ) {
        await this.$store.dispatch(
            'browserProfiles/setBrowserProfileForEdit',
            this.$_.cloneDeep(this.browserProfile)
        )
        this.$store.dispatch(
            'browserProfiles/openDialog',
            'parallelStartWarning'
        )
      } else {
        this.browserProfileActionsStart(this.browserProfile, this.subscription.plan, this.browserProfile.transfer)
        this.amplitudeSendProfileStart(this.browserProfile, this.subscription)
      }
    },
    async stopCookieRobot () {
      const response = await this.localApi.get(
          `/import/cookies/${this.browserProfile.id}/robot-stop`
      )
      if (response.status === 200) {
        this.$store.dispatch('browserProfiles/removeCookieRobotRunning', {
          profileId: this.browserProfile.id
        })
      }
    },
    async bringBrowserProfileToFront () {
      this.browserProfileActionBringToFront(this.browserProfile)
      // this.amplitudeSendProfileEdit(this.browserProfile)
    },
    isNotLinux () {
      return this.currentOs !== 'linux'
    }
  },
  components: { ExpiredPlanDisabledWrapper }
}
</script>
