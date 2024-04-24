<!--<template>-->
<!--  <td class="pa-2 pl-0">-->
<!--    &lt;!&ndash; ВЫБЕРИТЕ ФП &ndash;&gt;-->
<!--    <v-autocomplete-->
<!--        :value="cabOption.fp"-->
<!--        :items="fpList"-->
<!--        :total-items="totalFp"-->
<!--        :item-disabled="fpDisabled"-->
<!--        item-text="name"-->
<!--        item-value="page_id"-->
<!--        :label="`${$t('upload.wizard.selectFp')}*`"-->
<!--        outlined-->
<!--        dense-->
<!--        hide-details-->
<!--        return-object-->
<!--        :loading="loading.fp"-->
<!--        :disabled="!selected"-->
<!--        :search-input.sync="search"-->
<!--        @change="changeCabOption($event, 'fp')"-->
<!--        @focus="handleFpFocus"-->
<!--        @paste="(event) => {handleFpPaste(event)}"-->
<!--    >-->
<!--      <template v-slot:append-item>-->
<!--        <div v-intersect="onIntersectFpList">-->
<!--          <div-->
<!--              v-if="loading.fp"-->
<!--              class="load-more-items"-->
<!--          >-->
<!--            {{ $t('common.loadingMoreItems') }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </template>-->
<!--      &lt;!&ndash; ШАБЛОН ЭЛЕМЕНТА СПИСКА &ndash;&gt;-->
<!--      <template #item="{item: page}">-->
<!--        {{ page.name }}-->

<!--        <v-icon-->
<!--            v-if="parseInt(page.advertising_restriction, 10) === 1"-->
<!--            color="error"-->
<!--            x-small-->
<!--            class="ml-auto"-->
<!--        >-->
<!--          fas fa-ban-->
<!--        </v-icon>-->
<!--      </template>-->

<!--      <template #append-outer>-->
<!--        <v-btn-->
<!--            icon-->
<!--            small-->
<!--            @click="copyToAnother('fpCopy', cabOption.fp)"-->
<!--        >-->
<!--          <v-icon>clear_all</v-icon>-->
<!--        </v-btn>-->
<!--      </template>-->
<!--    </v-autocomplete>-->
<!--    &lt;!&ndash; ВЫБЕРИТЕ ФП КОНЕЦ &ndash;&gt;-->

<!--    &lt;!&ndash; ВЫБЕРИТЕ ПИКСЕЛЬ &ndash;&gt;-->
<!--    <v-autocomplete-->
<!--        v-if="showPixel"-->
<!--        :value="cabOption.pixel"-->
<!--        :items="itemPixels"-->
<!--        :total-items="totalItems"-->
<!--        :item-text="item => item.name"-->
<!--        :item-value="item => item.id"-->
<!--        :label="pixelLabel"-->
<!--        outlined-->
<!--        dense-->
<!--        attach-->
<!--        hide-details-->
<!--        return-object-->
<!--        class="mt-2"-->
<!--        :disabled="!selected"-->
<!--        @change="changeCabOption($event, 'pixel')"-->
<!--        @focus="handleFocus"-->
<!--    >-->
<!--      <template v-slot:append-item>-->
<!--        <div v-intersect="onIntersect">-->
<!--          <div-->
<!--              v-if="isLoadingMoreItems"-->
<!--              class="load-more-items"-->
<!--          >-->
<!--            {{ $t('common.loadingMoreItems') }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </template>-->

<!--      <template v-slot:item="{ item: pixelItem }">-->
<!--        <div>-->
<!--          <div class="cab-option-pixel-name">-->
<!--            {{ pixelItem.name }}-->
<!--          </div>-->
<!--          <div class="cab-option-pixel-id">-->
<!--            ID: {{ pixelItem.id }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </template>-->

<!--      <template v-slot:append>-->
<!--        <div>-->
<!--          <v-btn-->
<!--              color="grey"-->
<!--              icon-->
<!--              small-->
<!--              @click="toggleOpen"-->
<!--          >-->
<!--            <v-icon-->
<!--                :size="8"-->
<!--                :class="{ 'fa-caret-down-icon': isOpen }"-->
<!--            >-->
<!--              fas fa-caret-down-->
<!--            </v-icon>-->
<!--          </v-btn>-->
<!--        </div>-->
<!--        <div v-if="cabOption.pixel">-->
<!--          <v-tooltip bottom>-->
<!--            <template-->
<!--                v-slot:activator="{ on }"-->
<!--            >-->
<!--              <v-btn-->
<!--                  color="grey"-->
<!--                  icon-->
<!--                  small-->
<!--                  v-on="on"-->
<!--                  @click="copyToClipboard(cabOption.pixel)"-->
<!--              >-->
<!--                <v-icon :size="14">-->
<!--                  fas fa-copy-->
<!--                </v-icon>-->
<!--              </v-btn>-->
<!--            </template>-->
<!--            <span>{{ $t('common.copyPixelId') }}</span>-->
<!--          </v-tooltip>-->
<!--        </div>-->
<!--      </template>-->
<!--    </v-autocomplete>-->
<!--    &lt;!&ndash; ВЫБЕРИТЕ ПИКСЕЛЬ КОНЕЦ &ndash;&gt;-->

<!--    &lt;!&ndash; ВЫБЕРИТЕ ПРИЛОЖЕНИЕ &ndash;&gt;-->
<!--    <v-autocomplete-->
<!--        v-if="objective === 'APP_INSTALLS'"-->
<!--        :value="cabOption.app"-->
<!--        :items="apps"-->
<!--        item-text="name"-->
<!--        item-value="id"-->
<!--        :label="`${$t('upload.wizard.selectApp')}*`"-->
<!--        outlined-->
<!--        dense-->
<!--        hide-details-->
<!--        class="mt-2"-->
<!--        :disabled="!selected"-->
<!--        @change="changeCabOption($event, 'app')"-->
<!--    >-->
<!--      <template #append-outer>-->
<!--        <v-btn-->
<!--            icon-->
<!--            small-->
<!--            @click="copyToAnother('appCopy', cabOption.app)"-->
<!--        >-->
<!--          <v-icon>clear_all</v-icon>-->
<!--        </v-btn>-->
<!--      </template>-->
<!--    </v-autocomplete>-->
<!--    &lt;!&ndash; ВЫБЕРИТЕ ПРИЛОЖЕНИЕ КОНЕЦ &ndash;&gt;-->
<!--  </td>-->
<!--</template>-->

<!--<script>-->
<!--import {CONVERSIONS, CONVERSIONS_LANDING_PAGE_VIEWS} from '@/constants/upload/consideration-types';-->
<!--import clipboard                                     from '@/mixins/clipboard';-->
<!--import { mapGetters }                                from 'vuex';-->

<!--export default {-->
<!--  name: 'UploadWizardMainStepperAdAccountsTableCellsFpPixelApp',-->

<!--  mixins: [clipboard],-->

<!--  props: {-->
<!--    item: {-->
<!--      type: Object,-->
<!--      required: true,-->
<!--    },-->
<!--  },-->

<!--  data() {-->
<!--    return {-->
<!--      CONVERSIONS,-->
<!--      CONVERSIONS_LANDING_PAGE_VIEWS,-->
<!--      fpList: [],-->
<!--      loading: {-->
<!--        fp: false-->
<!--      },-->
<!--      currentPage: 1,-->
<!--      currentPageForFp: 1,-->
<!--      perPage: 10,-->
<!--      itemPixels: [],-->
<!--      totalItems: 0,-->
<!--      totalFp: 0,-->
<!--      isLoadingMoreItems: false,-->
<!--      search: null,-->
<!--      timeout: null,-->
<!--      pastedFpValue: '',-->
<!--      isOpen: false,-->
<!--      isOpen2: false,-->
<!--      isChangeAccountId: false,-->
<!--    };-->
<!--  },-->

<!--  computed: {-->
<!--    ...mapGetters({-->
<!--      cabs: 'upload_wizard/cabs',-->
<!--      cabsOptions: 'upload_wizard/cabsOptions',-->
<!--      job: 'upload_wizard/job',-->
<!--      selectedBundle: 'upload_wizard/selectedBundle',-->
<!--    }),-->

<!--    selected() {-->
<!--      // console.log('this.cabsOptions', this.cabsOptions);-->
<!--      return this.cabs.selected.findIndex(i => i.id === this.item.id) > -1;-->
<!--    },-->

<!--    apps() {-->
<!--      return this.item.apps || [];-->
<!--    },-->

<!--    cabOption() {-->
<!--      return this.cabsOptions[this.item.id] || {};-->
<!--    },-->

<!--    objective() {-->
<!--      return this.job && this.job.objective;-->
<!--    },-->

<!--    showPixel() {-->
<!--      return (-->
<!--          this.objective === CONVERSIONS-->
<!--          || this.objective === 'LINK_CLICKS'-->
<!--          || this.objective === CONVERSIONS_LANDING_PAGE_VIEWS-->
<!--      ) ;-->
<!--    },-->

<!--    pixelLabel() {-->
<!--      if (this.itemPixels.length) {-->
<!--        return this.$t('upload.wizard.selectPixel') + '*';-->
<!--      }-->

<!--      return this.$t('common.noPixels');-->
<!--    },-->
<!--  },-->

<!--  watch: {-->
<!--    selected(newVal) {-->
<!--      if (newVal) {-->
<!--        this.isChangeAccountId = true;-->
<!--        this.isOpen2 = true;-->
<!--        console.log('selecteddddddddddddddddddddddddd');-->
<!--        this.selectFirstPixel();-->
<!--        this.selectFirstApp();-->
<!--        this.loadPages('');-->
<!--      }-->
<!--    },-->

<!--    'cabOption.accountId'(newVal) {-->
<!--      if (this.isChangeAccountId) return;-->
<!--      // if (!this.isChangeAccountId) {-->
<!--      this.isChangeAccountId = true;-->
<!--      // }-->
<!--      console.log('newVallllllllllllllllll', newVal);-->
<!--      this.selectFirstPixel();-->
<!--      this.selectFirstApp();-->
<!--      this.loadPages('');-->
<!--      this.isChangeAccountId = false;-->
<!--    },-->

<!--    'cabOption.fpCopy'(newVal) {-->
<!--      if (newVal && this.cabOption.pages.findIndex(i => i.page_id === newVal) > -1) {-->
<!--        this.$store.dispatch('upload_wizard/setCabOption', {-->
<!--          id: this.item.id,-->
<!--          key: 'fp',-->
<!--          value: newVal-->
<!--        });-->
<!--        this.changeCabOption('', 'fpCopy');-->
<!--      }-->
<!--    },-->

<!--    'cabOption.appCopy'(newVal) {-->
<!--      if (newVal && this.apps.findIndex(i => i.id === newVal) > -1) {-->
<!--        this.changeCabOption(newVal, 'app');-->
<!--        this.changeCabOption('', 'appCopy');-->
<!--      }-->
<!--    },-->

<!--    search (q) {-->
<!--      const selectedFp = this.fpList.find(el => el.page_id === this.cabOption.fp);-->

<!--      if (q === null || (selectedFp && selectedFp.name && q === selectedFp.name)) return;-->

<!--      if (this.timeout !== null) {-->
<!--        clearTimeout(this.timeout);-->
<!--      }-->

<!--      this.timeout = setTimeout(() => {-->
<!--        this.loadPages(q);-->
<!--      }, 500);-->
<!--    },-->

<!--    pastedFpValue(val) {-->
<!--      if (val) {-->
<!--        const selectedFp = this.cabOption.pages.find(el => el.page_id === this.cabOption.fp);-->

<!--        if (val === selectedFp.name) return;-->

<!--        if (this.timeout !== null) {-->
<!--          clearTimeout(this.timeout);-->
<!--        }-->

<!--        this.timeout = setTimeout(() => {-->
<!--          this.loadPages(val);-->
<!--        }, 500);-->
<!--      }-->
<!--    }-->
<!--  },-->

<!--  created() {-->
<!--    const selectedFp = this.cabOption.fp || this.item.fp;-->

<!--    if (selectedFp) {-->
<!--      this.fpList = this.cabOption.pages || this.item.pages;-->
<!--    }-->

<!--    if (this.selected && !this.cabOption.pages.length) {-->
<!--      this.loadPages('');-->
<!--      this.selectFirstPixel();-->
<!--      this.selectFirstApp();-->
<!--    }-->

<!--    const selectedPixel = this.cabOption.selectedPixel || this.item.mainPixel;-->

<!--    if (selectedPixel) {-->
<!--      this.itemPixels = [selectedPixel];-->
<!--      this.totalItems = this.itemPixels.length;-->
<!--    }-->
<!--  },-->

<!--  methods: {-->
<!--    fpDisabled(item) {-->
<!--      const {is_published, advertising_restriction: adRestriction} = item;-->

<!--      return parseInt(is_published, 10) === 0 ||-->
<!--          parseInt(adRestriction, 10) === 1;-->
<!--    },-->

<!--    changeCabOption(value, key) {-->
<!--      if (key === 'pixel') {-->
<!--        this.$store.dispatch('upload_wizard/setCabOption', {-->
<!--          id: this.item.id,-->
<!--          key,-->
<!--          value: value.id-->
<!--        });-->

<!--        this.$store.dispatch('upload_wizard/setCabOption', {-->
<!--          id: this.item.id,-->
<!--          key: 'selectedPixel',-->
<!--          value: value-->
<!--        });-->

<!--      } else if (key === 'fp') {-->
<!--        this.$store.dispatch('upload_wizard/setCabOption', {-->
<!--          id: this.item.id,-->
<!--          key,-->
<!--          value: value.page_id-->
<!--        });-->
<!--      } else {-->
<!--        this.$store.dispatch('upload_wizard/setCabOption', {-->
<!--          id: this.item.id,-->
<!--          key,-->
<!--          value-->
<!--        });-->
<!--      }-->
<!--    },-->

<!--    handleFocus() {-->
<!--      this.isLoadingMoreItems = false;-->
<!--      this.currentPage = 0;-->
<!--      this.itemPixels = [];-->
<!--      this.totalItems = 0;-->
<!--    },-->

<!--    handleFpFocus() {-->
<!--      const selectedFp = this.fpList.find(el => el.page_id === this.cabOption.fp);-->

<!--      if (this.search === null || (selectedFp && selectedFp.name && this.search === selectedFp.name)) return;-->

<!--      if (this.search && this.search !== this.cabOption.fp) {-->
<!--        this.currentPageForFp = 1;-->
<!--        this.totalFp = 0;-->
<!--        this.loadPages();-->
<!--      }-->
<!--    },-->

<!--    getPixels(item) {-->
<!--      this.api.get(`/fb-cabs/pixels?ad_account_id=${item.id}&current_page=${this.currentPage}&per_page=${this.perPage}`)-->
<!--          .then((res) => {-->
<!--            if (res.status === 200 && res.data && res.data.data) {-->
<!--              const { data } = res.data;-->
<!--              const { meta } = res.data;-->

<!--              this.totalItems = meta.total;-->
<!--              this.itemPixels = [...this.itemPixels, ...data];-->
<!--            }-->
<!--          })-->
<!--          .finally(() => {-->
<!--            this.isLoadingMoreItems = false;-->
<!--          });-->
<!--    },-->

<!--    async onIntersect() {-->
<!--      if (this.isLoadingMoreItems) return;-->

<!--      if (this.itemPixels.length - 1 < this.totalItems) {-->
<!--        this.isLoadingMoreItems = true;-->
<!--        this.currentPage += 1;-->
<!--        await this.getPixels(this.item);-->
<!--      }-->
<!--    },-->

<!--    async onIntersectFpList() {-->
<!--      if (this.loading.fp) return;-->

<!--      if (!this.totalFp || this.fpList.length < this.totalFp) {-->
<!--        this.currentPageForFp = this.totalFp ? this.currentPageForFp + 1 : 1;-->
<!--        console.log('aaaaaaaaaaaaaaaaaa');-->
<!--        await this.loadPages('');-->
<!--      }-->
<!--    },-->

<!--    loadPages(q) {-->
<!--      console.log('loadPages');-->
<!--      console.log('this.isOpen1', this.isChangeAccountId);-->
<!--      console.log('this.totalFp', this.totalFp);-->
<!--      console.log('this.fpList.length', this.fpList.length);-->
<!--      // if (this.fpList.length && this.fpList.length === this.totalFp) {-->
<!--      //   console.log('VVVVVV!!!');-->
<!--      //   this.isChangeAccountId = false;-->
<!--      // }-->
<!--      if ((this.fpList.length && this.fpList.length === this.totalFp) && !this.isChangeAccountId ||-->
<!--          (this.fpList.length && this.fpList.length === this.totalFp) && this.isOpen2-->
<!--      ) return;-->
<!--      // if (this.fpList.length && this.fpList.length === this.totalFp) return;-->
<!--      if (this.cabOption.accountId) {-->
<!--        this.loading.fp = true;-->
<!--        const accountId = this.cabOption.accountId;-->
<!--        let url = `/fb-pages?accountIds[]=${accountId}&page=${this.currentPageForFp}&per_page=${this.perPage}`;-->

<!--        if(q) {-->
<!--          url = `/fb-pages?accountIds[]=${accountId}&q=${q}`;-->
<!--        }-->

<!--        this.api.get(url)-->
<!--            .then((res) => {-->
<!--              if (res.status === 200 && res.data && res.data.data) {-->
<!--                const { data } = res;-->
<!--                const { meta } = data;-->

<!--                if (this.totalFp !== meta.total) {-->
<!--                  this.totalFp = meta.total;-->
<!--                }-->

<!--                const newFpList = [];-->

<!--                data.data.forEach(fp => {-->
<!--                  if (!this.fpList.length || !this.fpList.find(el => el.page_id === fp.page_id)) {-->
<!--                    newFpList.push(fp);-->
<!--                  }-->
<!--                });-->

<!--                this.fpList = [...this.fpList, ...newFpList];-->
<!--                this.$store.dispatch('upload_wizard/setCabOptionPages', {-->
<!--                  id: this.item.id,-->
<!--                  key: 'pages',-->
<!--                  value: JSON.parse(JSON.stringify(newFpList))-->
<!--                });-->

<!--                if (!this.cabOption.fp) {-->
<!--                  this.selectFirstAvailableFp();-->
<!--                }-->
<!--              }-->
<!--            })-->
<!--            .finally(() => {-->
<!--              this.loading.fp = false;-->
<!--            });-->
<!--      }-->
<!--    },-->

<!--    selectFirstPixel() {-->
<!--      const selectedPixel = this.cabOption.selectedPixel ? this.cabOption.selectedPixel : this.item.mainPixel;-->

<!--      if (selectedPixel) {-->
<!--        this.changeCabOption({...selectedPixel}, 'pixel');-->
<!--      }-->
<!--    },-->

<!--    selectFirstAvailableFp() {-->
<!--      for (const fp of this.fpList) {-->
<!--        if (!this.fpDisabled(fp)) {-->
<!--          this.changeCabOption(fp, 'fp');-->
<!--          break;-->
<!--        }-->
<!--      }-->
<!--    },-->

<!--    selectFirstApp() {-->
<!--      if (Array.isArray(this.apps) && this.apps.length) {-->
<!--        this.changeCabOption(this.apps[0].id, 'app');-->
<!--      }-->
<!--    },-->

<!--    copyToAnother(key, value) {-->
<!--      this.$store.dispatch('upload_wizard/copyToOtherCabs', {-->
<!--        id: this.item.id,-->
<!--        key,-->
<!--        value,-->
<!--      });-->
<!--    },-->

<!--    handleFpPaste(e) {-->
<!--      this.pastedFpValue = (e.clipboardData || window.clipboardData).getData('text');-->
<!--    },-->

<!--    toggleOpen() {-->
<!--      this.isOpen = !this.isOpen;-->
<!--    },-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style>-->
<!--.load-more-items {-->
<!--  padding: 5px 5px 5px 10px;-->
<!--  color: #2196F3;-->
<!--}-->

<!--.fa-caret-down-icon {-->
<!--  transform: rotate(180deg);-->
<!--}-->

<!--.cab-option-pixel-name {-->
<!--  font-size: 13px;-->
<!--  font-weight: 500;-->
<!--  line-height: 16px;-->
<!--}-->

<!--.cab-option-pixel-id {-->
<!--  font-size: 11px;-->
<!--  font-weight: 500;-->
<!--  line-height: 16px;-->
<!--}-->
<!--</style>-->



/////////////////////////////
<template>
  <td class="pa-2 pl-0">
    <!-- ВЫБЕРИТЕ ФП -->
    <v-autocomplete
        :value="cabOption.fp"
        :items="fpList"
        :total-items="totalFp"
        :item-disabled="fpDisabled"
        item-text="name"
        item-value="page_id"
        :label="`${$t('upload.wizard.selectFp')}*`"
        outlined
        dense
        hide-details
        return-object
        :loading="loading.fp"
        :disabled="!selected"
        :search-input.sync="search"
        @change="changeCabOption($event, 'fp')"
        @focus="handleFpFocus"
        @paste="(event) => {handleFpPaste(event)}"
    >
      <template v-slot:append-item>
        <div v-intersect="onIntersectFpList">
          <div
              v-if="loading.fp"
              class="load-more-items"
          >
            {{ $t('common.loadingMoreItems') }}
          </div>
        </div>
      </template>
      <!-- ШАБЛОН ЭЛЕМЕНТА СПИСКА -->
      <template #item="{item: page}">
        {{ page.name }}

        <v-icon
            v-if="parseInt(page.advertising_restriction, 10) === 1"
            color="error"
            x-small
            class="ml-auto"
        >
          fas fa-ban
        </v-icon>
      </template>

      <template #append-outer>
        <v-btn
            icon
            small
            @click="copyToAnother('fpCopy', cabOption.fp)"
        >
          <v-icon>clear_all</v-icon>
        </v-btn>
      </template>
    </v-autocomplete>
    <!-- ВЫБЕРИТЕ ФП КОНЕЦ -->

    <!-- ВЫБЕРИТЕ ПИКСЕЛЬ -->
    <v-autocomplete
        v-if="showPixel"
        :value="cabOption.pixel"
        :items="itemPixels"
        :total-items="totalItems"
        :item-text="item => item.name"
        :item-value="item => item.id"
        :label="pixelLabel"
        outlined
        dense
        attach
        hide-details
        return-object
        class="mt-2"
        :disabled="!selected"
        @change="changeCabOption($event, 'pixel')"
        @focus="handleFocus"
    >
      <template v-slot:append-item>
        <div v-intersect="onIntersect">
          <div
              v-if="isLoadingMoreItems"
              class="load-more-items"
          >
            {{ $t('common.loadingMoreItems') }}
          </div>
        </div>
      </template>

      <template v-slot:item="{ item: pixelItem }">
        <div>
          <div class="cab-option-pixel-name">
            {{ pixelItem.name }}
          </div>
          <div class="cab-option-pixel-id">
            ID: {{ pixelItem.id }}
          </div>
        </div>
      </template>

      <template v-slot:append>
        <div>
          <v-btn
              color="grey"
              icon
              small
              @click="toggleOpen"
          >
            <v-icon
                :size="8"
                :class="{ 'fa-caret-down-icon': isOpen }"
            >
              fas fa-caret-down
            </v-icon>
          </v-btn>
        </div>
        <div v-if="cabOption.pixel">
          <v-tooltip bottom>
            <template
                v-slot:activator="{ on }"
            >
              <v-btn
                  color="grey"
                  icon
                  small
                  v-on="on"
                  @click="copyToClipboard(cabOption.pixel)"
              >
                <v-icon :size="14">
                  fas fa-copy
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('common.copyPixelId') }}</span>
          </v-tooltip>
        </div>
      </template>
    </v-autocomplete>
    <!-- ВЫБЕРИТЕ ПИКСЕЛЬ КОНЕЦ -->

    <!-- ВЫБЕРИТЕ ПРИЛОЖЕНИЕ -->
    <v-autocomplete
        v-if="objective === 'APP_INSTALLS'"
        :value="cabOption.app"
        :items="apps"
        item-text="name"
        item-value="id"
        :label="`${$t('upload.wizard.selectApp')}*`"
        outlined
        dense
        hide-details
        class="mt-2"
        :disabled="!selected"
        @change="changeCabOption($event, 'app')"
    >
      <template #append-outer>
        <v-btn
            icon
            small
            @click="copyToAnother('appCopy', cabOption.app)"
        >
          <v-icon>clear_all</v-icon>
        </v-btn>
      </template>
    </v-autocomplete>
    <!-- ВЫБЕРИТЕ ПРИЛОЖЕНИЕ КОНЕЦ -->
  </td>
</template>

<script>
import {CONVERSIONS, CONVERSIONS_LANDING_PAGE_VIEWS} from '@/constants/upload/consideration-types';
import clipboard                                     from '@/mixins/clipboard';
import { mapGetters }                                from 'vuex';

export default {
  name: 'UploadWizardMainStepperAdAccountsTableCellsFpPixelApp',

  mixins: [clipboard],

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      CONVERSIONS,
      CONVERSIONS_LANDING_PAGE_VIEWS,
      fpList: [],
      loading: {
        fp: false
      },
      currentPage: 1,
      currentPageForFp: 1,
      perPage: 10,
      itemPixels: [],
      totalItems: 0,
      totalFp: 0,
      isLoadingMoreItems: false,
      search: null,
      timeout: null,
      pastedFpValue: '',
      isOpen: false,
      isChangeAdAccountId: false,
      isChangeAccountId: false,
    };
  },

  computed: {
    ...mapGetters({
      cabs: 'upload_wizard/cabs',
      cabsOptions: 'upload_wizard/cabsOptions',
      job: 'upload_wizard/job',
      selectedBundle: 'upload_wizard/selectedBundle',
    }),

    selected() {
      return this.cabs.selected.findIndex(i => i.id === this.item.id) > -1;
    },

    apps() {
      return this.item.apps || [];
    },

    cabOption() {
      return this.cabsOptions[this.item.id] || {};
    },

    objective() {
      return this.job && this.job.objective;
    },

    showPixel() {
      return (
          this.objective === CONVERSIONS
          || this.objective === 'LINK_CLICKS'
          || this.objective === CONVERSIONS_LANDING_PAGE_VIEWS
      ) ;
    },

    pixelLabel() {
      if (this.itemPixels.length) {
        return this.$t('upload.wizard.selectPixel') + '*';
      }

      return this.$t('common.noPixels');
    },
  },

  watch: {
    selected(newVal) {
      if (newVal) {
        this.isChangeAccountId = true;
        this.isChangeAdAccountId = true;
        console.log('selectedd');
        this.selectFirstPixel();
        this.selectFirstApp();
        this.loadPages('');
      }
    },

    'cabOption.accountId'(newVal) {
      if (this.isChangeAccountId) return;
      this.isChangeAccountId = true;
      console.log('newValllll', newVal);
      if (newVal) {
        this.selectFirstPixel();
        this.selectFirstApp();
        this.loadPages('');
        this.isChangeAccountId = false;
      }
    },

    'cabOption.fpCopy'(newVal) {
      if (newVal && this.cabOption.pages.findIndex(i => i.page_id === newVal) > -1) {
        this.$store.dispatch('upload_wizard/setCabOption', {
          id: this.item.id,
          key: 'fp',
          value: newVal
        });
        this.changeCabOption('', 'fpCopy');
      }
    },

    'cabOption.appCopy'(newVal) {
      if (newVal && this.apps.findIndex(i => i.id === newVal) > -1) {
        this.changeCabOption(newVal, 'app');
        this.changeCabOption('', 'appCopy');
      }
    },

    search (q) {
      const selectedFp = this.fpList.find(el => el.page_id === this.cabOption.fp);

      if (q === null || (selectedFp && selectedFp.name && q === selectedFp.name)) return;

      if (this.timeout !== null) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.loadPages(q);
      }, 500);
    },

    pastedFpValue(val) {
      if (val) {
        const selectedFp = this.cabOption.pages.find(el => el.page_id === this.cabOption.fp);

        if (val === selectedFp.name) return;

        if (this.timeout !== null) {
          clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
          this.loadPages(val);
        }, 500);
      }
    }
  },

  created() {
    const selectedFp = this.cabOption.fp || this.item.fp;

    if (selectedFp) {
      this.fpList = this.cabOption.pages || this.item.pages;
    }

    if (this.selected && !this.cabOption.pages.length) {
      this.loadPages('');
      this.selectFirstPixel();
      this.selectFirstApp();
    }

    const selectedPixel = this.cabOption.selectedPixel || this.item.mainPixel;

    if (selectedPixel) {
      this.itemPixels = [selectedPixel];
      this.totalItems = this.itemPixels.length;
    }
  },

  methods: {
    fpDisabled(item) {
      const {is_published, advertising_restriction: adRestriction} = item;

      return parseInt(is_published, 10) === 0 ||
          parseInt(adRestriction, 10) === 1;
    },

    changeCabOption(value, key) {
      if (key === 'pixel') {
        this.$store.dispatch('upload_wizard/setCabOption', {
          id: this.item.id,
          key,
          value: value.id
        });

        this.$store.dispatch('upload_wizard/setCabOption', {
          id: this.item.id,
          key: 'selectedPixel',
          value: value
        });

      } else if (key === 'fp') {
        this.$store.dispatch('upload_wizard/setCabOption', {
          id: this.item.id,
          key,
          value: value.page_id
        });
      } else {
        this.$store.dispatch('upload_wizard/setCabOption', {
          id: this.item.id,
          key,
          value
        });
      }
    },

    handleFocus() {
      this.isLoadingMoreItems = false;
      this.currentPage = 0;
      this.itemPixels = [];
      this.totalItems = 0;
    },

    handleFpFocus() {
      const selectedFp = this.fpList.find(el => el.page_id === this.cabOption.fp);

      if (this.search === null || (selectedFp && selectedFp.name && this.search === selectedFp.name)) return;

      if (this.search && this.search !== this.cabOption.fp) {
        this.currentPageForFp = 1;
        this.totalFp = 0;
        this.loadPages();
      }
    },

    getPixels(item) {
      this.api.get(`/fb-cabs/pixels?ad_account_id=${item.id}&current_page=${this.currentPage}&per_page=${this.perPage}`)
          .then((res) => {
            if (res.status === 200 && res.data && res.data.data) {
              const { data } = res.data;
              const { meta } = res.data;

              this.totalItems = meta.total;
              this.itemPixels = [...this.itemPixels, ...data];
            }
          })
          .finally(() => {
            this.isLoadingMoreItems = false;
          });
    },

    async onIntersect() {
      if (this.isLoadingMoreItems) return;

      if (this.itemPixels.length - 1 < this.totalItems) {
        this.isLoadingMoreItems = true;
        this.currentPage += 1;
        await this.getPixels(this.item);
      }
    },

    async onIntersectFpList() {
      if (this.loading.fp) return;

      if (!this.totalFp || this.fpList.length < this.totalFp) {
        this.currentPageForFp = this.totalFp ? this.currentPageForFp + 1 : 1;
        console.log('aaaaaaaaaaaaaaaaaa');
        await this.loadPages('');
      }
    },

    loadPages(q) {
      console.log('this.totalFp', this.totalFp);
      console.log('this.fpList.length', this.fpList.length);
      const isFpListComplete = this.fpList.length === this.totalFp;
      if ((this.fpList.length && isFpListComplete) && !this.isChangeAccountId ||
          (this.fpList.length && isFpListComplete) && this.isChangeAdAccountId
      ) {
        return;
      }

      if (this.cabOption.accountId) {
        this.loading.fp = true;
        const accountId = this.cabOption.accountId;
        let url = `/fb-pages?accountIds[]=${accountId}&page=${this.currentPageForFp}&per_page=${this.perPage}`;

        if(q) {
          url = `/fb-pages?accountIds[]=${accountId}&q=${q}`;
        }

        this.api.get(url)
            .then((res) => {
              if (res.status === 200 && res.data && res.data.data) {
                const { data } = res;
                const { meta } = data;

                if (this.totalFp !== meta.total) {
                  this.totalFp = meta.total;
                }

                const newFpList = [];

                data.data.forEach(fp => {
                  if (!this.fpList.length || !this.fpList.find(el => el.page_id === fp.page_id)) {
                    newFpList.push(fp);
                  }
                });

                this.fpList = [...this.fpList, ...newFpList];
                this.$store.dispatch('upload_wizard/setCabOptionPages', {
                  id: this.item.id,
                  key: 'pages',
                  value: JSON.parse(JSON.stringify(newFpList))
                });

                if (!this.cabOption.fp) {
                  this.selectFirstAvailableFp();
                }
              }
            })
            .finally(() => {
              this.loading.fp = false;
            });
      }
    },

    selectFirstPixel() {
      const selectedPixel = this.cabOption.selectedPixel ? this.cabOption.selectedPixel : this.item.mainPixel;

      if (selectedPixel) {
        this.changeCabOption({...selectedPixel}, 'pixel');
      }
    },

    selectFirstAvailableFp() {
      for (const fp of this.fpList) {
        if (!this.fpDisabled(fp)) {
          this.changeCabOption(fp, 'fp');
          break;
        }
      }
    },

    selectFirstApp() {
      if (Array.isArray(this.apps) && this.apps.length) {
        this.changeCabOption(this.apps[0].id, 'app');
      }
    },

    copyToAnother(key, value) {
      this.$store.dispatch('upload_wizard/copyToOtherCabs', {
        id: this.item.id,
        key,
        value,
      });
    },

    handleFpPaste(e) {
      this.pastedFpValue = (e.clipboardData || window.clipboardData).getData('text');
    },

    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
  }
};
</script>

<style>
.load-more-items {
  padding: 5px 5px 5px 10px;
  color: #2196F3;
}

.fa-caret-down-icon {
  transform: rotate(180deg);
}

.cab-option-pixel-name {
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
}

.cab-option-pixel-id {
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
}
</style>