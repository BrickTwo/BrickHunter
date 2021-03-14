import Vue from 'vue';
import Vuex from 'vuex';
import partList from './modules/partList';
import shopping from './modules/shopping';
import singleParts from './modules/singleParts';
import { version } from '../../package';
import { persistencePlugin } from '@/utility/persistencePlugin';
import { getPersistedState } from '@/utility/stateMapper'; 
import { bus } from '@/utility/bus'; 

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
        initialized: false,
        showImagesInLegoOrder: true,
    },
    mutations: {
        initialize(state, persistedState) {
            state.partList.partLists = persistedState;
            // use the fetched, persisted state.
            // In my case, I was reconstructing an array, so I wrote a handler (overwriteStore) to deal with the data rather simplistically
            //overwriteStore(state, { arrayOfThings: persistedState }); // but do your own thing here.


            //Vue.set(state, 'initialized', true);
        },
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
        async initialiseStore({ dispatch, state, commit }) {
            await getPersistedState()
            .then((persistedState) => {
                commit('initialize', persistedState);
            })
            .catch((error) => {
                // tsk tsk... handle this error too
            });
            commit('initialiseStore');
            dispatch('partList/initialiseStore', state.version.old);
            commit('shopping/initialiseStore', state.version.old);
            commit('singleParts/initialiseStore');
            state.initialized = true;
            bus.$emit('initialized', true);
        },
    },
    plugins: [persistencePlugin],
});
