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
            <b-form-checkbox
                id="showImagesInLegoOrder"
                v-model="showImagesInLegoOrder"
                @change="onShowImagesInLegoOrderChange"
            >
                {{ labelShowImagesInLegoOrder }}
            </b-form-checkbox>
            <!--<b-form-checkbox
                id="generateLog"
                v-model="generateLog"
                @change="onGenerateLogChange"
            >
                Log aktivieren
            </b-form-checkbox>
            <b-button @click="downloadLog">
                Download Log
            </b-button>-->
        </b-form>
    </div>
</template>

<script>
import SelectCountryDropDown from '@/components/SelectCountryDropDown.vue';
import SelectLanguageDropDown from '@/components/SelectLanguageDropDown.vue';
import Affiliate from '@/components/Affiliate.vue';
export default {
    components: {
        SelectCountryDropDown,
        SelectLanguageDropDown,
        Affiliate,
    },
    data() {
        return {
            selectedCountry: null,
            selectedLanguage: null,
            isValidCountry: true,
            isValidLanguage: true,
            showImagesInLegoOrder: true,
            generateLog: false,
        };
    },
    methods: {
        onCountrySelected(country) {
            this.selectedCountry = country;
        },
        onLanguageSelected(language) {
            this.selectedLanguage = language;
        },
        onShowImagesInLegoOrderChange(val) {
            this.$store.commit('setShowImagesInLegoOrder', val);
        },
        onGenerateLogChange(val) {
            this.$store.commit('setGenerateLog', val);
        },
        downloadLog() {
            let content =
                'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(this.$store.state.log));

            const data =content;
            const link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute(
                'download',
                'BrickHunter_errorlog.json'
            );
            link.click();
        },
    },
    beforeMount() {
        this.selectedCountry = this.$store.state.country;
        this.showImagesInLegoOrder = this.$store.state.showImagesInLegoOrder;
        this.generateLog = this.$store.state.generateLog;
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
        labelShowImagesInLegoOrder() {
            return browser.i18n.getMessage('setting_showImagesInLegoOrder');
        },
    },
};
</script>
