import { BreadcrumbPlugin } from 'bootstrap-vue';
import Vue from 'vue';
import Vuex from 'vuex';
import partList from './modules/partList';
import shopping from './modules/shopping';

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        shopping,
        partList,
    },
    mutations: {
        initialiseStore(state) {
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
                    sKey != 'useHave'
                ) {
                    localStorage.removeItem(sKey);
                }
            }
        },
        
        /*setShoppingProp(state, payload) {
            switch (payload.prop) {
                case 'bricksAndPiecesPositions':
                    state.shopping.bricksAndPiecesPositions = payload.value;
                    break;
                case 'pickABrickPositions':
                    state.shopping.pickABrickPositions = payload.value;
                    break;
                case 'brickLinkPositions':
                    state.shopping.brickLinkPositions = payload.value;
                    break;
            }
        }*/
    },
    actions: {
        initialiseStore({state, commit}){
            commit('initialiseStore');
            commit('partList/initialiseStore');
            commit('shopping/initialiseStore');
        }
    },
});
