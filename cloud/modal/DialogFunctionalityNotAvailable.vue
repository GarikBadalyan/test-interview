<template>
  <v-dialog
      v-model="functionalityNotAvailable"
      max-width="700px"
      @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ $t('settings.general.useGlobals.somethingWrong') }}
        </span>
      </v-card-title>

      <v-divider class="pb-3" />

      <v-card-text class="functionality-not-available">
        {{ $t('settings.general.useGlobals.functionalityNotAvailable') }}
      </v-card-text>

      <v-divider class="pb-3" />

      <v-card-actions>
        <v-btn
            color="blue darken-1"
            text
            @click="goTo()"
        >
          {{ $t('settings.general.useGlobals.choosePlan') }}
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            class="ml-auto"
            @click="closeDialog"
        >
          {{ $t('settings.general.useGlobals.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'DialogFunctionalityNotAvailable',

  computed: {
    ...mapGetters({
      functionalityNotAvailable: 'main/functionalityNotAvailable',
    }),
  },

  methods: {
    async goTo() {
      await this.$router.push('/app/fb/profile');
      this.$store.dispatch('main/setFunctionalityNotAvailable', false);
    },

    closeDialog() {
      this.$store.dispatch('main/setFunctionalityNotAvailable', false);
    }
  }
};
</script>

<style>
.functionality-not-available {
  font-size: 20px;
}
</style>