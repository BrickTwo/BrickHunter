<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <b-container class="p-0" fluid="xl">
                <b-navbar-brand
                    class="p-0"
                    style="margin-top: -10px; margin-bottom: -10px; margin-right: 5px"
                >
                    <img
                        src="icons/icon_trans_48.png"
                        class="d-inline-block align-top"
                    />
                </b-navbar-brand>
                <b-navbar-brand class="p-0" style="font-size: 1.7rem;">
                    <span>{{ extName }}</span>
                </b-navbar-brand>
                <b-navbar-nav
                    class="ml-auto"
                    v-if="countrySelected && languageSelected"
                >
                    <b-nav-item
                        @click="showPage('singleParts')"
                        :active="$router.currentRoute.path == '/singleParts'"
                    >
                        {{ menuSingleParts }}
                        <b-badge variant="danger">Beta</b-badge>
                    </b-nav-item>
                    <b-nav-item
                        @click="showPage('import')"
                        :active="$router.currentRoute.path == '/import'"
                    >
                        {{ menuImport }}
                    </b-nav-item>
                    <b-nav-item
                        @click="showPage('partLists')"
                        :active="$router.currentRoute.path.startsWith('/partList')"
                    >
                        {{ menuWantedList }}
                    </b-nav-item>
                    <b-nav-item
                        @click="showPage('shopping')"
                        :active="$router.currentRoute.path == '/shopping'"
                    >
                        {{ menuShoppingCart }}
                    </b-nav-item>
                    <b-nav-item
                        @click="showPage('export')"
                        :active="$router.currentRoute.path.startsWith('/export')"
                    >
                        {{ menuExport }}
                    </b-nav-item>

                    <b-nav-item
                        @click="
                            link('https://github.com/BrickTwo/BrickHunter/wiki')
                        "
                        >{{ menuHelp }}</b-nav-item
                    >

                    <b-nav-item
                        @click="showPage('info')"
                        :active="$router.currentRoute.path == '/info'"
                    >
                        <b-icon icon="info-circle" aria-hidden="true" />
                    </b-nav-item>
                    <b-nav-item
                        @click="showPage('settings')"
                        :active="$router.currentRoute.path == '/settings'"
                    >
                        <b-icon icon="gear" aria-hidden="true" />
                    </b-nav-item>
                    <b-nav-item
                        @click="openInFullscreen()"
                        v-if="this.$store.state.mode == 'popup'"
                    >
                        <b-icon icon="arrows-fullscreen" aria-hidden="true" />
                    </b-nav-item>
                </b-navbar-nav>
            </b-container>
        </b-navbar>
        <b-container class="pt-1 pb-3 pl-0 pr-0 page" fluid="xl">
            <b-alert
                show
                v-if="newVersionAvailable"
                variant="warning"
                dismissible
            >
                Neue Version {{ newVersionAvailable }} Verfügbar!
            </b-alert>
            <router-view v-if="countrySelected && languageSelected" />
            <SelectCountry
                @countrySelected="onCountrySelected"
                @languageSelected="onLanguageSelected"
                v-if="!countrySelected || !languageSelected"
            />
        </b-container>
        <b-modal
            id="notificationMessage"
            :title="labelNotificationHeader"
            :header-bg-variant="headerBgVariant"
            :header-text-variant="headerTextVariant"
            centered
            hide-footer
        >
            <p class="my-4" v-html="notification" />
        </b-modal>
    </div>
</template>

<style>
.page {
    padding: 20px;
}
.noPadding {
    padding: 0px;
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
import Vue from 'vue';
export const bus = new Vue();

import SelectCountry from '@/components/SelectCountry.vue';
import SelectCountryDropDown from '@/components/SelectCountryDropDown.vue';
import apiBrickTwo from '@/utility/api/bricktwo.js';

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
            newVersionAvailable: null,
            headerBgVariant: 'dark',
            headerTextVariant: 'light',
            notification: null,
            page: null,
        };
    },
    methods: {
        onCountrySelected(country) {
            this.countrySelected = country;
        },
        showPage(page) {
            this.page = page;
            this.$router.push('/' + page).catch(() => {});
            this.cloudSync();
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
        openInFullscreen(page) {
            if (page) {
                browser.tabs.create({
                    url: chrome.runtime.getURL('index.html#' + page),
                });
                window.close();
                return;
            }
            browser.tabs.create({
                url: chrome.runtime.getURL(
                    'index.html#' + this.$router.currentRoute.path
                ),
            });
            window.close();
        },
        async cloudSync() {
            var checkDate = new Date(this.$store.state.syncDate);
            checkDate.setHours(checkDate.getHours() + 1);
            if (checkDate < new Date(Date.now())) {
                var cloudData = await apiBrickTwo.getSyncAsync();
                this.$store.commit('setSyncDate', new Date(Date.now()));

                if (cloudData.version) {
                    var currentVersion = this.$store.state.version.current
                        .split('.')
                        .map(Number);
                    var cloudVersion = cloudData.version.split('.').map(Number);

                    if (
                        currentVersion[0] <= cloudVersion[0] &&
                        currentVersion[1] <= cloudVersion[1] &&
                        currentVersion[2] < cloudVersion[2]
                    ) {
                        this.newVersionAvailable = cloudData.version;
                    }
                }

                if (cloudData.notification) {
                    var language = await browser.i18n.getUILanguage();
                    if (language.startsWith('de')) {
                        this.notification = cloudData.notification.messageDe;
                    } else {
                        this.notification = cloudData.notification.messageEn;
                    }

                    this.$bvModal.show('notificationMessage');
                }
            }
        },
    },
    beforeMount() {
        if (this.$store.state.mode == 'popup')
            this.$router.push('/shopping').catch(() => {});
        this.countrySelected = this.$store.state.country;
        this.languageSelected = this.$store.state.language;
        this.cloudSync();
    },
    computed: {
        extName() {
            return browser.i18n.getMessage('extName');
        },
        bricksAndPieces() {
            return browser.i18n.getMessage('bricksAndPieces');
        },
        menuSingleParts() {
            return browser.i18n.getMessage('import_singleParts');
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
        labelNotificationHeader() {
            return browser.i18n.getMessage('notification_header');
        },
    },
};
</script>
