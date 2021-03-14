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
    async initialiseStore({ state }, oldVersion) {
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
            await state.partLists.map((partList) => {
                partList.version = '1.0';
                //idb.savePartList(partList);
                //localStorage.removeItem('partList_' + partList.id);
            });
        }

        /*let partLists = await idb.getPartLists();
        partLists.map((partList) => {
            state.partLists.push(partList);
            localStorage.setItem('partList_' + partList.id, JSON.stringify(partList));
            if (!state.partLists.find((f) => f.id === partList.id))
                state.partLists.push(partList);
        });

        state.partLists.sort((a, b) => {
            if (a.name.toUpperCase() > b.name.toUpperCase()) {
                return 1;
            } else {
                return -1;
            }
        });*/

        //console.log(state.partLists)

        state.totalPositions = 0;
        state.partLists.map((partList) => {
            state.totalPositions += partList.positions.length;
        });
    },
};

// mutations
const mutations = {
    async setPartList(state, payload) {
        var found = state.partLists.find(
            (partList) => partList.id === payload.id
        );

        if (found) {
            found = payload;
        } else {
            state.partLists.push(payload);
        }

        //localStorage.setItem('partList_' + payload.id, JSON.stringify(payload));
        //await idb.savePartList(payload);

        state.totalPositions = 0;
        state.partLists.map((partList) => {
            state.totalPositions += partList.positions.length;
        });
    },
    async deletePartList(state, partListId) {
        state.partLists = state.partLists.filter(
            (partList) => partList.id != partListId
        );

        //localStorage.removeItem('partList_' + partListId);
        //await idb.deletePartList(partListId);

        state.totalPositions = 0;
        state.partLists.map((partList) => {
            state.totalPositions += partList.positions.length;
        });
    },
    async addToPartList(state, payload) {
        var found = state.partLists.find(
            (partList) => partList.id === payload.id
        );
        if (!found) return;

        found.positions.push(payload.part);
        found.date = new Date(0, 0, 0, 0, 0, 0, 0);

        //localStorage.setItem('partList_' + payload.id, JSON.stringify(found));
        //await idb.savePartList(found);

        state.totalPositions = 0;
        state.partLists.map((partList) => {
            state.totalPositions += partList.positions.length;
        });
    },
};

//const plugins = [persistencePlugin];

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
    //plugins,
};
