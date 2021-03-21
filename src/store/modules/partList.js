import version from '@/utility/version';

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
    getPartListsBySource: (state) => (source) => {
        return state.partLists.filter((partList) => partList.source === source);
    },
};

// actions
const actions = {
    initialiseStore({ state, commit }, oldVersion) {
        if (version.isSmaller(oldVersion, '1.5.4')) {
            let sKey;
            for (var i = 0; (sKey = window.localStorage.key(i)); i++) {
                if (sKey.startsWith('partList_')) {
                    state.partLists.push(
                        JSON.parse(window.localStorage.getItem(sKey))
                    );
                }
            }
        }

        if (version.isSmaller(oldVersion, '1.1.9')) {
            state.partLists.map((partList) => {
                var positions = [];
                partList.positions.map((item) => {
                    var part = {};

                    part.source = 'brickLink';
                    part.designId = item.designId;
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
                localStorage.setItem(
                    'partList_' + partList.id,
                    JSON.stringify(partList)
                );
            });
        }

        if (version.isSmaller(oldVersion, '1.1.13')) {
            state.partLists.map((partList) => {
                partList.source = partList.positions[0].source;
                localStorage.setItem(
                    'partList_' + partList.id,
                    JSON.stringify(partList)
                );
            });
        }

        if (version.isSmaller(oldVersion, '1.4.5')) {
            state.partLists.map((partList) => {
                if (partList.source == 'singleParts') {
                    partList.positions.map((pos) => {
                        pos.itemNumber = pos.itemid;
                        pos.designId = pos.searchids[0];
                        delete pos.itemid;
                    });
                } else {
                    partList.positions.map((pos) => {
                        pos.designId = pos.itemid;
                        delete pos.itemid;
                    });
                }
                localStorage.setItem(
                    'partList_' + partList.id,
                    JSON.stringify(partList)
                );
            });
        }

        if (version.isSmaller(oldVersion, '1.5.4')) {
            state.partLists.map((partList) => {
                partList.version = '1.0';
                //localStorage.removeItem('partList_' + partList.id);
            });
        }

        state.totalPositions = 0;
        state.partLists.map((partList) => {
            state.totalPositions += partList.positions.length;
        });

        if (state.partLists.length > 0)
            commit('setPartList', state.partLists[0]);
    },
};

// mutations
const mutations = {
    setPartList(state, payload) {
        console.log(2);
        var found = state.partLists.find(
            (partList) => partList.id === payload.id
        );

        if (found) {
            state.partLists = state.partLists.filter(
                (partList) => partList.id != payload.id
            );
        }

        state.partLists.push(payload);

        //localStorage.setItem('partList_' + payload.id, JSON.stringify(payload));

        state.totalPositions = 0;
        state.partLists.map((partList) => {
            state.totalPositions += partList.positions.length;
        });
    },
    deletePartList(state, partListId) {
        state.partLists = state.partLists.filter(
            (partList) => partList.id != partListId
        );

        //localStorage.removeItem('partList_' + partListId);

        state.totalPositions = 0;
        state.partLists.map((partList) => {
            state.totalPositions += partList.positions.length;
        });
    },
    addToPartList(state, payload) {
        var found = state.partLists.find(
            (partList) => partList.id === payload.id
        );
        if (!found) return;

        found.positions.push(payload.part);
        found.date = new Date(0, 0, 0, 0, 0, 0, 0);

        //localStorage.setItem('partList_' + payload.id, JSON.stringify(found));

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
