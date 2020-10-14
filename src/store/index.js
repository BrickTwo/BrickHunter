import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        wantedList: '',
        partLists: [],
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
                }
            }
        },
        setWantedList(state, payload) {
            state.wantedList = payload;
            localStorage.setItem('wantedList', JSON.stringify(payload));
        },
        setPartList(state, payload) {
            var found = state.partLists.find((partList) => partList.id === payload.id);

            if (found) {
                found = payload;
            } else {
                state.partLists.push(payload);
            }

            localStorage.setItem(
                'partList_' + payload.id,
                JSON.stringify(payload)
            );
        },
        deletePartList(state, partListId) {
            console.log(state.partLists, state.partLists.filter((partList) => partList.id != partListId))
            state.partLists = state.partLists.filter((partList) => partList.id != partListId);
            localStorage.removeItem('partList_' + partListId);
        }
    },
    getters: {
        getPartListsById: (state) => (id) => {
            return state.partLists.find((partList) => partList.id === id);
        },
    },
    actions: {},
});
