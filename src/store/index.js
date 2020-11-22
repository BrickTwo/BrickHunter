import Vue from 'vue';
import Vuex from 'vuex';
import partList from './modules/partList';
import shopping from './modules/shopping';

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        mode: '',
        shopping,
        partList,
    },
    state: {
        version: {},
        country: '',
        language: '',
        affiliate: {},
    },
    mutations: {
        initialiseStore(state) {
            state.version.old = localStorage.getItem('version') || '1.0.0';
            state.version.current = '1.1.13';

            state.country = localStorage.getItem('country') || null;
            state.language = localStorage.getItem('language') || null;

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
                    sKey != 'selectedPrio1' &&
                    sKey != 'selectedPrio2' &&
                    sKey != 'selectedPrio3' &&
                    sKey != 'useHave' &&
                    sKey != 'version'
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
    },
    actions: {
        initialiseStore({ state, commit }) {
            commit('initialiseStore');
            commit('partList/initialiseStore', state.version.old);
            commit('shopping/initialiseStore');
        },
    },
});
