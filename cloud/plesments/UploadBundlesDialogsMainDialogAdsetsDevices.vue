<template>
  <v-row class="font-16">
    <!-- УСТРОЙСТВА -->
    <v-col cols="2">
      {{ $t('upload.devices.devices') }}
    </v-col>

    <v-col
        v-if="showDesktopMobileButtons"
        bottom
        cols="10"
    >
      <v-btn-toggle
          :value="devices"
          borderless
          color="primary"
          mandatory
          @change="setDeviceTypes"
      >
        <v-btn
            value="all"
            small
            v-text="$t('upload.devices.all')"
        />
        <v-tooltip
            v-if="showDesktopMobileButtons"
            bottom
            max-width="430px"
        >
          <template #activator="{ on }">
            <v-btn
                value="desktop"
                small
                :class="{'inactive-element': showDesktopMobileButtons}"
                v-on="on"
                v-text="$t('upload.devices.desktop')"
            />
          </template>
          {{ $t('upload.devices.buttonsIsNotActive') }}
        </v-tooltip>

        <v-tooltip
            v-if="showDesktopMobileButtons"
            bottom
            max-width="430px"
        >
          <template #activator="{ on }">
            <v-btn
                value="mobile"
                small
                :class="{'inactive-element': showDesktopMobileButtons}"
                v-on="on"
                v-text="$t('upload.devices.mobile')"
            />
          </template>
          {{ $t('upload.devices.buttonsIsNotActive') }}
        </v-tooltip>
      </v-btn-toggle>
    </v-col>

    <v-col
        v-elsea
        cols="10"
    >
      <v-btn-toggle
          :value="devices"
          borderless
          color="primary"
          mandatory
          @change="setDeviceTypes"
      >
        <v-btn
            value="all"
            small
            v-text="$t('upload.devices.all')"
        />
        <v-btn
            value="desktop"
            small
            v-text="$t('upload.devices.desktop')"
        />
        <v-btn
            value="mobile"
            small
            v-text="$t('upload.devices.mobile')"
        />
      </v-btn-toggle>
    </v-col>
    <!-- УСТРОЙСТВА КОНЕЦ -->

    <!-- ANDROID IOS -->
    <v-col
        v-if="devices === 'mobile' && !showDesktopMobileButtons"
        cols="10"
        offset="2"
        class="pt-0"
    >
      <v-btn-toggle
          v-model="os"
          borderless
          color="primary"
          mandatory
          @change="setDeviceMobileOs"
      >
        <v-btn
            value="all"
            small
            v-text="$t('upload.devices.all')"
        />
        <v-btn
            value="android"
            small
            v-text="'Android'"
        />
        <v-btn
            value="ios"
            small
            v-text="'iOS'"
        />
      </v-btn-toggle>
    </v-col>
    <!-- ANDROID IOS КОНЕЦ -->

    <!-- ANDROID -->
    <template v-if="showAndroid">
      <!-- ДЕВАЙСЫ -->
      <v-col
          cols="2"
          class="pt-1"
      >
        Android
      </v-col>
      <v-col
          cols="10"
          class="pt-1 d-flex align-center"
      >
        <v-checkbox
            v-model="androidDevices.smartphones"
            :label="$t('upload.devices.android.smartphones')"
            hide-details
            class="mt-0 pt-0"
            @change="setAndroidDevice('smartphones', $event)"
        />
        <v-checkbox
            v-model="androidDevices.tablets"
            :label="$t('upload.devices.android.tablets')"
            hide-details
            class="mt-0 pt-0 ml-6"
            @change="setAndroidDevice('tablets', $event)"
        />
      </v-col>
      <!-- ДЕВАЙСЫ КОНЕЦ -->

      <!-- ВЕРСИИ -->
      <v-col
          cols="2"
          class="pt-0"
      >
        {{ $t('upload.devices.osVersions') }}
      </v-col>
      <v-col
          cols="3"
          class="pt-0"
      >
        <v-autocomplete
            v-model="androidVersions.min"
            :prefix="$t('common.from').toLocaleLowerCase()"
            :items="androidVersionsMapped"
            dense
            hide-details
            outlined
            @change="setAndroidVersion('min', $event)"
        />
      </v-col>
      <v-col
          cols="3"
          class="pt-0"
      >
        <v-autocomplete
            v-model="androidVersions.max"
            :prefix="$t('common.to').toLocaleLowerCase()"
            :items="androidVersionsMapped"
            dense
            hide-details
            outlined
            @change="setAndroidVersion('max', $event)"
        />
      </v-col>
      <!-- ВЕРСИИ КОНЕЦ -->
      <v-col cols="4" />
    </template>
    <!-- ANDROID КОНЕЦ -->

    <!-- IOS -->
    <template v-if="showIos">
      <!-- ДЕВАЙСЫ -->
      <v-col
          cols="2"
          class="pt-1"
      >
        iOs
      </v-col>
      <v-col
          cols="10"
          class="pt-1 d-flex align-center"
      >
        <v-checkbox
            v-model="iosDevices.iphone"
            label="iPhone"
            hide-details
            class="mt-0 pt-0"
            @change="setIosDevice('iphone', $event)"
        />
        <v-checkbox
            v-model="iosDevices.ipad"
            label="iPad"
            hide-details
            class="mt-0 pt-0 ml-6"
            @change="setIosDevice('ipad', $event)"
        />
        <v-checkbox
            v-model="iosDevices.ipod"
            label="iPod"
            hide-details
            class="mt-0 pt-0 ml-6"
            @change="setIosDevice('ipod', $event)"
        />
      </v-col>
      <!-- ДЕВАЙСЫ КОНЕЦ -->

      <!-- ВЕРСИИ -->
      <v-col
          cols="2"
          class="pt-0"
      >
        {{ $t('upload.devices.osVersions') }}
      </v-col>
      <v-col
          cols="3"
          class="pt-0"
      >
        <v-autocomplete
            v-model="iosVersions.min"
            :prefix="$t('common.from').toLocaleLowerCase()"
            :items="iosVersionsMapped"
            dense
            hide-details
            outlined
            @change="setIosVersion('min', $event)"
        />
      </v-col>
      <v-col
          cols="3"
          class="pt-0"
      >
        <v-autocomplete
            v-model="iosVersions.max"
            :prefix="$t('common.to').toLocaleLowerCase()"
            :items="iosVersionsMapped"
            dense
            hide-details
            outlined
            @change="setIosVersion('max', $event)"
        />
      </v-col>
      <!-- ВЕРСИИ КОНЕЦ -->
    </template>
    <!-- IOS КОНЕЦ -->

    <!-- КАМПАНИЯ ДЛЯ iOS 14+ -->
    <v-col
        v-if="devices === 'mobile' && (os === 'ios') && forMainDialog.objective === 'APP_INSTALLS'"
        cols="12"
        class="d-flex align-center"
    >
      <v-switch
          :input-value="forMainDialog.devices.campaign_for_ios"
          :label="$t('common.campaignForIOS')"
          class="pt-0 mt-0"
          dense
          hide-details
          @change="setCampaignForIos('campaign_for_ios', $event)"
      />
      <v-tooltip
          bottom
          max-width="300"
      >
        <template #activator="{ on }">
          <v-icon
              :size="14"
              class="ml-2 cursor-pointer"
              v-on="on"
          >
            far fa-question-circle
          </v-icon>
        </template>
        <span>{{ $t('common.campaignForIOSHint') }}</span>
      </v-tooltip>
    </v-col>
    <!-- КАМПАНИЯ ДЛЯ iOS 14+ КОНЕЦ -->

    <!-- ТОЛЬКО ПРИ ПОДКЛЮЧЕНИИ К WI-FI -->
    <v-col
        cols="12"
        class="d-flex align-center"
    >
      <v-switch
          :input-value="forMainDialog.wifi_only"
          :label="$t('common.wifiOnly')"
          class="pt-0 mt-0"
          dense
          hide-details
          @change="setProperty('wifi_only', $event)"
      />
      <v-tooltip
          bottom
          max-width="300"
      >
        <template #activator="{ on }">
          <v-icon
              :size="14"
              class="ml-2 cursor-pointer"
              v-on="on"
          >
            far fa-question-circle
          </v-icon>
        </template>
        <span>{{ $t('common.autoPlacementsHint') }}</span>
      </v-tooltip>
    </v-col>
    <!-- ТОЛЬКО ПРИ ПОДКЛЮЧЕНИИ К WI-FI КОНЕЦ -->
  </v-row>
