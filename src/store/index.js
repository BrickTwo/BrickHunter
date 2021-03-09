import Vue from 'vue';
import Vuex from 'vuex';
import partList from './modules/partList';
import shopping from './modules/shopping';
import singleParts from './modules/singleParts';
import { version } from '../../package';

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        mode: '',
        shopping,
        partList,
        singleParts,
    },
    state: {
        version: {},
        country: '',
        language: '',
        affiliate: {},
        syncDate: null,
        showImagesInLegoOrder: true,
    },
    mutations: {
        initialiseStore(state) {
            state.version.old = localStorage.getItem('version') || '1.0.0';
            state.version.current = version;

            state.country = localStorage.getItem('country') || null;
            state.language = localStorage.getItem('language') || null;
            state.syncDate =
                localStorage.getItem('syncDate') ||
                new Date(Date.now() - 1000 * 60 * 60 * 2);
            state.showImagesInLegoOrder =
                (localStorage.getItem('showImagesInLegoOrder') || 'true') ===
                'true';

            localStorage.setItem('version', state.version.current);
            //console.log(state.version)
            var sKey;

            for (var i = 0; (sKey = window.localStorage.key(i)); i++) {
                if (
                    !sKey.startsWith('partList_') &&
                    sKey != 'selectedOptions' &&
                    sKey != 'selectedColorOptions' &&
                    sKey != 'selectedPickABrickOptions' &&
                    sKey != 'selectedBricksAndPiecesOptions' &&
                    sKey != 'exportPickaBrickPrices' &&
                    sKey != 'exportStonesAndPiecesPrices' &&
                    sKey != 'writeLegoIdInRemark' &&
                    sKey != 'writeSourceOfPriceInRemark' &&
                    sKey != 'behaviourOnSamePrice' &&
                    sKey != 'recalcHave' &&
                    sKey != 'country' &&
                    sKey != 'language' &&
                    sKey != 'settingsShopping' &&
                    sKey != 'version' &&
                    sKey != 'syncDate' &&
                    sKey != 'favorites' &&
                    sKey != 'filterSingleParts' &&
                    sKey != 'showImagesInLegoOrder'
                ) {
                    localStorage.removeItem(sKey);
                }
            }
        },
        setMode(state, payload) {
            state.mode = payload;
        },
        setCountry(state, payload) {
            state.country = payload;
            localStorage.setItem('country', state.country);
        },
        setLanguage(state, payload) {
            state.language = payload;
            localStorage.setItem('language', state.language);
        },
        setAffiliate(state, payload) {
            state.affiliate = payload;
            localStorage.setItem('affiliate', JSON.stringify(state.affiliate));
        },
        setSyncDate(state, payload) {
            state.syncDate = payload;
            localStorage.setItem('syncDate', state.syncDate);
        },
        setSyncDate(state, payload) {
            state.syncDate = payload;
            localStorage.setItem('syncDate', state.syncDate);
        },
        setShowImagesInLegoOrder(state, payload) {
            state.setShowImagesInLegoOrder = payload;
            localStorage.setItem('showImagesInLegoOrder', state.setShowImagesInLegoOrder);
        },
    },
    actions: {
        initialiseStore({ state, commit }) {
            commit('initialiseStore');
            commit('partList/initialiseStore', state.version.old);
            commit('shopping/initialiseStore', state.version.old);
            commit('singleParts/initialiseStore');
        },
    },
});
