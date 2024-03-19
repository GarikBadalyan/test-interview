<template>
  <!-- МОДАЛЬНОЕ ОКНО -->
  <v-dialog
      :value="dialogs.comments"
      fullscreen
      scrollable
      transition="dialog-bottom-transition"
      @keydown.esc="closeDialog"
  >
    <v-card :loading="loading.timeline">
      <!-- ХЕДЕР ДИАЛОГА -->
      <v-toolbar
          class="white--text"
          color="primary"
          flat
          style="max-height: 64px;"
      >
        <!-- КРЕСТИК -->
        <v-btn
            color="white"
            icon
            @click="closeDialog"
        >
          <v-icon>fas fa-times</v-icon>
        </v-btn>
        <!-- КРЕСТИК КОНЕЦ -->

        <!-- ЗАГОЛОВОК ДИАЛОГА -->
        <v-toolbar-title>
          <span>{{ $t('adsmanager.ads.adsComments') + ' ' + forAdComments.name }}</span>
        </v-toolbar-title>
        <!-- ЗАГОЛОВОК ДИАЛОГА КОНЕЦ -->
      </v-toolbar>
      <!-- ХЕДЕР ДИАЛОГА КОНЕЦ -->

      <!-- БОДИ ДИАЛОГА -->
      <v-card-text>
        <v-row>
          <!-- ТОПБАР -->
          <v-col
              cols="12"
              class="d-flex align-center"
          >
            <v-menu
                :close-on-content-click="false"
                offset-y
                min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-chip
                    v-bind="attrs"
                    v-on="on"
                >
                  {{ datesChip }}
                </v-chip>
              </template>
              <v-date-picker
                  v-model="dates"
                  range
                  color="primary"
                  @change="handleDateChange"
              />
            </v-menu>

            <div
                v-if="showLinks"
                class="ml-3"
            >
              <span>{{ $t('adsmanager.ads.linksToPost') + ':' }}</span>

              <!-- INSTAGRAM -->
              <v-btn
                  v-if="forAdComments.creative.instagram_permalink_url"
                  icon
                  small
                  class="ml-1"
                  @click="openLink(forAdComments.creative.instagram_permalink_url)"
              >
                <v-icon
                    icon
                    small
                    color="pink"
                >
                  fab fa-instagram
                </v-icon>
              </v-btn>
              <!-- INSTAGRAM КОНЕЦ -->

              <!-- FACEBOOK -->
              <v-btn
                  v-if="forAdComments.creative.effective_object_story_link"
                  icon
                  small
                  @click="openLink(forAdComments.creative.effective_object_story_link)"
              >
                <v-icon
                    small
                    color="primary"
                >
                  fab fa-facebook-f
                </v-icon>
              </v-btn>
              <!-- FACEBOOK КОНЕЦ -->
            </div>
          </v-col>
          <!-- ТОПБАР КОНЕЦ -->

          <v-col
              cols="12"
              md="8"
              offset-md="2"
              lg="6"
              offset-lg="3"
              xl="4"
              offset-xl="4"
              :class="{'text-center': loading.timeline}"
          >
            <!--ЛЕНТА -->
            <v-timeline
                ref="timelineRef"
                dense
                class="dolphin-custom-scrollbar"
                style="overflow-y: auto;"
                :style="{height: `${innerHeight - 48 - 56 - 64}px`}"
            >
              <template v-if="comments.length">
                <timeline-item
                    v-for="(comment, commentIndex) in comments"
                    :key="`AdsDialogComments-Comment-${commentIndex}-${comment}`"
                    :comment="comment"
                    :timeline-loading="loading.timeline"
                    @hideComment="hideComment"
                    @showComment="showComment"
                    @deleteComment="deleteComment"
                />
              </template>

              <v-timeline-item
                  v-else
                  hide-dot
              >
                {{ $t('adsmanager.ads.noComments') }}
              </v-timeline-item>
            </v-timeline>
            <!-- ЛЕНТА КОНЕЦ -->
          </v-col>
        </v-row>
      </v-card-text>
      <!-- БОДИ ДИАЛОГА КОНЕЦ -->
    </v-card>
  </v-dialog>
</template>

<script>
import moment         from 'moment';
import { mapGetters } from 'vuex';
import { COMMENT_ACTION_SHOW, COMMENT_ACTION_HIDE, COMMENT_ACTION_DELETE }
  from '@/constants/comments/comments_actions';
import TimelineItem   from './AdsDialogCommentsTimelineItem';

