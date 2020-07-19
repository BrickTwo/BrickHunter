<template>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
        <b-form @submit.prevent="onSubmit" novalidate>
            <b-form-group label="Dein Land" label-for="country">
            <ValidationProvider name="country" rules="required" v-slot="{ errors }">
                <b-form-select v-model="form_country" :options="options"></b-form-select>
                <b-form-invalid-feedback :state="errors.length == 0">Bitte ein Land auswählen</b-form-invalid-feedback>
            </ValidationProvider>
            </b-form-group>
            <b-button type="submit" variant="primary">Speichern</b-button>
        </b-form>
    </ValidationObserver>
  
</template>
<script>
export default {
  name: "SelectCountry",
  data() {
    return {
        form_country: null,
        options: [
          { value: 'de', text: 'Deutschland' },
          { value: 'at', text: 'Östereich' },
          { value: 'ch', text: 'Schweiz' }
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
  }
};
</script>