<template>
  <div class="pb-3">
    <!-- АВТО-ПЛЕЙСМЕНТЫ -->
    <div class="d-flex align-center mb-3">
      <v-switch
          :input-value="forMainDialog.auto_placement"
          :label="$t('common.autoPlacements')"
          class="pt-0 mt-0"
          dense
          hide-details
          :disabled="forMainDialog.objective === BOOST_FP"
          @change="changeAutoPlacement"
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
    </div>
    <!-- АВТО-ПЛЕЙСМЕНТЫ КОНЕЦ -->

    <template v-if="!forMainDialog.auto_placement">
      <span class="font-16">
        {{ $t('common.platforms') }}
      </span>
      <div class="d-flex flex-wrap mb-3">
        <v-alert
            color="primary"
            dense
            text
            class="mb-0 mt-2"
        >
          <v-checkbox
              :input-value="checkboxFacebook"
              label="Facebook"
              hide-details
              :indeterminate="!checkboxFacebook && selectedItems.some(i => i.startsWith('facebook'))"
              class="mt-0 pt-0"
              @change="checkFacebook"
          />
        </v-alert>
        <v-alert
            color="primary"
            text
            dense
            class="mb-0 ml-2 mt-2"
        >
          <v-checkbox
              :input-value="checkboxInstagram"
              label="Instagram"
              hide-details
              :indeterminate="!checkboxInstagram && selectedItems.some(i => i.startsWith('instagram'))"
              :disabled="forMainDialog.objective === BOOST_FP"
              class="mt-0 pt-0"
              @change="checkInstagram"
          />
        </v-alert>
        <v-alert
            color="primary"
            text
            dense
            class="mb-0 ml-2 mt-2"
        >
          <v-checkbox
              :input-value="checkboxAudienceNetwork"
              label="Audience Network"
              hide-details
              :indeterminate="!checkboxAudienceNetwork && selectedItems.some(i => i.startsWith('audience_network'))"
              :disabled="forMainDialog.objective === BOOST_FP"
              class="mt-0 pt-0"
              @change="checkAudienceNetwork"
          />
        </v-alert>
        <v-alert
            color="primary"
            text
            dense
            class="mb-0 ml-2 mt-2"
        >
          <v-checkbox
              :input-value="checkboxMessenger"
              label="Messenger"
              hide-details
              :indeterminate="!checkboxMessenger && selectedItems.some(i => i.startsWith('messenger'))"
              :disabled="forMainDialog.objective === BOOST_FP"
              class="mt-0 pt-0"
              @change="checkMessenger"
          />
        </v-alert>
      </div>
      <span class="font-16">
        {{ $t('common.placement') }}
      </span>
      <v-treeview
          :value="selectedItems"
          selectable
          :items="items"
          item-disabled="locked"
          selected-color="primary"
          color="warning"
          class="create-bundle-treeview"
          @input="handleTreeviewInput"
      >
        <template #label="{item}">
          <template v-if="item.description">
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <span v-else>
            {{ item.name }}
          </span>
        </template>
      </v-treeview>
    </template>
  </div>
</template>

<script>
import emptyPlacements from '@/constants/bundles/placements';
import {BOOST_FP}      from '@/constants/upload/consideration-types';
import { mapGetters }  from 'vuex';

