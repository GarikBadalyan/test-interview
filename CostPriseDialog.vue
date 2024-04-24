<!--<script setup>-->
<!--import {formatNumber} from '@/helpers/priceHelper.js';-->
<!--import {computed} from 'vue';-->

<!--const props = defineProps({-->
<!--  show: Boolean,-->
<!--  params: Object-->
<!--});-->
<!--console.log('props.params', props.params.data)-->
<!--const financialAttributes = ['Закуп', 'Издержки', 'Расходники', 'доп.Расходы'];-->

<!--const currency = computed(() => {-->
<!--  return props.params.data.currency || 'RUB';-->
<!--});-->

<!--const value = computed(() => {-->
<!--  return props.params.data.costs.costs || 0;-->
<!--});-->

<!--const purchase = computed(() => {-->
<!--  return props.params.data.costs.purchase || 0;-->
<!--});-->

<!--const consumables = computed(() => {-->
<!--  return props.params.data.costs.consumables || 0;-->
<!--});-->

<!--const addExpenses = computed(() => {-->
<!--  return props.params.data.costs.additional_expenses || 0;-->
<!--});-->

<!--const totalCosts = computed(() => {-->
<!--  return props.params.data.costs.total_cost || 0;-->
<!--});-->
<!--const percent = computed(() => props.params.valueFormatted);-->
<!--const emits = defineEmits(['close']);-->
<!--function closeDialog() {-->
<!--  emits('close');-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <v-dialog-->
<!--      :model-value="show"-->
<!--      width="100%"-->
<!--      max-width="500"-->
<!--      @click:outside="closeDialog"-->
<!--  >-->
<!--    <v-card class="attribute-dialog">-->
<!--      <v-card-title-->
<!--          class="d-flex justify-end flex-fill dialog-close-wrapper"-->
<!--      >-->
<!--        <v-btn-->
<!--            height="24px"-->
<!--            width="24px"-->
<!--            icon-->
<!--            color="lightGrey"-->
<!--            variant="text"-->
<!--            @click="closeDialog"-->
<!--        >-->
<!--          <v-icon size="24px">mdi-close</v-icon>-->
<!--        </v-btn>-->
<!--      </v-card-title>-->

<!--      <v-card-text class="text-count-info-dialog__text">-->
<!--        <div class="text-count-info-dialog__text-wrap">-->
<!--          &lt;!&ndash;          <div v-for="(attribute, index) in financialAttributes"&ndash;&gt;-->
<!--          &lt;!&ndash;            :key="index"&ndash;&gt;-->
<!--          &lt;!&ndash;            class="financial-attribute-row"&ndash;&gt;-->
<!--          &lt;!&ndash;          >&ndash;&gt;-->
<!--          &lt;!&ndash;            <div class="attribute-dialog_attribute">&ndash;&gt;-->
<!--          &lt;!&ndash;              {{ attribute }}&ndash;&gt;-->
<!--          &lt;!&ndash;            </div>&ndash;&gt;-->
<!--          &lt;!&ndash;            <div>{{formatNumber(value)}} {{ currency}}</div>&ndash;&gt;-->
<!--          &lt;!&ndash;          </div>&ndash;&gt;-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              Закуп-->
<!--            </div>-->
<!--            <div>{{formatNumber(purchase)}} {{ currency}}</div>-->
<!--          </div>-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              Издержки-->
<!--            </div>-->
<!--            <div>{{formatNumber(value)}} {{ currency}}</div>-->
<!--          </div>-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              Расходники-->
<!--            </div>-->
<!--            <div>{{formatNumber(consumables)}} {{ currency}}</div>-->
<!--          </div>-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              доп.Расходы-->
<!--            </div>-->
<!--            <div>{{formatNumber(addExpenses)}} {{ currency}}</div>-->
<!--          </div>-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              Итого-->
<!--            </div>-->
<!--            <div>{{formatNumber(totalCosts)}} {{ currency}}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </v-card-text>-->
<!--    </v-card>-->
<!--  </v-dialog>-->
<!--</template>-->

<!--<style scoped>-->
<!--.attribute-dialog {-->
<!--  padding: 32px 40px 32px 32px;-->
<!--}-->

<!--.dialog-close-wrapper {-->
<!--  position: absolute;-->
<!--  top: 10px;-->
<!--  right: 13px;-->
<!--  z-index: 2;-->
<!--}-->
<!--.text-count-info-dialog__text {-->
<!--  margin-top: 8px;-->
<!--  padding: 0!important;-->
<!--  font-style: normal;-->
<!--  font-weight: 500;-->
<!--  line-height: 17px;-->
<!--  color: #545465;-->
<!--  font-family: 'Nunito';-->
<!--  font-size: 15px;-->
<!--}-->
<!--.text-count-info-dialog__text-wrap {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--}-->

<!--.financial-attribute-row {-->
<!--  display: flex;-->
<!--  border-bottom: 1px solid #F2F4F9;-->
<!--}-->

<!--.financial-attribute-row > div {-->
<!--  flex: 1;-->
<!--  display: flex;-->
<!--  align-items: flex-end;-->
<!--  font-family: Nunito;-->
<!--  font-size: 13px;-->
<!--  font-style: normal;-->
<!--  font-weight: 500;-->
<!--  line-height: 16px;-->
<!--  min-height: 24px;-->
<!--  color: #545465;-->
<!--}-->

<!--.attribute-dialog_attribute {-->
<!--  color: #94A3B8!important;-->
<!--}-->
<!--</style>-->




<!--<script setup>-->
<!--import {formatNumber} from '@/helpers/priceHelper.js';-->
<!--import {computed} from 'vue';-->

<!--const props = defineProps({-->
<!--  show: Boolean,-->
<!--  params: Object-->
<!--});-->
<!--console.log('props.params', props.params.data)-->
<!--const financialAttributes = ['Закуп', 'Издержки', 'Расходники', 'доп.Расходы'];-->

<!--const currency = computed(() => {-->
<!--  return props.params.data.currency || 'RUB';-->
<!--});-->

<!--const costs = computed(() => {-->
<!--  return props.params.data.costs.costs || 0;-->
<!--});-->

<!--const purchases = computed(() => {-->
<!--  return props.params.data.costs.purchase || 0;-->
<!--});-->

<!--const consumables = computed(() => {-->
<!--  return props.params.data.costs.consumables || 0;-->
<!--});-->

<!--const addExpenses = computed(() => {-->
<!--  return props.params.data.costs.additional_expenses || 0;-->
<!--});-->

<!--const totalCosts = computed(() => {-->
<!--  return props.params.data.costs.total_cost || 0;-->
<!--});-->
<!--const percent = computed(() => props.params.valueFormatted);-->
<!--const emits = defineEmits(['close']);-->
<!--function closeDialog() {-->
<!--  emits('close');-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <v-dialog-->
<!--      :model-value="show"-->
<!--      width="100%"-->
<!--      max-width="500"-->
<!--      @click:outside="closeDialog"-->
<!--  >-->
<!--    <v-card class="attribute-dialog">-->
<!--      <v-card-title-->
<!--          class="d-flex justify-end flex-fill dialog-close-wrapper"-->
<!--      >-->
<!--        <v-btn-->
<!--            height="24px"-->
<!--            width="24px"-->
<!--            icon-->
<!--            color="lightGrey"-->
<!--            variant="text"-->
<!--            @click="closeDialog"-->
<!--        >-->
<!--          <v-icon size="24px">mdi-close</v-icon>-->
<!--        </v-btn>-->
<!--      </v-card-title>-->

<!--      <v-card-text class="text-count-info-dialog__text">-->
<!--        <div class="text-count-info-dialog__text-wrap">-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              Закуп-->
<!--            </div>-->
<!--            <div>{{formatNumber(purchases)}} {{ currency}}</div>-->
<!--          </div>-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              Издержки-->
<!--            </div>-->
<!--            <div>{{formatNumber(costs)}} {{ currency}}</div>-->
<!--          </div>-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              Расходники-->
<!--            </div>-->
<!--            <div>{{formatNumber(consumables)}} {{ currency}}</div>-->
<!--          </div>-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              доп.Расходы-->
<!--            </div>-->
<!--            <div>{{formatNumber(addExpenses)}} {{ currency}}</div>-->
<!--          </div>-->
<!--          <div class="financial-attribute-row">-->
<!--            <div class="attribute-dialog_attribute">-->
<!--              Итого-->
<!--            </div>-->
<!--            <div>{{formatNumber(totalCosts)}} {{ currency}}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </v-card-text>-->
<!--    </v-card>-->
<!--  </v-dialog>-->
<!--</template>-->

<!--<style scoped>-->
<!--.attribute-dialog {-->
<!--  padding: 32px 40px 32px 32px;-->
<!--}-->

<!--.dialog-close-wrapper {-->
<!--  position: absolute;-->
<!--  top: 10px;-->
<!--  right: 13px;-->
<!--  z-index: 2;-->
<!--}-->
<!--.text-count-info-dialog__text {-->
<!--  margin-top: 8px;-->
<!--  padding: 0!important;-->
<!--  font-style: normal;-->
<!--  font-weight: 500;-->
<!--  line-height: 17px;-->
<!--  color: #545465;-->
<!--  font-family: 'Nunito';-->
<!--  font-size: 15px;-->
<!--}-->
<!--.text-count-info-dialog__text-wrap {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--}-->

<!--.financial-attribute-row {-->
<!--  display: flex;-->
<!--  border-bottom: 1px solid #F2F4F9;-->
<!--}-->

<!--.financial-attribute-row > div {-->
<!--  flex: 1;-->
<!--  display: flex;-->
<!--  align-items: flex-end;-->
<!--  font-family: Nunito;-->
<!--  font-size: 13px;-->
<!--  font-style: normal;-->
<!--  font-weight: 500;-->
<!--  line-height: 16px;-->
<!--  min-height: 24px;-->
<!--  color: #545465;-->
<!--}-->

<!--.attribute-dialog_attribute {-->
<!--  color: #94A3B8!important;-->
<!--}-->
<!--</style>-->



<!--<script setup>-->
<!--import { formatNumber } from '@/helpers/priceHelper.js';-->
<!--import { computed, defineProps, defineEmits } from 'vue';-->

<!--const props = defineProps({-->
<!--  show: Boolean,-->
<!--  params: Object-->
<!--});-->

<!--const { data } = props.params;-->
<!--const currency = computed(() => data.currency || 'RUB');-->
<!--const costsData = data.costs || {};-->
<!--const financialAttributes = {-->
<!--  'Закуп': 'purchase',-->
<!--  'Издержки': 'costs',-->
<!--  'Расходники': 'consumables',-->
<!--  'доп.Расходы': 'additional_expenses',-->
<!--  'Итого': 'total_cost',-->
<!--};-->

<!--const costs = Object.keys(financialAttributes).map(attr => ({-->
<!--  label: attr,-->
<!--  value: computed(() => parseFloat(formatNumber(costsData[financialAttributes[attr]] || 0)))-->
<!--}));-->

<!--const emits = defineEmits(['close']);-->
<!--function closeDialog() {-->
<!--  emits('close');-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <v-dialog-->
<!--      :model-value="show"-->
<!--      width="100%"-->
<!--      max-width="500"-->
<!--      @click:outside="closeDialog"-->
<!--  >-->
<!--    <v-card class="attribute-dialog">-->
<!--      <v-card-title class="d-flex justify-end flex-fill dialog-close-wrapper">-->
<!--        <v-btn-->
<!--            height="24px"-->
<!--            width="24px"-->
<!--            icon-->
<!--            color="lightGrey"-->
<!--            variant="text"-->
<!--            @click="closeDialog"-->
<!--        >-->
<!--          <v-icon size="24px">mdi-close</v-icon>-->
<!--        </v-btn>-->
<!--      </v-card-title>-->

<!--      <v-card-text class="text-count-info-dialog__text">-->
<!--        <v-row class="text-count-info-dialog__text-wrap">-->
<!--          <v-col v-for="attr in costs" :key="attr.label" class="financial-attribute-row" cols="12">-->
<!--            <v-row>-->
<!--              <v-col class="attribute-dialog_attribute">{{ attr.label }}</v-col>-->
<!--              <v-col>{{ attr.value }} {{ currency }}</v-col>-->
<!--            </v-row>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--      </v-card-text>-->
<!--    </v-card>-->
<!--  </v-dialog>-->
<!--</template>-->

<!--<style scoped>-->
<!--.attribute-dialog {-->
<!--  padding: 32px 40px 32px 32px;-->
<!--}-->

<!--.dialog-close-wrapper {-->
<!--  position: absolute;-->
<!--  top: 10px;-->
<!--  right: 13px;-->
<!--  z-index: 2;-->
<!--}-->

<!--.text-count-info-dialog__text {-->
<!--  margin-top: 8px;-->
<!--  padding: 0!important;-->
<!--  font-style: normal;-->
<!--  font-weight: 500;-->
<!--  line-height: 17px;-->
<!--  color: #545465;-->
<!--  font-family: 'Nunito';-->
<!--  font-size: 15px;-->
<!--}-->

<!--.text-count-info-dialog__text-wrap {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  padding: 0!important;-->
<!--}-->

<!--.financial-attribute-row {-->
<!--  display: flex;-->
<!--  border-bottom: 1px solid #F2F4F9;-->
<!--}-->

<!--.financial-attribute-row > div {-->
<!--  flex: 1;-->
<!--  display: flex;-->
<!--  align-items: flex-end;-->
<!--  font-family: Nunito;-->
<!--  font-size: 13px;-->
<!--  font-style: normal;-->
<!--  font-weight: 500;-->
<!--  line-height: 16px;-->
<!--  min-height: 24px;-->
<!--  color: #545465;-->
<!--}-->

<!--.attribute-dialog_attribute {-->
<!--  color: #94A3B8 !important;-->
<!--}-->
<!--</style>-->







<!--<script setup>-->
<!--import { formatNumber }     from '@/helpers/priceHelper.js';-->
<!--import {-->
<!--  computed,-->
<!--  defineProps,-->
<!--  defineEmits-->
<!--}                           from 'vue';-->
<!--import { currenciesSymbol } from "@/constants/currencies.js";-->

<!--const props = defineProps({-->
<!--  show: Boolean,-->
<!--  params: Object-->
<!--});-->

<!--const totalCosts = computed(() => {-->
<!--  return props.params.data.costs.total_cost || 0;-->
<!--});-->

<!--const costsData = computed(() => {-->
<!--  return props.params && props.params.data && props.params.data.costs ? props.params.data.costs : {};-->
<!--});-->

<!--const financialAttributes = [-->
<!--  {text: 'Закуп', value: 'purchase', currency: 'purchase_currency', costsCurs: 'main_purchase_currency_course', percent: 'main_purchase_currency_course'},-->
<!--  {text: 'Издержки', value: 'costs', currency: 'costs_currency', costsCurs: 'main_costs_currency_course', percent: 'main_costs_currency_percent'},-->
<!--  {text: 'Расходники', value: 'consumables', currency: 'consumables_currency', costsCurs: 'main_consumables_currency_course', percent: 'main_consumables_currency_percent'},-->
<!--  {text: 'доп.Расходы', value: 'additional_expenses', currency: 'additional_expenses_currency', costsCurs: 'main_additional_expenses_currency_course', percent: 'main_additional_expenses_currency_percent'},-->
<!--];-->

<!--const emits = defineEmits(['close']);-->
<!--function closeDialog() {-->
<!--  emits('close');-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <v-dialog-->
<!--      :model-value="show"-->
<!--      width="100%"-->
<!--      max-width="560"-->
<!--      @click:outside="closeDialog"-->
<!--  >-->
<!--    <v-card class="attribute-dialog">-->
<!--      <v-card-title class="d-flex justify-end flex-fill dialog-close-wrapper">-->
<!--        <v-btn-->
<!--            height="24px"-->
<!--            width="24px"-->
<!--            icon-->
<!--            color="lightGrey"-->
<!--            variant="text"-->
<!--            @click="closeDialog"-->
<!--        >-->
<!--          <v-icon size="24px">mdi-close</v-icon>-->
<!--        </v-btn>-->
<!--      </v-card-title>-->

<!--      <v-card-text class="text-count-info-dialog__text">-->
<!--        <v-row class="text-count-info-dialog__text-wrap">-->
<!--          <v-col-->
<!--              v-for="attr in financialAttributes"-->
<!--              :key="attr.value"-->
<!--              class="financial-attribute-row"-->
<!--              cols="12"-->
<!--          >-->
<!--            <v-row>-->
<!--              <v-col class="attribute-dialog_attribute">-->
<!--                {{ attr.text }}-->
<!--              </v-col>-->
<!--              <v-col>-->
<!--                &lt;!&ndash;                {{ `${ formatNumber(costsData[attr.value] * costsData[attr.costsCurs] )}` }} {{ '₽' }}&ndash;&gt;-->
<!--                &lt;!&ndash;                {{ `${ formatNumber((costsData[attr.value] * costsData[attr.costsCurs]) * (1 + (costsData[attr.percent] / 100)))}` }} {{ '₽' }}&ndash;&gt;-->
<!--                {{ `${ formatNumber(costsData[attr.value] * costsData[attr.costsCurs] * (costsData[attr.percent] !== 0 ? (1 + (costsData[attr.percent] / 100)) : 1))}` }} {{ '₽' }}-->


<!--                <template v-if="costsData[attr.currency] !== 'RUB'">-->
<!--                  {{ `(${currenciesSymbol[costsData[attr.currency]]}${costsData[attr.value]} по курсу ${costsData[attr.costsCurs]} ${currenciesSymbol.RUB})` }}-->
<!--                </template>-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row class="total-row">-->
<!--          <v-col class="attribute-dialog_attribute">-->
<!--            Итого-->
<!--          </v-col>-->
<!--          <v-col>{{formatNumber(totalCosts)}} {{ 'RUB'}}</v-col>-->
<!--        </v-row>-->
<!--      </v-card-text>-->
<!--    </v-card>-->
<!--  </v-dialog>-->
<!--</template>-->

<!--<style scoped>-->
<!--.attribute-dialog {-->
<!--  padding: 32px 40px 32px 32px;-->
<!--}-->

<!--.dialog-close-wrapper {-->
<!--  position: absolute;-->
<!--  top: 10px;-->
<!--  right: 13px;-->
<!--  z-index: 2;-->
<!--}-->

<!--.text-count-info-dialog__text {-->
<!--  margin-top: 8px;-->
<!--  padding: 0!important;-->
<!--  font-style: normal;-->
<!--  font-weight: 500;-->
<!--  line-height: 17px;-->
<!--  color: #545465;-->
<!--  font-family: 'Nunito';-->
<!--  font-size: 15px;-->
<!--}-->

<!--.text-count-info-dialog__text-wrap {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  padding: 0!important;-->
<!--}-->

<!--.financial-attribute-row {-->
<!--  display: flex;-->
<!--  border-bottom: 1px solid #F2F4F9;-->
<!--}-->

<!--.total-row > div,-->
<!--.financial-attribute-row > div {-->
<!--  flex: 1;-->
<!--  display: flex;-->
<!--  align-items: flex-end;-->
<!--  font-family: Nunito;-->
<!--  font-size: 13px;-->
<!--  font-style: normal;-->
<!--  font-weight: 500;-->
<!--  line-height: 16px;-->
<!--  min-height: 24px;-->
<!--  color: #545465;-->
<!--}-->

<!--.attribute-dialog_attribute {-->
<!--  color: #94A3B8 !important;-->
<!--}-->
<!--</style>-->




<script setup>
import { formatNumber }     from '@/helpers/priceHelper.js';
import {
  computed,
  defineProps,
  defineEmits
}                           from 'vue';
import { currenciesSymbol } from "@/constants/currencies.js";

const props = defineProps({
  show: Boolean,
  params: Object
});

const totalCosts = computed(() => {
  return props.params.data.costs.total_cost || 0;
});

const costsData = computed(() => {
  return props.params && props.params.data && props.params.data.costs ? props.params.data.costs : {};
});

const financialAttributes = [
  {
    text: 'Закуп',
    value: 'purchase',
    currency: 'purchase_currency',
    costsCurs: 'main_purchase_currency_course',
    percent: 'main_purchase_currency_percent'
  },
  {
    text: 'Издержки',
    value: 'costs',
    currency: 'costs_currency',
    costsCurs: 'main_costs_currency_course',
    percent: 'main_costs_currency_percent'
  },
  {
    text: 'Расходники',
    value: 'consumables',
    currency: 'consumables_currency',
    costsCurs: 'main_consumables_currency_course',
    percent: 'main_consumables_currency_percent'
  },
  {
    text: 'доп.Расходы',
    value: 'additional_expenses',
    currency: 'additional_expenses_currency',
    costsCurs: 'main_additional_expenses_currency_course',
    percent: 'main_additional_expenses_currency_percent'},
];

const calculateFormattedCost = (value, currencyRate, percent) => {
  const cost = value * currencyRate;
  const additionalCost = percent !== 0 ? cost * (percent / 100) : 0;

  return formatNumber(cost + additionalCost) + ' ₽';
};

const calculatedFinancialPercent = computed(() => {
  const costPrice = {};
  financialAttributes.forEach(attr => {
    const value = costsData.value[attr.value];
    const currencyRate = costsData.value[attr.costsCurs];
    const percent = costsData.value[attr.percent];
    costPrice[attr.value] = calculateFormattedCost(value, currencyRate, percent);
  });

  return costPrice;
});

const calculatedCurrencyExchangeInfo = computed(() => {
  const exchangeInfo = {};
  financialAttributes.forEach(attr => {
    if (costsData.value[attr.currency] !== 'RUB') {
      const value = costsData.value[attr.value];
      const currencyRate = costsData.value[attr.costsCurs];
      const currencySymbol = currenciesSymbol[costsData.value[attr.currency]];
      exchangeInfo[attr.value] = `(${currencySymbol}${value} по курсу ${currencyRate} ${currenciesSymbol.RUB})`;
    }
  });

  return exchangeInfo;
});

const emits = defineEmits(['close']);
function closeDialog() {
  emits('close');
}
</script>

<template>
  <v-dialog
      :model-value="show"
      width="100%"
      max-width="560"
      @click:outside="closeDialog"
  >
    <v-card class="attribute-dialog">
      <v-card-title class="d-flex justify-end flex-fill dialog-close-wrapper">
        <v-btn
            height="24px"
            width="24px"
            icon
            color="lightGrey"
            variant="text"
            @click="closeDialog"
        >
          <v-icon size="24px">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="text-count-info-dialog__text">
        <v-row class="text-count-info-dialog__text-wrap">
          <v-col
              v-for="attr in financialAttributes"
              :key="attr.value"
              class="financial-attribute-row"
              cols="12"
          >
            <v-row>
              <v-col class="attribute-dialog_attribute">
                {{ attr.text }}
              </v-col>
              <v-col>
                {{ calculatedFinancialPercent[attr.value] }}
                <!--                 {{ `${ formatNumber(costsData[attr.value] * costsData[attr.costsCurs] + (costsData[attr.percent] !== 0 ? (formatNumber(costsData[attr.value] * costsData[attr.costsCurs]) * (costsData[attr.percent] / 100)) : 0))}` }} {{ '₽' }}-->
                <!--                <template v-if="costsData[attr.currency] !== 'RUB'">-->
                <!--                  {{ `(${currenciesSymbol[costsData[attr.currency]]}${costsData[attr.value]} по курсу ${costsData[attr.costsCurs]} ${currenciesSymbol.RUB})` }}-->
                <!--                </template>-->
                <template v-if="costsData[attr.currency] !== 'RUB'">
                  {{ calculatedCurrencyExchangeInfo[attr.value] }}
                </template>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="total-row">
          <v-col class="attribute-dialog_attribute">
            Итого
          </v-col>
          <v-col>{{formatNumber(totalCosts)}} {{ 'RUB'}}</v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.attribute-dialog {
  padding: 32px 40px 32px 32px;
}

.dialog-close-wrapper {
  position: absolute;
  top: 10px;
  right: 13px;
  z-index: 2;
}

.text-count-info-dialog__text {
  margin-top: 8px;
  padding: 0!important;
  font-style: normal;
  font-weight: 500;
  line-height: 17px;
  color: #545465;
  font-family: 'Nunito';
  font-size: 15px;
}

.text-count-info-dialog__text-wrap {
  display: flex;
  flex-direction: column;
  padding: 0!important;
}

.financial-attribute-row {
  display: flex;
  border-bottom: 1px solid #F2F4F9;
}

.total-row > div,
.financial-attribute-row > div {
  flex: 1;
  display: flex;
  align-items: flex-end;
  font-family: Nunito;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  min-height: 24px;
  color: #545465;
}

.attribute-dialog_attribute {
  color: #94A3B8 !important;
}
</style>