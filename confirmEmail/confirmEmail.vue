<template>
  <v-container fluid fill-height>
    <v-alert
      v-if="showNotification"
      dense
      text
      type="success"
      class="notification-bar"
    >
      Confirmation email has been sent!
    </v-alert>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="custom-card" flat>
          <div class="d-flex justify-center pb-8">
          <icon
            name='verified24'
            style="height: 96px; width: 96px;"
          />
          </div>
          <v-card-title class="headline confirm-email d-flex justify-center pt-0 pl-0 pr-0">
            {{ $t("overview.confirmEmail") }}
          </v-card-title>
          <v-card-text class='pl-2 pr-2 pb-0 pt-2'>
            <div class="subheading sent-letter d-flex justify-center text-center letter-with-link">
              We sent an email with a link to activate your account to test@example.com.
            </div>
            <div class='support-block pt-5' v-if="showSupportBlock">
              <div class="subheading d-flex justify-center flex-column text-center notice-restrictions">
                <p>Too many attempts to send an email.</p>
                <p>To manually confirm the email, contact support.</p>
              </div>
              <v-card-actions class="d-flex justify-center text-center">
                <v-card-text color="primary" class='pt-3'>
                  <span class='link'>
                   Write to support
                  </span>
                </v-card-text>
              </v-card-actions>
            </div>
          </v-card-text>
          <v-card-actions v-if="!showSupportBlock" class="d-flex justify-center text-center send-email-block">
            <v-card-text color="primary" @click="resendEmail">
             <span :class="{ 'link': !emailResent }">
               Send email again
               <template v-if="emailResent"> in {{ countdown }}</template>
             </span>
            </v-card-text>
          </v-card-actions>
          <v-divider></v-divider>
          <v-card-text class="d-flex justify-center text-center">
            <div>
              If you have not received the email, check your spam folder or resend the email.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Icon from '@/assets/icons/Icon.vue'

export default {
  name: 'ConfirmEmail',
  components: { Icon },
  data() {
    return {
      showNotification: false,
      emailResent: false,
      countdown: '00:05',
      resendAttempts: 0,
      maxResendAttempts: 3,
      showSupportBlock: false,
    };
  },

  methods: {
    resendEmail() {
      if (this.resendAttempts >= this.maxResendAttempts) {
        this.showSupportBlock = true;
        return;
      }

      this.showNotification = true;
      this.emailResent = true;
      this.resendAttempts++;

      let seconds = 40;
      this.updateCountdown(seconds);

      const intervalId = setInterval(() => {
        seconds--;
        this.updateCountdown(seconds);

        if (seconds === 0) {
          this.showNotification = false;
          this.emailResent = false;
          clearInterval(intervalId);
        }
      }, 1000);
    },

    updateCountdown(seconds) {
      this.countdown = `00:${String(seconds).padStart(2, '0')}`;
    },
  }
};
</script>

<style scoped lang="scss">

.link {
  color: #B645EE;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
  border-bottom: 1px solid #F4E3FD;
}

.notice-restrictions {
  color: #B71921;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.notice-restrictions > p {
  margin-bottom: 0;
}