</template>

<script>
import androidVersionsList from '@/constants/upload/android_versions';
import iosVersionsList     from '@/constants/upload/ios_versions';
import { mapGetters }      from 'vuex';

export default {
  name: 'UploadBundlesDialogsMainDialogAdsetsDevices',

  data() {
    return {
      devices: 'all',
      os: 'all',
      androidDevices: {
        smartphones: true,
        tablets: true,
      },
      androidVersions: {
        min: '0.0',
        max: '0.0',
      },
      iosDevices: {
        iphone: true,
        ipad: true,
        ipod: true,
      },
      iosVersions: {
        min: '0.0',
        max: '0.0',
      },
    };
  },

  computed: {
    ...mapGetters({
      forMainDialog: 'bundles/forMainDialog',
    }),

    androidVersionsMapped() {
      return androidVersionsList.map(i => {
        return {
          text: i === '0.0' ? this.$t('upload.devices.anyVersion').toLocaleLowerCase() : i,
          value: i
        };
      });
    },

    iosVersionsMapped() {
      return iosVersionsList.map(i => {
        return {
          text: i === '0.0' ? this.$t('upload.devices.anyVersion').toLocaleLowerCase() : i,
          value: i
        };
      });
    },

    showAndroid() {
      console.log('this.os', this.os);
      console.log('this.devices', this.devices);
      return this.devices === 'mobile' && !this.showDesktopMobileButtons &&
          (this.os === 'all' || this.os === 'android');
    },

    showIos() {
      return this.devices === 'mobile' && !this.showDesktopMobileButtons &&
          (this.os === 'all' || this.os === 'ios');
    },

    showDesktopMobileButtons() {
      return this.forMainDialog.auto_placement;
    }
  },

  watch: {
    'forMainDialog.devices': {
      deep: true,
      handler(newValue) {
        if (newValue.types.desktop && !newValue.types.mobile) {
          this.devices = 'desktop';
        } else if (!newValue.types.desktop && newValue.types.mobile) {
          this.devices = 'mobile';
        } else {
          this.devices = 'all';
        }
      }
    },

    // 'forMainDialog.auto_placement': {
    //   deep: true,
    //   handler(newValue) {
    //     console.log('newValue-111', newValue)
    //     if (newValue){
    //       console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ')
    //       // const devices = this.$_.cloneDeep(this.forMainDialog.devices);
    //       //
    //       // devices.types = {
    //       //   desktop: true,
    //       //   mobile: false,
    //       // };
    //       this.devices === 'all';
    //       // this.os === 'all';
    //
    //     }
    //   }
    // }
  },

  created() {
    const { desktop, mobile } = this.forMainDialog.devices.types;
    const { smartphones, tablets } = this.forMainDialog.devices.mobile_devices.android;
    const { iphone, ipad, ipod } = this.forMainDialog.devices.mobile_devices.ios;
    const { android: androidVersions, ios: iosVersions } = this.forMainDialog.devices.mobile_os_versions;

    if (desktop && mobile) {
      this.devices = 'all';
    } else if (desktop) {
      this.devices = 'desktop';
    } else if (mobile) {
      this.devices = 'mobile';
    }

    this.os = this.forMainDialog.devices.mobile_os;
    this.androidDevices = { smartphones, tablets, };
    this.iosDevices = { iphone, ipad, ipod, };
    this.androidVersions = androidVersions;
    this.iosVersions = iosVersions;
  },

  methods: {
    setDeviceTypes(value) {
      console.log('setDeviceTypes--11');
      if(this.showDesktopMobileButtons) return;

      const devices = this.$_.cloneDeep(this.forMainDialog.devices);

      if (value === 'all') {
        devices.types = {
          desktop: true,
          mobile: true,
        };
      } else if (value === 'desktop') {
        devices.types = {
          desktop: true,
          mobile: false,
        };
      } else if (value === 'mobile') {
        devices.types = {
          desktop: false,
          mobile: true,
        };
      }

      this.setProperty('devices', devices);
    },

    setDeviceMobileOs(value) {
      const devices = this.$_.cloneDeep(this.forMainDialog.devices);
      devices.mobile_os = value;
      this.setProperty('devices', devices);
    },

    setAndroidDevice(key, value) {
      const devices = this.$_.cloneDeep(this.forMainDialog.devices);
      devices.mobile_devices.android[key] = value;
      this.setProperty('devices', devices);
    },

    setIosDevice(key, value) {
      const devices = this.$_.cloneDeep(this.forMainDialog.devices);
      devices.mobile_devices.ios[key] = value;
      this.setProperty('devices', devices);
    },

    setAndroidVersion(key, value) {
      const devices = this.$_.cloneDeep(this.forMainDialog.devices);
      devices.mobile_os_versions.android[key] = value;
      this.setProperty('devices', devices);
    },

    setIosVersion(key, value) {
      const devices = this.$_.cloneDeep(this.forMainDialog.devices);
      devices.mobile_os_versions.ios[key] = value;
      this.setProperty('devices', devices);
    },

    setCampaignForIos(key, value) {
      const devices = this.$_.cloneDeep(this.forMainDialog.devices);
      devices[key] = value;
      this.setProperty('devices', devices);
    },

    setProperty(key, value) {
      this.$store.dispatch('bundles/setForMainDialogProperty', { key, value });
    },
  }
};
</script>

<style scoped>
.inactive-element {
  color: grey!important;
  background-color: rgba(255, 255, 255, 0.12)!important;
}
</style>

