// initial state
const state = () => ({
    partLists: [],
    totalPositions: 0,
});

// getters
const getters = {
    getPartListsById: (state) => (id) => {
        return state.partLists.find((partList) => partList.id === id);
    },
};

// actions
const actions = {};

// mutations
const mutations = {
    initialiseStore(state) {
        var sKey;

        for (var i = 0; (sKey = window.localStorage.key(i)); i++) {
            if (sKey.startsWith('partList_')) {
                state.partLists.push(
                    JSON.parse(window.localStorage.getItem(sKey))
                );
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

        localStorage.setItem('partList_' + payload.id, JSON.stringify(payload));

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
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
