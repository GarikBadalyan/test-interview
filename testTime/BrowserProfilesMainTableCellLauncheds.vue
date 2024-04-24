<template>
  <div
      class="d-flex align-center created-block"
  >
    <div
        style="word-break: break-all;"
        class="d-flex align-center"
    >
      <div class="created-content">
        <div class="text-capitalize created-date">
          <!-- Formatted LAUNCHED -->
          {{ browserProfile.lastStartTime ? lastStartTime : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import browserProfileActions from '@/mixins/browserProfileActions'
import moment from 'moment/moment'
export default {
  name: 'BrowserProfilesMainTableCellLauncheds',
  mixins: [browserProfileActions],
  props: {
    browserProfile: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  data () {
    return {
      moment
    }
  },

  computed: {
    ...mapGetters({
      profile: 'main/profile',
      browserProfilesLastStartTime: 'browserProfiles/browserProfilesLastStartTime',
      browserProfiles: 'browserProfiles/browserProfiles'
    }),

    lastStartTime () {
      this.browserProfiles.all.map(browserProfile => {
        const matchingItem = this.browserProfilesLastStartTime.find(item => item.browserProfileId === browserProfile.id)
        console.log('matchingItem-1-1-1-1-1-1', matchingItem)
        if (matchingItem) {
          browserProfile.lastStartTime = matchingItem.browserProfileLastStartTime
        }
        return browserProfile
      })

      const dateWithTimezone = `${this.moment(this.browserProfile.lastStartTime).format('YYYY-MM-DDTHH:mm:ss')}+03:00`

      try {
        const minuteSinceUpdate = parseInt(this.moment(dateWithTimezone).unix()) + 59
        const nowUnix = parseInt(Date.now() / 1000)
        if (nowUnix > minuteSinceUpdate) {
          return this.moment
              .parseZone(dateWithTimezone)
              .local()
              .locale(this.profile.language)
              .format('DD MMM HH:mm')
        }
        const dateNow = parseInt(Date.now() / 1000, 10)
        const editedUnix = parseInt(this.moment.parseZone(dateWithTimezone).local().locale(this.profile.language).unix(), 10)
        const secondsAgo = Math.abs((dateNow - editedUnix) ? (dateNow - editedUnix) : 1)

        return `${secondsAgo} ${this.$tc('browserProfiles.secondsAgo', secondsAgo)}`
      } catch (_) {
        return this.moment
            .parseZone(dateWithTimezone)
            .local()
            .locale(this.profile.language)
            .format('DD MMM HH:mm')
      }
    }
  }
}
</script>

<style scoped>
.created-block {
  font-size: 16px;
}
.created-content{
  margin-left: 4px;
}

.created-date {
  font-size: 14px;
}
</style>
