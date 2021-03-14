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
                    :countrySelected="form_country"
                    @languageSelected="onLanguageSelected"
                />
                <p v-if="!isValidLanguage" style="color: red">
                    {{ noLanguageSelected }}
                </p>
            </b-form-group>
            <b-button type="submit" variant="primary">
                {{ saveButton }}
            </b-button>
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
            form_country: null,
            form_language: null,
            isValidCountry: true,
            isValidLanguage: true,
        };
    },
    methods: {
        async onSubmit() {
            if (!this.form_country) {
                this.isValidCountry = false;
                return;
            }
            if (!this.form_language) {
                this.isValidLanguage = false;
                return;
            }
            this.isValid = true;
            this.$emit('countrySelected', this.form_country);
            this.$emit('languageSelected', this.form_language);
        },
        onCountrySelected(country) {
            this.form_country = country;
        },
        onLanguageSelected(language) {
            //console.log(language)
            this.form_language = language;
        },
    },
    beforeMount() {
        this.form_country = this.$store.state.country;

        this.$emit('countrySelected', this.$store.state.country);
        this.$emit('languageSelected', this.$store.state.language);


        //this.countrySelected = this.$store.state.country;
        //this.languageSelected = this.$store.state.language;
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
        saveButton() {
            return browser.i18n.getMessage('selectCountry_saveButton');
        },
    },
};
</script>
