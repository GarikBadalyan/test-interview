<template>
  <div class="d-flex align-center created-block">
    <div
        style="word-break: break-all;"
        class="d-flex align-center"
    >
      <div class="created-content">
        <div class="text-capitalize created-date">
          <!-- Formatted LAUNCHED -->
          {{ formattedLastStartTime }}
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
      browserProfilesLastStartTime: 'browserProfiles/browserProfilesLastStartTime'
    }),

    matchingItem () {
      console.log('zzzzzzzzzzzzzzz111111111111111')
      return this.browserProfilesLastStartTime.find(
          (item) => item.browserProfileId === this.browserProfile.id
      )
    },

    formattedLastStartTime () {
      console.log('KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK')
      if (this.matchingItem) {
        const dateWithTimezone = moment(this.matchingItem.browserProfileLastStartTime)
        return moment
            .parseZone(dateWithTimezone)
            .local()
            .locale(this.profile.language)
            .format('D MMM HH:mm')
      } else {
        if (!this.browserProfile.lastStartTime) return ''
        const dateWithTimezone = moment(this.browserProfile.lastStartTime)
        console.log('CCCCCCCCCCCCCCCCCCC11')
        return moment
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
.created-content {
  margin-left: 4px;
}
.created-date {
  font-size: 14px;
}
</style>
