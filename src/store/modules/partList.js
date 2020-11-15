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
    initialiseStore(state, oldVersion) {
        var sKey;

        for (var i = 0; (sKey = window.localStorage.key(i)); i++) {
            if (sKey.startsWith('partList_')) {
                state.partLists.push(
                    JSON.parse(window.localStorage.getItem(sKey))
                );
            }
        }

        if (oldVersion < '1.1.8') {
            state.partLists.map((partList) => {
                var positions = [];
                partList.positions.map((item) => {
                    var part = {};

                    part.source = 'brickLink';
                    part.itemid = item.itemid;
                    part.searchids = item.searchids;
                    part.color = item.color;
                    part.qty = item.qty;
                    part.bricksAndPieces = item.bricksAndPieces;
                    part.pickABrick = item.pickABrick;
                    part.brickLink = {};
                    part.brickLink.strAltNo = item.brickLink?.strAltNo;
                    part.brickLink.mapPCCs = item.brickLink?.mapPCCs;
                    part.brickLink.wantedList = {};
                    part.brickLink.wantedList.itemtype = item.itemtype;
                    part.brickLink.wantedList.maxprice = item.maxprice;
                    part.brickLink.wantedList.condition = item.condition;
                    part.brickLink.wantedList.notify = item.notify;

                    part.image = {
                        source: 'brickLink',
                        rsc: item.image,
                    };

                    positions.push(part);
                });
                partList.positions = positions;
                localStorage.setItem('partList_' + partList.id, JSON.stringify(partList));
            });
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
