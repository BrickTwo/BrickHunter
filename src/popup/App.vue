<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand>
                <img src="icons/icon_24.png" class="d-inline-block align-top" />
                {{ extName }}
            </b-navbar-brand>
            <b-navbar-nav class="ml-auto" v-if="countrySelected && languageSelected">
                <b-nav-item @click="showPage = 'import'">{{
                    menuImport
                }}</b-nav-item>
                <b-nav-item @click="showPage = 'wantedList'">{{
                    menuWantedList
                }}</b-nav-item>
                <b-nav-item @click="showPage = 'shopping'">{{
                    menuShoppingCart
                }}</b-nav-item>
                <b-nav-item-dropdown>
                    <template v-slot:button-content>
                        {{ menuExport }}
                    </template>
                    <b-dropdown-item @click="showPage = 'exportWantedList'">{{
                        menuExportWantedList
                    }}</b-dropdown-item>
                    <b-dropdown-item @click="showPage = 'exportCsv'">{{
                        menuExportCsv
                    }}</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item
                    @click="
                        link('https://github.com/BrickTwo/BrickHunter/wiki')
                    "
                    >{{ menuHelp }}</b-nav-item
                >

                <b-nav-item @click="showPage = 'info'"
                    ><b-icon icon="info-circle" aria-hidden="true"></b-icon
                ></b-nav-item>
                <b-nav-item @click="showPage = 'settings'"
                    ><b-icon icon="gear" aria-hidden="true"></b-icon
                ></b-nav-item>

                <!--<b-nav-form>
                    <SelectCountryDropDown
                        :showFlags="true"
                        v-if="countrySelected"
                    />
                </b-nav-form>-->
            </b-navbar-nav>
        </b-navbar>
        <div class="page">
            <SelectCountry
                @countrySelected="onCountrySelected"
                @languageSelected="onLanguageSelected"
                v-if="!countrySelected || !languageSelected"
            />
            <div v-if="countrySelected && languageSelected">
                <WantedList v-if="showPage == 'wantedList'" />
                <Shopping
                    v-if="showPage == 'shopping'"
                    @changePage="changePage"
                />
                <ExportWantedList v-if="showPage == 'exportWantedList'" />
                <ExportCsv v-if="showPage == 'exportCsv'" />
                <Info v-if="showPage == 'info'" />
                <Settings v-if="showPage == 'settings'" />
            </div>
        </div>
    </div>
</template>

<script>
import SelectCountry from '@/components/SelectCountry.vue';
import SelectCountryDropDown from '@/components/SelectCountryDropDown.vue';
import WantedList from '@/components/WantedList.vue';
import Shopping from '@/components/Shopping.vue';
import ExportWantedList from '@/components/ExportWantedList.vue';
import ExportCsv from '@/components/ExportCsv.vue';
import BrickList from '@/components/BrickList.vue';
import Info from '@/components/Info.vue';
import Settings from '@/components/Settings.vue';

export default {
    components: {
        SelectCountry,
        SelectCountryDropDown,
        WantedList,
        Shopping,
        ExportWantedList,
        ExportCsv,
        BrickList,
        Info,
        Settings,
    },
    data() {
        return {
            showPage: 'wantedList',
            selected: null,
            countrySelected: null,
            languageSelected: null,
        };
    },
    methods: {
        changePage(value) {
            this.showPage = value;
        },
        link(value) {
            browser.tabs.create({ url: value });
        },
    },
    beforeMount() {
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

<style>
.page {
    padding: 20px;
    width: 780px; /* max pop with 800px - scrollbar */
}
</style>