export default {
  name: 'UploadBundlesDialogsMainDialogAdsetsPlacements',

  data() {
    return {
      selectedItems: [],
      BOOST_FP
    };
  },

  computed: {
    ...mapGetters({
      forMainDialog: 'bundles/forMainDialog',
    }),

    items() {
      return [
        {
          id: 'tapes',
          name: this.$t('upload.placements.tapes'),
          description: this.$t('upload.placements.tapesDesc'),
          locked: false,
          children: [
            { id: 'facebook::feed', name: this.$t('upload.placements.facebookRibbon') },
            {
              id: 'facebook::profile_feed',
              name: this.$t('upload.placements.facebookProfileFeed')
            },
            { id: 'facebook::right_hand_column', name: this.$t('upload.placements.facebookRightColumn') },
            { id: 'facebook::video_feeds', name: this.$t('upload.placements.facebookVideotapes') },
            { id: 'facebook::marketplace', name: this.$t('upload.placements.facebookMarketplace') },
            {
              id: 'instagram::stream',
              name: this.$t('upload.placements.instagramFeed'),
              locked: this.forMainDialog.objective === BOOST_FP,
            },
            {
              id: 'instagram::profile_feed',
              name: this.$t('upload.placements.instagramProfileFeed'),
            },
            {
              id: 'instagram::explore',
              name: this.$t('upload.placements.instagramInteresting'),
              locked: this.forMainDialog.objective === BOOST_FP,
            },
            {
              id: 'instagram::explore_home',
              name: this.$t('upload.placements.instagramExploreHome'),
            },
            {
              id: 'messenger::messenger_home',
              name: this.$t('upload.placements.messengerInbox'),
              locked: this.forMainDialog.objective === BOOST_FP,
            },
          ],
        },
        {
          id: 'reels_stories_and_videos',
          name: this.$t('upload.placements.reelsStoriesAndVideos'),
          description: this.$t('upload.placements.reelsStoriesAndVideosDesc'),
          locked: false,
          children: [
            {
              id: 'instagram::story',
              name: this.$t('upload.placements.storiesOnInstagram'),
              locked: this.forMainDialog.objective === BOOST_FP,
            },
            { id: 'facebook::story', name: this.$t('upload.placements.facebookStories') },
            {
              id: 'messenger::story',
              name: this.$t('upload.placements.storiesInMessenger'),
              locked: this.forMainDialog.objective === BOOST_FP,
            },
            {
              id: 'instagram::reels',
              name: this.$t('upload.placements.reelsInstagram'),
              locked: this.forMainDialog.objective === BOOST_FP,
            },
            { id: 'facebook::reels', name: this.$t('upload.placements.reelsFacebook') },
          ],
        },
        {
          id: 'applications_and_websites',
          name: this.$t('upload.placements.applicationsAndWebsites'),
          description: this.$t('upload.placements.applicationsAndWebsitesDesc'),
          locked: this.forMainDialog.objective === BOOST_FP,
          children: [
            { id: 'audience_network::classic',
              name: this.$t('upload.placements.audienceNetworkNativeBannerInterstitialAdvertising') },
            { id: 'audience_network::rewarded_video', name: this.$t('upload.placements.audienceNetworkRewardedVideo') },
            { id: 'audience_network::instream_video', name: this.$t('upload.placements.audienceNetworkInStreamVideo') },
          ],
        },
        {
          id: 'facebook::instream_videos',
          name: this.$t('upload.placements.facebookInSteamVideo'),
          description: this.$t('upload.placements.facebookInSteamVideoDesc'),
          locked: false,
          children: [
            { id: 'facebook::instream_video',
              name: this.$t('upload.placements.facebookInSteamVideos'),
            },
            { id: 'facebook::facebook_reels_overlay',
              name: this.$t('upload.placements.adsFacebookReels')
            },
            { id: 'instagram::reels_overlay',
              name: this.$t('upload.placements.adsInstagramReels')
            },
          ],
        },
        {
          id: 'facebook::searches',
          name: this.$t('upload.placements.facebookSearchResults'),
          description: this.$t('upload.placements.facebookSearchResultsDesc'),
          locked: false,
          children: [
            { id: 'facebook::search',
              name: this.$t('upload.placements.facebookSearchResult'),
            },
            { id: 'instagram::ig_search',
              name: this.$t('upload.placements.instagramSearchResult')
            },
          ],
        },
        {
          id: 'messenger::sponsored_messages',
          name: this.$t('upload.placements.promotionalMessagesInMessenger'),
          description: this.$t('upload.placements.promotionalMessagesInMessengerDesc'),
          locked: this.forMainDialog.bid_strategy === 'LOWEST_COST_WITHOUT_CAP' || this.forMainDialog.objective === BOOST_FP,
        },
        {
          id: 'facebook::instant_article',
          name: this.$t('upload.placements.instantArticlesFacebook'),
          description: this.$t('upload.placements.instantArticlesFacebookDesc'),
          locked: false,
        },
      ];
    },

    checkboxFacebook() {
      let itemsCount = 0;

      for (const item of this.selectedItems) {
        if (item.startsWith('facebook')) itemsCount++;
      }

      return itemsCount === 9;
    },

    checkboxInstagram() {
      let itemsCount = 0;

      for (const item of this.selectedItems) {
        if (item.startsWith('instagram')) itemsCount++;
      }

      return itemsCount === 3;
    },

    checkboxAudienceNetwork() {
      let itemsCount = 0;

      for (const item of this.selectedItems) {
        if (item.startsWith('audience_network')) itemsCount++;
      }

      return itemsCount === 3;
    },

    checkboxMessenger() {
      let itemsCount = 0;

      for (const item of this.selectedItems) {
        if (item.startsWith('messenger')) itemsCount++;
      }

      return itemsCount === 3;
    },
  },

  watch: {
    selectedItems: {
      deep: true,
      handler(newVal) {
        const placements = this.$_.cloneDeep(emptyPlacements);

        for (const type of Object.keys(placements)) {
          this.checkAvailability(newVal, type, placements[type]);
        }

        this.setProperty('placements', placements);
      }
    }
  },

  created() {
    for (const rootKey in this.forMainDialog.placements) {
      for (const itemKey in this.forMainDialog.placements[rootKey]) {
        if (this.forMainDialog.placements[rootKey][itemKey]) {
          this.selectedItems.push(`${rootKey}::${itemKey}`);
        }
      }
    }

    if (this.forMainDialog.objective === BOOST_FP) {
      this.selectedItems = [
        'facebook::feed',
        'facebook::right_hand_column',
        'facebook::video_feeds',
        'facebook::marketplace',
        'facebook::story',
        'facebook::reels',
        'facebook::instream_video',
        'facebook::search',
        'facebook::instant_article'
      ];
    }
  },

  methods: {
    handleTreeviewInput(values) {
      if (this.forMainDialog.objective === BOOST_FP) {
        this.selectedItems = values.filter(i => i.startsWith('facebook'));

        return;
      }

      if (!this.$_.isEqual(values, this.selectedItems)) {
        this.selectedItems = values;
      }
    },

    setProperty(key, value) {
      this.$store.dispatch('bundles/setForMainDialogProperty', { key, value });
    },

    checkFacebook(value) {
      if (value) {
        const items = [
          'facebook::feed',
          'facebook::profile_feed',
          'facebook::right_hand_column',
          'facebook::video_feeds',
          'facebook::marketplace',
          'facebook::story',
          'facebook::reels',
          'facebook::instream_video',
          'facebook::facebook_reels_overlay',
          'facebook::search',
          'facebook::instant_article'
        ];

        for (const item of items) {
          if (!this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
          }
        }
      } else {
        this.selectedItems = this.selectedItems.filter(i => !i.startsWith('facebook'));
      }
    },

    checkInstagram(value) {
      if (value) {
        const items = [
          'instagram::stream',
          'instagram::explore',
          'instagram::story',
          'instagram::reels',
          'instagram::profile_feed',
          'instagram::explore_home',
          'instagram::reels_overlay',
          'instagram::ig_search',
        ];

        for (const item of items) {
          if (!this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
          }
        }
      } else {
        this.selectedItems = this.selectedItems.filter(i => !i.startsWith('instagram'));
      }
    },

    checkAudienceNetwork(value) {
      if (value) {
        const items = [
          'audience_network::classic',
          'audience_network::rewarded_video',
          'audience_network::instream_video',
        ];

        for (const item of items) {
          if (!this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
          }
        }
      } else {
        this.selectedItems = this.selectedItems.filter(i => !i.startsWith('audience_network'));
      }
    },

    checkMessenger(value) {
      if (value) {
        const items = [
          'messenger::messenger_home',
          'messenger::story',
        ];

        if (this.forMainDialog.bid_strategy !== 'LOWEST_COST_WITHOUT_CAP') {
          items.push('messenger::sponsored_messages');
        }

        for (const item of items) {
          if (!this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
          }
        }
      } else {
        this.selectedItems = this.selectedItems.filter(i => !i.startsWith('messenger'));
      }
    },

    customFilter(arr, title) {
      return arr
          .filter(i => i.startsWith(title))
          .map(i => i.split('::')[1]);
    },

    checkAvailability(arr, type, obj) {
      const newArr = this.customFilter(arr, type);

      for (const i of Object.keys(obj)) {
        obj[i] = newArr.includes(i);
      }
    },

    changeAutoPlacement (value) {
      console.log('AAA value', value)
      this.setProperty('auto_placement', value);
      // this.setProperty('auto_placement', true);
    }
  }
};
</script>

<style>
.create-bundle-treeview .v-list-item__title,
.create-bundle-treeview .v-list-item__subtitle,
.create-bundle-treeview .v-treeview-node__label {
  white-space: normal;
}
.create-bundle-treeview .v-list-item__subtitle {
  font-size: 12px;
}
.theme--light .create-bundle-treeview .v-list-item__subtitle {
  color: #666666;
}
.theme--dark .create-bundle-treeview .v-list-item__subtitle {
  color: #909090
}
</style>