export default {
  name: 'AdsDialogComments',

  components: {
    TimelineItem
  },

  data() {
    return {
      dates: [
        moment().subtract(1, 'years').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      comments: [],
      loading: {
        timeline: false
      },
      meta: {
        currentPage: 0,
        isLastPage: false,
      }
    };
  },

  computed: {
    ...mapGetters({
      dialogs: 'ads/dialogs',
      forAdComments: 'ads/forAdComments',
      innerHeight: 'main/innerHeight',
    }),

    datesChip() {
      let { start, end } = this.getStartEndDates();

      return moment(start).format('LL') + ' - ' + moment(end).format('LL');
    },

    showLinks() {
      return this.forAdComments.creative &&
          this.forAdComments.creative.instagram_permalink_url ||
          this.forAdComments.creative.effective_object_story_link;
    }
  },

  created() {
    this.loadComments(1);

    const channel = this.echo.private('fb.comments');
    channel.listen('.delete.fb.comments', this.handleDeleteComments);
    channel.listen('.hide.fb.comments', this.handleHideComments);
  },

  destroyed() {
    const channel = this.echo.private('fb.comments');
    channel.stopListening('.delete.fb.comments');
    channel.stopListening('.hide.fb.comments');
    this.echo.leaveChannel('fb.comments');
  },

  mounted() {
    this.$refs.timelineRef.$el.addEventListener('scroll', this.scrollHandler);
  },

  beforeDestroy() {
    this.$refs.timelineRef.$el.removeEventListener('scroll', this.scrollHandler);
  },

  methods: {
    closeDialog() {
      this.$store.dispatch('ads/closeDialog', 'comments');
    },

    openLink(link) {
      window.open(link, '_blank');
    },

    getStartEndDates() {
      let [start, end] = this.dates;

      if (moment(start) > moment(end)) {
        [end, start] = this.dates;
      }

      return { start, end };
    },

    async scrollHandler(e) {
      if (this.meta.isLastPage) return;
      if (this.loading.timeline) return;

      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const scrollPosition = scrollTop / (scrollHeight - clientHeight);

      if (Math.round(scrollPosition * 100) > 95) {
        this.loadComments(this.meta.currentPage + 1);
      }
    },

    handleHideOrError(action, commentId) {
      this.handleItemLoading(commentId, action, true);

      const is_hidden = action === COMMENT_ACTION_HIDE ? 1 : 0;

      this.api.patch('/fb-comments', {
            is_hidden,
            ids: [commentId]
          })
          .catch(err => {
            this.handleItemLoading(commentId, action, false);
            this.$store.dispatch('main/apiError', err.message)
          })
    },

    hideComment(commentId) {
      this.handleHideOrError(COMMENT_ACTION_HIDE, commentId);
    },

    showComment(commentId) {
      this.handleHideOrError(COMMENT_ACTION_SHOW, commentId);
    },

    deleteComment(commentId) {
      this.handleItemLoading(commentId, COMMENT_ACTION_DELETE, true);

      this.api.delete('/fb-comments', {
            data: {
              ids: [commentId]
            },
          })
          .catch(err => {
            this.$store.dispatch('main/apiError', err.message);
            this.handleItemLoading(commentId, COMMENT_ACTION_DELETE, false);
          })
    },

    handleHideComments({ success, message }) {
      if (!success) {
        console.error(message);
      }

      this.loadComments(1);
    },

    handleDeleteComments({ success, message }) {
      if (!success) {
        console.error(message);
      }

      this.loadComments(1);
    },

    loadComments(page) {
      let { start, end } = this.getStartEndDates();
      this.loading.timeline = true;

      this.api('/fb-comments', {
            params: {
              page,
              perPage: 100,
              date_from: start,
              date_to: end,
              creativeIds: [this.forAdComments.creative.id]
            }
          })
          .finally(() => {
            this.loading.timeline = false;
          })
          .then(({ data }) => {
            this.meta = {
              currentPage: data.meta.current_page,
              isLastPage: data.meta.last_page >= data.meta.current_page,
            };

            if (Array.isArray(data.data)) {
              this.comments = data.data.map((comment) => ({
                ...comment,
                loading: {
                  show: false,
                  hide: false,
                  delete: false,
                }
              }));
            }
          });
    },

    handleItemLoading(id, action, value) {
      const comment = this.comments.find((comment) => comment.id === id);

      const key =  action.toLowerCase();

      if (comment) {
        comment.loading[key] = value;
      }
    },

    handleDateChange() {
      this.loadComments(1);
    },
  }
};
</script>
data: () => ({

}),