<template>
  <v-card outlined>
    <what-is-trigger-words v-if="dialogs.dialogWhatIsTriggerWords" />

    <!-- ЗАГОЛОВОК -->
    <v-card-title>
      {{ $t('comments.triggerWords') }}
      <v-btn
        icon
        x-small
        class="ml-1"
      >
        <v-icon
          :size="16"
          color="primary"
          @click="$store.dispatch('comments/openDialog', 'dialogWhatIsTriggerWords');"
        >
          far fa-question-circle
        </v-icon>
      </v-btn>
    </v-card-title>
    <!-- ЗАГОЛОВОК КОНЕЦ-->

    <v-card-text>
      <!-- ТОГГЛ -->
      <v-btn-toggle
        :value="settings.triggerWordsInclude"
        borderless
        color="primary"
        mandatory
        dense
        @change="handleTriggerWordsIncludeChange"
      >
        <v-btn
          :disabled="disableSaveButton"
          value="exclude"
          small
        >
          <span>{{ $t('comments.removeComments') }}</span>
        </v-btn>

        <v-btn
          :disabled="disableSaveButton"
          value="include"
          small
        >
          <span>{{ $t('comments.leaveComments') }}</span>
        </v-btn>
      </v-btn-toggle>
      <!-- ТОГГЛ КОНЕЦ -->

      <!-- ТРИГГЕРНЫЕ СЛОВА -->
<!--      <v-tooltip-->
<!--        v-if="isCommentJustDownloadMode"-->
<!--        bottom-->
<!--      >-->
<!--        <template v-slot:activator="{ on }">-->
<!--          <v-textarea-->
<!--              :value="settings.triggerWords"-->
<!--              rows="10"-->
<!--              :label="$t('comments.triggerWords')"-->
<!--              :disabled="disableTriggerWordsInput"-->
<!--              no-resize-->
<!--              outlined-->
<!--              dense-->
<!--              hide-details-->
<!--              class="mt-4 comments-settings-textarea"-->
<!--              @input="handleTriggerWordsInput"-->
<!--              v-on="on"-->
<!--          />-->
<!--        </template>-->
<!--        <span>You cannot use trigger words</span>-->
<!--      </v-tooltip>-->

      <div class="position-relative">
        <v-textarea
            :value="settings.triggerWords"
            rows="10"
            :label="$t('comments.triggerWords')"
            :disabled="disableTriggerWordsInput"
            no-resize
            outlined
            dense
            hide-details
            class="mt-4 comments-settings-textarea"
            @input="handleTriggerWordsInput"
        />
        <div class="custom-tooltip">
          <span>{{ $t('settings.usingGlobalsSettings') }}</span>
        </div>
      </div>
      <!-- ТРИГГЕРНЫЕ СЛОВА КОНЕЦ -->
    </v-card-text>

    <!-- ДЕЙСТВИЯ -->
    <v-card-actions>
      <v-btn
        v-if="!disableSaveButton"
        text
        color="primary"
        :loading="loading"
        :disabled="disableSaveButton"
        @click="save"
      >
        {{ $t('common.save') }}
      </v-btn>

      <v-tooltip
        v-else
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            text
            color="grey"
            v-on="on"
          >
            {{ $t('common.save') }}
          </v-btn>
        </template>
        <span> {{ $t('settings.usingGlobalsSettings') }}</span>
      </v-tooltip>
    </v-card-actions>
    <!-- ДЕЙСТВИЯ КОНЕЦ -->
  </v-card>
</template>

<script>
import { mapGetters }     from 'vuex';

import WhatIsTriggerWords from './CommentsSettingsDialogWhatIsTriggerWords';
import {COMMENT_JUST_DOWNLOAD} from '@/constants/comments/comments_actions';

