<template>
  <div style="width: 500px">
    <ValidationObserver ref="observer" v-slot="{ invalid }">
        <b-form @submit.prevent="onSubmit" novalidate>
            <b-form-group :label="whereDoYouLive" label-for="country">
            <ValidationProvider name="country" rules="required" v-slot="{ errors }">
                <b-form-select v-model="form_country" :options="options"></b-form-select>
                <b-form-invalid-feedback :state="errors.length == 0">{{ selectCountry }}</b-form-invalid-feedback>
            </ValidationProvider>
            </b-form-group>
            <b-button type="submit" variant="primary">{{ saveButton }}</b-button>
        </b-form>
    </ValidationObserver>
  </div>
</template>
<script>
export default {
  name: "SelectCountry",
  data() {
    return {
        form_country: null,
        options: [
          { value: 'de', text: browser.i18n.getMessage('country_germany') },
          { value: 'at', text: browser.i18n.getMessage('country_austria') },
          { value: 'ch', text: browser.i18n.getMessage('country_switzerland') }
        ]
    };
  },
  methods: {
    async onSubmit() {
        const isValid = await this.$refs.observer.validate();
        if (!isValid) {
            return;
        }
        localStorage.setItem("country", this.form_country);
        this.$emit('countrySelected', this.form_country)
        //this.$store.commit("setKeyword", this.form.keyword);
    }
  },
  computed: {
    whereDoYouLive() {
      return browser.i18n.getMessage('selectCountry_whereDoYouLive')
    },
    selectCountry() {
      return browser.i18n.getMessage('selectCountry_selectCountry')
    },
    saveButton() {
      return browser.i18n.getMessage('selectCountry_saveButton')
    }
  }
};
</script>