.confirm-email {
  font-family: Roboto, sans-serif!important;
  font-size: 30px!important;
  font-style: normal;
  color: var(--text-text-primary, #19181A);
  text-align: center;
  font-weight: 700;
  line-height: 36px;
}

.sent-letter {
  color: #19181A;
  text-align: center;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.custom-card {
  width: 400px;
}

.letter-with-link {
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.notification-bar {
  position: absolute;
  width: 745px;
  height: 72px;
  border: 1px solid #B6ECD4;
  border-radius: 8px;
  background: #DDF6EB!important;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11;
}
</style>













<!--<template>-->
<!--  <v-container fluid fill-height class='centered-alert'>-->
<!--    <auth-alert class="auth-alert-confirmation-email" v-if="showNotification">-->
<!--      <template #title>-->
<!--        <div class="auth-alert-confirmation-email-notification">-->
<!--          {{ $t("overview.notificationLetterSent") }}-->
<!--        </div>-->
<!--      </template>-->
<!--      <template #buttons>-->
<!--        <div-->
<!--            class="payment-alert-wrapper-icon-cross"-->
<!--        >-->
<!--          <icon name="cross24" />-->
<!--        </div>-->
<!--      </template>-->
<!--    </auth-alert>-->
<!--    <v-row align="center" justify="center">-->
<!--      <v-col cols="12" sm="8" md="4">-->
<!--        <v-card class="custom-card" flat>-->
<!--          <div class="d-flex justify-center pb-8">-->
<!--            <icon-->
<!--                name='verified24'-->
<!--                style="height: 96px; width: 96px;"-->
<!--            />-->
<!--          </div>-->
<!--          <v-card-title class="headline confirm-email d-flex justify-center pt-0 pl-0 pr-0">-->
<!--            {{ $t("overview.confirmEmail") }}-->
<!--          </v-card-title>-->
<!--          <v-card-text class='pl-2 pr-2 pb-0 pt-2'>-->
<!--            <div class="subheading link-to-account-activation d-flex justify-center text-center letter-with-link">-->
<!--              {{ $t("overview.emailMessage") + ' ' +  this.email}}-->
<!--            </div>-->
<!--            <div class='support-block pt-5' v-if="showSupportBlock">-->
<!--              <div class="subheading d-flex justify-center flex-column text-center notice-restrictions">-->
<!--                <p>{{ $t("overview.lotSendingLetters") }}</p>-->
<!--                <p>{{ $t("overview.contactWithSupport") }}</p>-->
<!--              </div>-->
<!--              <v-card-actions class="d-flex justify-center text-center">-->
<!--                <v-card-text color="primary" class='pt-3'>-->
<!--                  <span class='link-send-email-write-to-support'>-->
<!--                   {{ $t("overview.writeToSupport") }}-->
<!--                  </span>-->
<!--                </v-card-text>-->
<!--              </v-card-actions>-->
<!--            </div>-->
<!--          </v-card-text>-->
<!--          <v-card-actions v-if="!showSupportBlock" class="d-flex justify-center text-center send-email-block">-->
<!--            <v-card-text color="primary" @click="resendEmail">-->
<!--             <span :class="{ 'link-send-email-write-to-support': !emailResent }">-->
<!--               {{ $t("overview.sendEmailAgain") }}-->
<!--               <template v-if="emailResent">  {{ $t("overview.sendEmailAgainIn") }} {{ countdown }}</template>-->
<!--             </span>-->
<!--            </v-card-text>-->
<!--          </v-card-actions>-->
<!--          <v-divider></v-divider>-->
<!--          <v-card-text class="d-flex justify-center text-center">-->
<!--            <div>-->
<!--              {{ $t("overview.checkingSpamFolder") }}-->
<!--            </div>-->
<!--          </v-card-text>-->
<!--        </v-card>-->
<!--      </v-col>-->
<!--    </v-row>-->
<!--  </v-container>-->
<!--</template>-->

<!--<script>-->
<!--import Icon from '@/assets/icons/Icon.vue'-->
<!--import AuthAlert from '@/components/auth/components/AuthAlert.vue'-->

<!--export default {-->
<!--  name: 'ConfirmEmail',-->
<!--  components: { AuthAlert, Icon },-->
<!--  data() {-->
<!--    return {-->
<!--      email:'test@gmail.com78',-->
<!--      showNotification: false,-->
<!--      emailResent: false,-->
<!--      countdown: '00:05',-->
<!--      resendAttempts: 0,-->
<!--      maxResendAttempts: 3,-->
<!--      showSupportBlock: false,-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    console.log(this.$route.query, 'router')-->
<!--  },-->

<!--  methods: {-->
<!--    resendEmail() {-->
<!--      // this.$store.dispatch('affiliate/sendEmailAgain')-->

<!--      if (this.resendAttempts >= this.maxResendAttempts) {-->
<!--        this.showSupportBlock = true;-->
<!--        return;-->
<!--      }-->

<!--      this.showNotification = true;-->
<!--      this.emailResent = true;-->
<!--      this.resendAttempts++;-->

<!--      // this.getBrowserTime()-->

<!--      let seconds = this.getCountdownFromLocalStorage() || 60;-->
<!--      this.updateCountdown(seconds);-->

<!--      const intervalId = setInterval(() => {-->
<!--        seconds&#45;&#45;;-->
<!--        this.updateCountdown(seconds);-->
<!--        this.setCountdownToLocalStorage(seconds);-->

<!--        if (seconds === 0) {-->
<!--          this.emailResent = false;-->
<!--          clearInterval(intervalId);-->
<!--        }-->
<!--      }, 1000);-->

<!--      setTimeout(() => {-->
<!--        this.showNotification = false;-->
<!--      }, 5000);-->
<!--    },-->

<!--    updateCountdown(seconds) {-->
<!--      this.countdown = `00:${String(seconds).padStart(2, '0')}`;-->
<!--    },-->

<!--    getCountdownFromLocalStorage() {-->
<!--      return parseInt(localStorage.getItem('countdownSeconds'), 10);-->
<!--    },-->

<!--    setCountdownToLocalStorage(seconds) {-->
<!--      localStorage.setItem('countdownSeconds', seconds);-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped lang="scss">-->

<!--.payment-alert-wrapper-icon-cross {-->
<!--  padding: 8px;-->
<!--  line-height: 0;-->
<!--  color: var(&#45;&#45;v-alert-success-foreground-base);-->
<!--  cursor: pointer;-->
<!--  &.wrong {-->
<!--    color: var(&#45;&#45;v-alert-error-foreground-base);-->
<!--  }-->
<!--}-->

<!--.link-send-email-write-to-support {-->
<!--  color: var(&#45;&#45;link-link-primary-text-default, #B645EE);-->
<!--  font-family: Roboto, sans-serif;-->
<!--  font-size: 16px;-->
<!--  font-style: normal;-->
<!--  font-weight: 400;-->
<!--  line-height: 24px;-->
<!--  cursor: pointer;-->
<!--  border-bottom: 1px solid #F4E3FD;-->
<!--}-->

<!--.notice-restrictions {-->
<!--  color: var(&#45;&#45;text-text-error, #B71921);-->
<!--  font-family: Roboto, sans-serif;-->
<!--  font-size: 16px;-->
<!--  font-style: normal;-->
<!--  font-weight: 400;-->
<!--  line-height: 24px;-->
<!--}-->

<!--.notice-restrictions > p {-->
<!--  margin-bottom: 0;-->
<!--}-->

<!--.confirm-email {-->
<!--  font-family: Roboto, sans-serif!important;-->
<!--  font-size: 30px!important;-->
<!--  font-style: normal;-->
<!--  color: var(&#45;&#45;text-text-primary, #19181A);-->
<!--  text-align: center;-->
<!--  font-weight: 700;-->
<!--  line-height: 36px;-->
<!--}-->

<!--.link-to-account-activation {-->
<!--  color: var(&#45;&#45;text-text-primary, #19181A);-->
<!--  text-align: center;-->
<!--  font-family: Roboto, sans-serif;-->
<!--  font-size: 16px;-->
<!--  font-style: normal;-->
<!--  font-weight: 400;-->
<!--  line-height: 24px;-->
<!--}-->

<!--.custom-card {-->
<!--  width: 400px;-->
<!--}-->

<!--.letter-with-link {-->
<!--  color: var(&#45;&#45;text-text-primary, #19181A);-->
<!--  font-family: Roboto, sans-serif;-->
<!--  font-size: 16px;-->
<!--  font-style: normal;-->
<!--  font-weight: 400;-->
<!--  line-height: 24px;-->
<!--}-->

<!--.notification-bar {-->
<!--  position: absolute;-->
<!--  width: 745px;-->
<!--  height: 72px;-->
<!--  border: 1px solid #B6ECD4;-->
<!--  border-radius: 8px;-->
<!--  background: #DDF6EB!important;-->
<!--  top: 0;-->
<!--  left: 50%;-->
<!--  transform: translateX(-50%);-->
<!--  z-index: 11;-->
<!--}-->

<!--.centered-alert {-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--}-->

<!--.auth-alert-confirmation-email {-->
<!--  width: 745px;-->
<!--  height: 72px;-->
<!--}-->

<!--.auth-alert-confirmation-email-notification {-->
<!--  font-family: Roboto, sans-serif;-->
<!--  color: var(&#45;&#45;alert-alert-success-foreground, #0F8D57);-->
<!--  font-size: 14px;-->
<!--  font-style: normal;-->
<!--  font-weight: 600;-->
<!--  line-height: 20px;-->
<!--}-->

<!--</style>-->

