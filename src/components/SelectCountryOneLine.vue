<template>
      <b-form-select v-model="form_country" :options="options" @change="changeCountry"></b-form-select>
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
    changeCountry() {
        localStorage.setItem("country", this.form_country);
        console.log(this.form_country);
        this.$emit('countrySelected', this.form_country)
        //this.$store.commit("setKeyword", this.form.keyword);
    }
  },
  beforeMount() {
    this.form_country = localStorage.getItem("country") || null;
  }
};
</script>