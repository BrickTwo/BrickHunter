<template>
    <div style="width: 500px">
        <b-form @submit.prevent="onSubmit">
            <b-form-group :label="whereDoYouLive" label-for="country">
                <SelectCountryDropDown @countrySelected="onCountrySelected" />
                <p v-if="!isValidCountry" style="color: red">
                    {{ noCountrySelected }}
                </p>
            </b-form-group>
            <b-form-group :label="langaugeOnLegoWebsite" label-for="country">
                <SelectLanguageDropDown
                    :countrySelected="selectedCountry"
                    @languageSelected="onLanguageSelected"
                />
                <p v-if="!isValidLanguage" style="color: red">
                    {{ noLanguageSelected }}
                </p>
            </b-form-group>
        </b-form>
    </div>
</template>

<script>
import SelectCountryDropDown from '@/components/SelectCountryDropDown.vue';
import SelectLanguageDropDown from '@/components/SelectLanguageDropDown.vue';
export default {
    components: {
        SelectCountryDropDown,
        SelectLanguageDropDown,
    },
    data() {
        return {
            selectedCountry: null,
            selectedLanguage: null,
            isValidCountry: true,
            isValidLanguage: true,
        };
    },
    methods: {
        onCountrySelected(country) {
            this.selectedCountry = country;
        },
        onLanguageSelected(language) {
            this.selectedLanguage = language;
        },
    },
    beforeMount() {
        this.selectedCountry = localStorage.getItem('country') || null;
    },
    computed: {
        whereDoYouLive() {
            return browser.i18n.getMessage('selectCountry_whereDoYouLive');
        },
        noCountrySelected() {
            return browser.i18n.getMessage('selectCountry_noCountrySelected');
        },
        noLanguageSelected() {
            return browser.i18n.getMessage('selectCountry_noLanguageSelected');
        },
        langaugeOnLegoWebsite() {
            return browser.i18n.getMessage(
                'selectCountry_langaugeOnLegoWebsite'
            );
        },
    },
};
</script>
