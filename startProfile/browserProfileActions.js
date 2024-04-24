import axios from 'axios'
import amplitude from '@/mixins/amplitude'
import { mapGetters } from 'vuex'

export default {
  mixins: [
    amplitude
  ],

  computed: {
    ...mapGetters({
      healthForBrowserProfileActions: 'health/health'
    }),

    userPlanIsFree () {
      return this.subscription.plan === 'free' &&
        !this.subscription.browserProfiles.additionalProfiles &&
        !this.subscription.users.additionalUsers
    }
  },

  methods: {
    async browserProfileActionsStart (profile, plan, transfer, addLoading = true, synchronizer = null) {
      const id = parseInt(profile.id, 10)

      if (this.showOsCompatibilityDialog()) {
        if (this.browserProfile) {
          await this.$store.dispatch('browserProfiles/setBrowserProfile', this.browserProfile)
        }

        await this.$store.dispatch('main/openDialog', 'osCompatibility')

        return
      }

      try {
        await this.$store.dispatch('browserProfiles/addLoading', id)
        this.$store.dispatch('browserProfiles/removeMainButtonError', id)

        if (addLoading) {
          await this.$store.dispatch('browserProfiles/addLoading', id)
        }

        const cancelTokenSource = axios.CancelToken.source()
        this.$store.dispatch('browserProfiles/setCancelToken', {
          id: id,
          token: cancelTokenSource
        })

        await this.$store.dispatch('browserProfiles/addPendingRequest', id)
        const canUpdateResponse = await this.api.get(`/browser_profiles/${id}/canUpdate`)
        await this.$store.dispatch('browserProfiles/removePendingRequest', id)

        if (canUpdateResponse.data.result) {
          const responseData = await this.api.post(`/browser_profiles/${id}/events`,
            { type: 'start' },
            { cancelToken: cancelTokenSource.token }
          )

          if ((responseData.status === 200) && responseData.data) {
            this.$store.dispatch('browserProfiles/setStartTime', { browserProfileId: responseData.data.data.browserProfileId, browserProfileLastStartTime: responseData.data.data.created_at })
          }
        }

        let response
        if (this.userPlanIsFree) {
          response = await this.localApi.get(`/browser_profiles/${id}/start?screenWidth=${screen.width}&screenHeight=${screen.height}&dpr=${window.devicePixelRatio}&mainWebsite=${profile.mainWebsite}&login=${profile.login}&password=${profile.password}&plan=${plan}&transfer=${transfer}`, {
            cancelToken: cancelTokenSource.token
          })
        } else {
          let url = `/browser_profiles/${id}/start?screenWidth=${screen.width}&screenHeight=${screen.height}&dpr=${window.devicePixelRatio}&mainWebsite=${profile.mainWebsite}&login=${profile.login}&password=${profile.password}`

          if (synchronizer) {
            url += `&name_session=${synchronizer.session}&is_owned=${synchronizer.isOwned}`
          }

          response = await this.localApi.get(url, {
            cancelToken: cancelTokenSource.token
          })
        }

        // if (response.data.proxyData !== null && response.data.proxyError !== null) {
        //   // this.$amplitude
        //   //   .getInstance()
        //   //   .logEvent('proxy_check_fails', { proxy_data: response.data.proxyData, proxy_error: response.data.proxyError })
        // }

        if (response.data && response.data.success === false) {
          switch (response.data.message) {
            case 'initConnectionError':
              await this.$store.dispatch('browserProfiles/addMainButtonError', {
                id: id,
                error: response.data.error
              })
              break
            case 'errorRemoteApi':
              await this.$store.dispatch('browserProfiles/addMainButtonError', {
                id: id,
                error: this.$t('browserProfiles.errors.errorRemoteApi')
              })
              break
            case 'errorMirrorDownload':
              await this.$store.dispatch('browserProfiles/addMainButtonError', {
                id: id,
                error: this.$t('browserProfiles.errors.downloadDatadirError')
              })
              break
            case 'DownloadAndUnpackError':
              await this.$store.dispatch('browserProfiles/addMainButtonError', {
                id: id,
                error: this.$t('browserProfiles.errors.errorDownloadAndUnpack')
              })
              break
          }

          setTimeout(() => {
            this.$store.dispatch('browserProfiles/removeMainButtonError', id)
          }, 60000)
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.dispatch('browserProfiles/setCancelToken', { id: id, remove: true })
        await this.$store.dispatch('browserProfiles/removeLoading', id)
        await this.$store.dispatch('browserProfiles/removePendingRequest', id)
      }
    },

    async browserProfileActionsStop (profileOrId, afterReAuth = false) {
      const id = parseInt(profileOrId.id ?? profileOrId, 10)
      let response
      try {
        await this.$store.dispatch('browserProfiles/addLoading', id)
        await this.$store.dispatch('browserProfiles/removeSyncErrors', id)

        const cancelTokenSource = axios.CancelToken.source()
        this.$store.dispatch('browserProfiles/setCancelToken', {
          id: id,
          token: cancelTokenSource
        })

        await this.$store.dispatch('browserProfiles/addPendingRequest', id)

        const params = {}
        if (this.userPlanIsFree) {
          params.plan = this.subscription.plan
        }
        if (afterReAuth) {
          params.afterReAuth = true
        }
        response = await this.localApi.get(`/browser_profiles/${id}/stop`, {
          cancelToken: cancelTokenSource.token,
          params: params
        })

        if (response.data && response.data.success === false) {
          await this.$store.dispatch('browserProfiles/addMainButtonError', {
            id: id,
            error: response.data.message
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        await this.$store.dispatch('browserProfiles/setCancelToken', { id: id, remove: true })
        await this.$store.dispatch('browserProfiles/removePendingRequest', id)
        await this.$store.dispatch('browserProfiles/removeLoading', id)
      }
    },

    async browserProfileActionBringToFront (profile) {
      const id = parseInt(profile.id, 10)

      try {
        const cancelTokenSource = axios.CancelToken.source()
        this.$store.dispatch('browserProfiles/setCancelToken', {
          id: id,
          token: cancelTokenSource
        })

        const response = await this.localApi.get(`/browser_profiles/${id}/bring_to_front?screenWidth=${screen.width}&screenHeight=${screen.height}&dpr=${window.devicePixelRatio}`, {
          cancelToken: cancelTokenSource.token
        })

        if (response.data && response.data.success === false) {
          console.error('Bring to front is failed')
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.$store.dispatch('browserProfiles/setCancelToken', { id: id, remove: true })
        await this.$store.dispatch('browserProfiles/removeLoading', id)
      }
    },

    has24HoursPassed (key) {
      const storedTime = parseInt(localStorage.getItem(key) || 0)
      const currentTime = new Date().getTime()
      return currentTime - storedTime >= 24 * 60 * 60 * 1000
    },

    getOsVersion (text) {
      return null
    },

    checkIfOsIsNotCompatible () {
      const osFullName = 'tajik'
      const osVersionNumber = this.getOsVersion(osFullName)
      const isWindows = osFullName.includes('Windows')
      const isSierra = osFullName.includes('Sierra')

      return (isWindows && osVersionNumber <= 8.1) || (isSierra && osVersionNumber <= 10.15)
    },

    showOsCompatibilityDialog () {
      // If browser is not compatible - check for 24 hours and show dialog
      // otherwise don't show the dialog
      if (this.checkIfOsIsNotCompatible()) {
        return !localStorage.getItem('showedOsCompatibilityDialog') || this.has24HoursPassed('showedOsCompatibilityDialog')
      }

      return false
    }
  }
}
