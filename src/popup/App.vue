<template>
  <div style="width: 770px">
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand>
        <img src="icons/icon_24.png" class="d-inline-block align-top">
        BrickHunter
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto" v-if="showPage!='selectCountry'">
        
        <b-nav-item @click="showPage = 'wantedList'"><!-- <b-icon icon="card-list" aria-hidden="true"></b-icon> -->Wanted List</b-nav-item>
        <!-- <b-nav-item href="#"><b-icon icon="cart" aria-hidden="true"></b-icon> Shopping</b-nav-item> -->
        <!-- <b-nav-item href="#"><b-icon icon="question-circle" aria-hidden="true"></b-icon> Tipps</b-nav-item> -->

        <b-nav-item-dropdown>
          <template v-slot:button-content>
            <!-- <b-icon icon="arrow-bar-up" aria-hidden="true"></b-icon> -->Export
          </template>
          <b-dropdown-item @click="showPage = 'exportWantedList'">Wanted List</b-dropdown-item>
          <!-- <b-dropdown-item href="#">CSV</b-dropdown-item> -->
        </b-nav-item-dropdown>

        <!-- <b-nav-item href="#"><b-icon icon="info-circle" aria-hidden="true"></b-icon> About</b-nav-item> -->

        <b-nav-form>
            <SelectCountryOneLine @countrySelected="onCountrySelected" v-if="countrySelected"/>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
    <div class="page">
      <SelectCountry @countrySelected="onCountrySelected" v-if="showPage=='selectCountry'"/>
      <WantedList v-if="showPage=='wantedList'"/>
      <ExportWantedList v-if="showPage=='exportWantedList'"/>
    </div>
  </div>
</template>

<script>
import SelectCountry from '@/components/SelectCountry.vue'
import SelectCountryOneLine from '@/components/SelectCountryOneLine.vue'
import WantedList from '@/components/WantedList.vue'
import ExportWantedList from '@/components/ExportWantedList.vue'
import BrickList from '@/components/BrickList.vue'

export default {
  name: 'App',
  components: { SelectCountry, SelectCountryOneLine, WantedList, ExportWantedList, BrickList },
  data() {
    return {
      showPage: 'wantedList',
      selected: null,
      options: [
        { value: 'de', text: 'Deutschland' },
        { value: 'at', text: 'Östereich' },
        { value: 'ch', text: 'Schweiz' }
      ],
      countrySelected: null
    }
  },
  methods: {
    onCountrySelected (country) {
      this.countrySelected = country
      this.showPage = 'wantedList'
    }
  },
  beforeMount() {
    this.countrySelected = localStorage.getItem("country") || null
    if(!this.countrySelected) this.showPage = 'selectCountry'
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