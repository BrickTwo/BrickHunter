<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand>
                <img src="icons/icon_24.png" class="d-inline-block align-top" />
                {{ extName }}
            </b-navbar-brand>
            <b-navbar-nav
                class="ml-auto"
                v-if="countrySelected && languageSelected"
            >
                <b-nav-item @click="showPage('import')">{{
                    menuImport
                }}</b-nav-item>
                <b-nav-item @click="showPage('partLists')">{{
                    menuWantedList
                }}</b-nav-item>
                <b-nav-item @click="showPage('shopping')">{{
                    menuShoppingCart
                }}</b-nav-item>
                <b-nav-item @click="showPage('export')">{{
                    menuExport
                }}</b-nav-item>

                <b-nav-item
                    @click="
                        link('https://github.com/BrickTwo/BrickHunter/wiki')
                    "
                    >{{ menuHelp }}</b-nav-item
                >

                <b-nav-item @click="showPage('info')"
                    ><b-icon icon="info-circle" aria-hidden="true"></b-icon
                ></b-nav-item>
                <b-nav-item @click="showPage('settings')"
                    ><b-icon icon="gear" aria-hidden="true"></b-icon
                ></b-nav-item>
            </b-navbar-nav>
        </b-navbar>
        <div class="page">
            <router-view
                v-if="countrySelected && languageSelected"
            ></router-view>
            <SelectCountry
                @countrySelected="onCountrySelected"
                @languageSelected="onLanguageSelected"
                v-if="!countrySelected || !languageSelected"
            />
        </div>
    </div>
</template>

<style>
.page {
    padding: 20px;
    width: 780px; /* max pop with 800px - scrollbar */
}
.tabPage {
    margin-top: 5px !important;
}
.button {
    margin-right: 5px !important;
}
.text-overflow-elipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.col,
.col-7 {
    padding: 0 !important;
}
p {
    padding: 0 !important;
    margin: 0 !important;
}
</style>

<script>
import SelectCountry from '@/components/SelectCountry.vue';
import SelectCountryDropDown from '@/components/SelectCountryDropDown.vue';

export default {
    components: {
        SelectCountry,
        SelectCountryDropDown,
    },
    data() {
        return {
            selected: null,
            countrySelected: null,
            languageSelected: null,
            partListId: null,
        };
    },
    methods: {
        onCountrySelected(country) {
            this.countrySelected = country;
        },
        showPage(page) {
            this.$router.push('/' + page).catch(() => {});
        },
        link(value) {
            browser.tabs.create({ url: value });
        },
        onCountrySelected(country) {
            this.countrySelected = country;
        },
        onLanguageSelected(language) {
            this.languageSelected = language;
        },
    },
    beforeMount() {
        this.$router.push('/export').catch(() => {});
        this.countrySelected = localStorage.getItem('country') || null;
        this.languageSelected = localStorage.getItem('language') || null;
    },
    computed: {
        extName() {
            return browser.i18n.getMessage('extName');
        },
        menuImport() {
            return browser.i18n.getMessage('menu_import');
        },
        menuWantedList() {
            return browser.i18n.getMessage('menu_wantedList');
        },
        menuShoppingCart() {
            return browser.i18n.getMessage('menu_shoppingCart');
        },
        menuExport() {
            return browser.i18n.getMessage('menu_export');
        },
        menuExportWantedList() {
            return browser.i18n.getMessage('menu_exportWantedList');
        },
        menuExportCsv() {
            return browser.i18n.getMessage('menu_exportCsv');
        },
        menuHelp() {
            return browser.i18n.getMessage('menu_help');
        },
    },
};
</script>