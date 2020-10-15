<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand>
                <img src="icons/icon_24.png" class="d-inline-block align-top" />
                {{ extName }}
            </b-navbar-brand>
            <b-navbar-nav class="ml-auto" v-if="this.countrySelected">
                <b-nav-item @click="showPage('import')">{{
                    menuImport
                }}</b-nav-item>
                <b-nav-item @click="showPage('partLists')">{{
                    menuWantedList
                }}</b-nav-item>
                <b-nav-item @click="showPage('shopping')">{{
                    menuShoppingCart
                }}</b-nav-item>
                <b-nav-item-dropdown>
                    <template v-slot:button-content>
                        {{ menuExport }}
                    </template>
                    <b-dropdown-item @click="showPage('exportWantedList')">{{
                        menuExportWantedList
                    }}</b-dropdown-item>
                    <b-dropdown-item @click="showPage('exportCsv')">{{
                        menuExportCsv
                    }}</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item
                    @click="
                        link('https://github.com/BrickTwo/BrickHunter/wiki')
                    "
                    >{{ menuHelp }}</b-nav-item
                >

                <b-nav-item @click="showPage('info')"
                    ><b-icon icon="info-circle" aria-hidden="true"></b-icon
                ></b-nav-item>

                <b-nav-form>
                    <SelectCountryDropDown
                        :showFlags="true"
                        v-if="countrySelected"
                    />
                </b-nav-form>
            </b-navbar-nav>
        </b-navbar>
        <div class="page">
            <router-view v-if="this.countrySelected"></router-view>
            <SelectCountry
                @countrySelected="onCountrySelected"
                v-if="!this.countrySelected"
            />
        </div>
    </div>
</template>

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
            options: [
                { value: 'de', text: 'Deutschland' },
                { value: 'at', text: 'Östereich' },
                { value: 'ch', text: 'Schweiz' },
            ],
            countrySelected: null,
            partListId: null,
        };
    },
    methods: {
        onCountrySelected(country) {
            this.countrySelected = country;
        },
        showPage(page) {
            this.$router.push('/' + page);
        },
        link(value) {
            browser.tabs.create({ url: value });
        },
    },
    beforeMount() {
        this.$router.push('/partLists');
        this.countrySelected = localStorage.getItem('country') || null;
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

<style>
.page {
    padding: 20px;
    width: 780px; /* max pop with 800px - scrollbar */
}
</style>
