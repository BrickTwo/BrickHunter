<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info" style="position: sticky">
      <b-navbar-brand>
        <img src="icons/icon_24.png" class="d-inline-block align-top">
        BrickHunter
        </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <SelectCountryOneLine @countrySelected="onCountrySelected" v-if="countrySelected"/>
      </b-navbar-nav>
    </b-navbar>
    <div class="page">
      <SelectCountry @countrySelected="onCountrySelected" v-if="!countrySelected"/>
      <UploadWantedList v-if="countrySelected"/>
    </div>
  </div>
</template>

<script>
import SelectCountry from "@/components/SelectCountry.vue";
import SelectCountryOneLine from "@/components/SelectCountryOneLine.vue";
import UploadWantedList from "@/components/UploadWantedList.vue";
import BrickList from "@/components/BrickList.vue";
export default {
  name: "App",
  components: { SelectCountry, SelectCountryOneLine, UploadWantedList, BrickList },
  data() {
    return {
      selected: null,
      options: [
        { value: 'de', text: 'Deutschland' },
        { value: 'at', text: 'Östereich' },
        { value: 'ch', text: 'Schweiz' }
      ],
      countrySelected: null
    };
  },
  methods: {
    onCountrySelected (country) {
      this.countrySelected = country;
    }
  },
  beforeMount() {
    this.countrySelected = localStorage.getItem("country") || null;
  }
};
</script>
<style>
html {
  min-width: 500px;
}
.page {
  padding: 20px;
}
</style>