export default {
  name: 'CommentsSettingsTriggerWords',

  components: {
    WhatIsTriggerWords
  },

  data() {
    return {
      loading: false,
      COMMENT_JUST_DOWNLOAD,
      showTooltip: false
    };
  },

  computed: {
    ...mapGetters({
      dialogs: 'comments/dialogs',
      settings: 'comments/settings',
      profile: 'main/profile',
    }),

    isCommentJustDownloadMode() {
      console.log('this.settings.mode === COMMENT_JUST_DOWNLOAD', this.settings.mode === COMMENT_JUST_DOWNLOAD);
      console.log('this.settings.mode11', this.settings.mode);
      return this.settings.mode === COMMENT_JUST_DOWNLOAD;
    },

    disableSaveButton() {
      return !!((this.settings.global_setting && this.profile.role !== 'admin') || this.isCommentJustDownloadMode);
    },

    disableTriggerWordsInput() {
      return this.isCommentJustDownloadMode;
    }
  },

  methods: {
    handleTriggerWordsIncludeChange(value) {
      this.$store.dispatch('comments/setSettingsProperty', { key: 'triggerWordsInclude', value });
    },

    handleTriggerWordsInput(value) {
      this.$store.dispatch('comments/setSettingsProperty', { key: 'triggerWords', value });
    },

    async save() {

      try {
        this.loading = true;

        await this.api.put('/fb-comment-settings', {
          triggerWords: this.settings.triggerWords.split("\n").filter((str) => str),
          triggerWordsInclude: this.settings.triggerWordsInclude
        });
      } catch (error) {
        //
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.custom-tooltip {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.custom-tooltip span {
  display: inline-block;
}

.position-relative {
  position: relative;
}

.position-relative:hover .custom-tooltip {
  visibility: visible;
  opacity: 1;
}
</style>















<!--<template>-->
<!--  <v-card outlined>-->
<!--    <what-is-trigger-words v-if="dialogs.dialogWhatIsTriggerWords" />-->

<!--    &lt;!&ndash; ЗАГОЛОВОК &ndash;&gt;-->
<!--    <v-card-title>-->
<!--      {{ $t('comments.triggerWords') }}-->
<!--      <v-btn-->
<!--          icon-->
<!--          x-small-->
<!--          class="ml-1"-->
<!--      >-->
<!--        <v-icon-->
<!--            :size="16"-->
<!--            color="primary"-->
<!--            @click="$store.dispatch('comments/openDialog', 'dialogWhatIsTriggerWords');"-->
<!--        >-->
<!--          far fa-question-circle-->
<!--        </v-icon>-->
<!--      </v-btn>-->
<!--    </v-card-title>-->
<!--    &lt;!&ndash; ЗАГОЛОВОК КОНЕЦ&ndash;&gt;-->

<!--    <v-card-text>-->
<!--      &lt;!&ndash; ТОГГЛ &ndash;&gt;-->
<!--      <v-btn-toggle-->
<!--          :value="settings.triggerWordsInclude"-->
<!--          borderless-->
<!--          color="primary"-->
<!--          mandatory-->
<!--          dense-->
<!--          @change="handleTriggerWordsIncludeChange"-->
<!--      >-->
<!--        <v-btn-->
<!--            :disabled="disableSaveButton"-->
<!--            value="exclude"-->
<!--            small-->
<!--        >-->
<!--          <span>{{ $t('comments.removeComments') }}</span>-->
<!--        </v-btn>-->

<!--        <v-btn-->
<!--            :disabled="disableSaveButton"-->
<!--            value="include"-->
<!--            small-->
<!--        >-->
<!--          <span>{{ $t('comments.leaveComments') }}</span>-->
<!--        </v-btn>-->
<!--      </v-btn-toggle>-->
<!--      &lt;!&ndash; ТОГГЛ КОНЕЦ &ndash;&gt;-->

<!--      &lt;!&ndash; ТРИГГЕРНЫЕ СЛОВА &ndash;&gt;-->
<!--      <v-tooltip-->
<!--          v-if="isCommentJustDownloadMode"-->
<!--          bottom-->
<!--      >-->
<!--        <template v-slot:activator="{ on }">-->
<!--          <v-textarea-->
<!--              :value="settings.triggerWords"-->
<!--              rows="10"-->
<!--              :label="$t('comments.triggerWords')"-->
<!--              :disabled="disableTriggerWordsInput"-->
<!--              no-resize-->
<!--              outlined-->
<!--              dense-->
<!--              hide-details-->
<!--              class="mt-4 comments-settings-textarea"-->
<!--              @input="handleTriggerWordsInput"-->
<!--              v-on="on"-->
<!--          />-->
<!--        </template>-->
<!--        <span>You cannot use trigger words</span>-->
<!--      </v-tooltip>-->

<!--      <v-textarea-->
<!--          v-else-->
<!--          :value="settings.triggerWords"-->
<!--          rows="10"-->
<!--          :label="$t('comments.triggerWords')"-->
<!--          :disabled="disableTriggerWordsInput"-->
<!--          no-resize-->
<!--          outlined-->
<!--          dense-->
<!--          hide-details-->
<!--          class="mt-4 comments-settings-textarea"-->
<!--          @input="handleTriggerWordsInput"-->
<!--      />-->
<!--      &lt;!&ndash; ТРИГГЕРНЫЕ СЛОВА КОНЕЦ &ndash;&gt;-->
<!--    </v-card-text>-->

<!--    &lt;!&ndash; ДЕЙСТВИЯ &ndash;&gt;-->
<!--    <v-card-actions>-->
<!--      <v-btn-->
<!--          v-if="!disableSaveButton"-->
<!--          text-->
<!--          color="primary"-->
<!--          :loading="loading"-->
<!--          :disabled="disableSaveButton"-->
<!--          @click="save"-->
<!--      >-->
<!--        {{ $t('common.save') }}-->
<!--      </v-btn>-->

<!--      <v-tooltip-->
<!--          v-else-->
<!--          bottom-->
<!--      >-->
<!--        <template v-slot:activator="{ on }">-->
<!--          <v-btn-->
<!--              text-->
<!--              color="grey"-->
<!--              v-on="on"-->
<!--          >-->
<!--            {{ $t('common.save') }}-->
<!--          </v-btn>-->
<!--        </template>-->
<!--        <span> {{ $t('settings.usingGlobalsSettings') }}</span>-->
<!--      </v-tooltip>-->
<!--    </v-card-actions>-->
<!--    &lt;!&ndash; ДЕЙСТВИЯ КОНЕЦ &ndash;&gt;-->
<!--  </v-card>-->
<!--</template>-->

<!--<script>-->
<!--import { mapGetters }     from 'vuex';-->

<!--import WhatIsTriggerWords from './CommentsSettingsDialogWhatIsTriggerWords';-->
<!--import {COMMENT_JUST_DOWNLOAD} from '@/constants/comments/comments_actions';-->

<!--export default {-->
<!--  name: 'CommentsSettingsTriggerWords',-->

<!--  components: {-->
<!--    WhatIsTriggerWords-->
<!--  },-->

<!--  data() {-->
<!--    return {-->
<!--      loading: false,-->
<!--      COMMENT_JUST_DOWNLOAD,-->
<!--      showTooltip: false-->
<!--    };-->
<!--  },-->

<!--  computed: {-->
<!--    ...mapGetters({-->
<!--      dialogs: 'comments/dialogs',-->
<!--      settings: 'comments/settings',-->
<!--      profile: 'main/profile',-->
<!--    }),-->

<!--    isCommentJustDownloadMode() {-->
<!--      console.log('this.settings.mode === COMMENT_JUST_DOWNLOAD', this.settings.mode === COMMENT_JUST_DOWNLOAD);-->
<!--      console.log('this.settings.mode11', this.settings.mode);-->
<!--      return this.settings.mode === COMMENT_JUST_DOWNLOAD;-->
<!--    },-->

<!--    disableSaveButton() {-->
<!--      return !!((this.settings.global_setting && this.profile.role !== 'admin') || this.isCommentJustDownloadMode);-->
<!--    },-->

<!--    disableTriggerWordsInput() {-->
<!--      return this.isCommentJustDownloadMode;-->
<!--    }-->
<!--  },-->

<!--  methods: {-->
<!--    handleTriggerWordsIncludeChange(value) {-->
<!--      this.$store.dispatch('comments/setSettingsProperty', { key: 'triggerWordsInclude', value });-->
<!--    },-->

<!--    handleTriggerWordsInput(value) {-->
<!--      this.$store.dispatch('comments/setSettingsProperty', { key: 'triggerWords', value });-->
<!--    },-->

<!--    async save() {-->

<!--      try {-->
<!--        this.loading = true;-->

<!--        await this.api.put('/fb-comment-settings', {-->
<!--          triggerWords: this.settings.triggerWords.split("\n").filter((str) => str),-->
<!--          triggerWordsInclude: this.settings.triggerWordsInclude-->
<!--        });-->
<!--      } catch (error) {-->
<!--        // -->
<!--      } finally {-->
<!--        this.loading = false;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->




<!--<template>-->
<!--  <v-card outlined>-->
<!--    <what-is-trigger-words v-if="dialogs.dialogWhatIsTriggerWords" />-->

<!--    &lt;!&ndash; ЗАГОЛОВОК &ndash;&gt;-->
<!--    <v-tooltip bottom>-->
<!--      <template v-slot:activator="{ on }">-->
<!--        <v-card-title v-on="on">-->
<!--          {{ $t('comments.triggerWords') }}-->
<!--          <v-btn-->
<!--              icon-->
<!--              x-small-->
<!--              class="ml-1"-->
<!--          >-->
<!--            <v-icon-->
<!--                :size="16"-->
<!--                color="primary"-->
<!--                @click="$store.dispatch('comments/openDialog', 'dialogWhatIsTriggerWords');"-->
<!--            >-->
<!--              far fa-question-circle-->
<!--            </v-icon>-->
<!--          </v-btn>-->
<!--        </v-card-title>-->
<!--        &lt;!&ndash; ЗАГОЛОВОК КОНЕЦ&ndash;&gt;-->

<!--        <v-card-text v-on="on">-->
<!--          &lt;!&ndash; ТОГГЛ &ndash;&gt;-->
<!--          <v-btn-toggle-->
<!--              :value="settings.triggerWordsInclude"-->
<!--              borderless-->
<!--              color="primary"-->
<!--              mandatory-->
<!--              dense-->
<!--              @change="handleTriggerWordsIncludeChange"-->
<!--          >-->
<!--            <v-btn-->
<!--                :disabled="disableSaveButton"-->
<!--                value="exclude"-->
<!--                small-->
<!--            >-->
<!--              <span>{{ $t('comments.removeComments') }}</span>-->
<!--            </v-btn>-->

<!--            <v-btn-->
<!--                :disabled="disableSaveButton"-->
<!--                value="include"-->
<!--                small-->
<!--            >-->
<!--              <span>{{ $t('comments.leaveComments') }}</span>-->
<!--            </v-btn>-->
<!--          </v-btn-toggle>-->
<!--          &lt;!&ndash; ТОГГЛ КОНЕЦ &ndash;&gt;-->

<!--          &lt;!&ndash; ТРИГГЕРНЫЕ СЛОВА &ndash;&gt;-->
<!--          <v-textarea-->
<!--              :value="settings.triggerWords"-->
<!--              rows="10"-->
<!--              :label="$t('comments.triggerWords')"-->
<!--              :disabled="disableTriggerWordsInput"-->
<!--              no-resize-->
<!--              outlined-->
<!--              dense-->
<!--              hide-details-->
<!--              class="mt-4 comments-settings-textarea"-->
<!--              @input="handleTriggerWordsInput"-->
<!--          />-->
<!--          &lt;!&ndash; ТРИГГЕРНЫЕ СЛОВА КОНЕЦ &ndash;&gt;-->
<!--        </v-card-text>-->

<!--        &lt;!&ndash; ДЕЙСТВИЯ &ndash;&gt;-->
<!--        <v-card-actions>-->
<!--          <v-btn-->
<!--              v-if="!disableSaveButton"-->
<!--              text-->
<!--              color="primary"-->
<!--              :loading="loading"-->
<!--              :disabled="disableSaveButton"-->
<!--              @click="save"-->
<!--          >-->
<!--            {{ $t('common.save') }}-->
<!--          </v-btn>-->

<!--          <v-tooltip-->
<!--              v-else-->
<!--              bottom-->
<!--          >-->
<!--            <template v-slot:activator="{ on }">-->
<!--              <v-btn-->
<!--                  text-->
<!--                  color="grey"-->
<!--                  v-on="on"-->
<!--              >-->
<!--                {{ $t('common.save') }}-->
<!--              </v-btn>-->
<!--            </template>-->
<!--            <span> {{ $t('settings.usingGlobalsSettings') }}</span>-->
<!--          </v-tooltip>-->
<!--        </v-card-actions>-->
<!--      </template>-->
<!--      <span>hbsubvushdfbiushbubusrtgrtg</span>-->
<!--    </v-tooltip>-->
<!--    &lt;!&ndash; ДЕЙСТВИЯ КОНЕЦ &ndash;&gt;-->
<!--  </v-card>-->
<!--</template>-->

<!--<script>-->
<!--import { mapGetters }     from 'vuex';-->

<!--import WhatIsTriggerWords from './CommentsSettingsDialogWhatIsTriggerWords';-->
<!--import {COMMENT_JUST_DOWNLOAD} from '@/constants/comments/comments_actions';-->

<!--export default {-->
<!--  name: 'CommentsSettingsTriggerWords',-->

<!--  components: {-->
<!--    WhatIsTriggerWords-->
<!--  },-->

<!--  data() {-->
<!--    return {-->
<!--      loading: false,-->
<!--      COMMENT_JUST_DOWNLOAD,-->
<!--      showTooltip: false-->
<!--    };-->
<!--  },-->

<!--  computed: {-->
<!--    ...mapGetters({-->
<!--      dialogs: 'comments/dialogs',-->
<!--      settings: 'comments/settings',-->
<!--      profile: 'main/profile',-->
<!--    }),-->

<!--    isCommentJustDownloadMode() {-->
<!--      console.log('this.settings.mode === COMMENT_JUST_DOWNLOAD', this.settings.mode === COMMENT_JUST_DOWNLOAD);-->
<!--      console.log('this.settings.mode11', this.settings.mode);-->
<!--      return this.settings.mode === COMMENT_JUST_DOWNLOAD;-->
<!--    },-->

<!--    disableSaveButton() {-->
<!--      return !!((this.settings.global_setting && this.profile.role !== 'admin') || this.isCommentJustDownloadMode);-->
<!--    },-->

<!--    disableTriggerWordsInput() {-->
<!--      return this.isCommentJustDownloadMode;-->
<!--    }-->
<!--  },-->

<!--  methods: {-->
<!--    handleTriggerWordsIncludeChange(value) {-->
<!--      this.$store.dispatch('comments/setSettingsProperty', { key: 'triggerWordsInclude', value });-->
<!--    },-->

<!--    handleTriggerWordsInput(value) {-->
<!--      this.$store.dispatch('comments/setSettingsProperty', { key: 'triggerWords', value });-->
<!--    },-->

<!--    async save() {-->

<!--      try {-->
<!--        this.loading = true;-->

<!--        await this.api.put('/fb-comment-settings', {-->
<!--          triggerWords: this.settings.triggerWords.split("\n").filter((str) => str),-->
<!--          triggerWordsInclude: this.settings.triggerWordsInclude-->
<!--        });-->
<!--      } catch (error) {-->
<!--        // -->
<!--      } finally {-->
<!--        this.loading = false;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->







