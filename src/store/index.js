import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        wantedList: '',
        partLists: [],
        totalPositions: 0,
    },
    mutations: {
        initialiseStore(state) {
            var i = 0,
                sKey;

            for (; (sKey = window.localStorage.key(i)); i++) {
                if (sKey.startsWith('partList_')) {
                    state.partLists.push(
                        JSON.parse(window.localStorage.getItem(sKey))
                    );
                } else if (
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

            state.totalPositions = 0;
            state.partLists.map((partList) => {
                state.totalPositions += partList.positions.length;
            });
        },
        setPartList(state, payload) {
            var found = state.partLists.find(
                (partList) => partList.id === payload.id
            );

            if (found) {
                found = payload;
            } else {
                state.partLists.push(payload);
            }

            localStorage.setItem(
                'partList_' + payload.id,
                JSON.stringify(payload)
            );

            state.totalPositions = 0;
            state.partLists.map((partList) => {
                state.totalPositions += partList.positions.length;
            });
        },
        deletePartList(state, partListId) {
            state.partLists = state.partLists.filter(
                (partList) => partList.id != partListId
            );
            localStorage.removeItem('partList_' + partListId);

            state.totalPositions = 0;
            state.partLists.map((partList) => {
                state.totalPositions += partList.positions.length;
            });
        },
    },
    getters: {
        getPartListsById: (state) => (id) => {
            return state.partLists.find((partList) => partList.id === id);
        },
    },
    actions: {},
});
