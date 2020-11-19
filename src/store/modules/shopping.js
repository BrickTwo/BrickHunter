// initial state
const state = () => ({
    wantedListPositionsMerged: 0,
    bricksAndPiecesPositions: 0,
    pickABrickPositions: 0,
    brickLinkPositions: 0,
    notAllocatedPositions: 0,
    wantedList: [],
    selectedPrio1: null,
    selectedPrio2: null,
    selectedPrio3: null,
    useHave: null,
    brickAndPiecesList: {},
    pickABrickList: {},
    brickLinkList: {},
    notAllocatedList: {},
    bricksAndPiecesPrice: 0,
    pickABrickPrice: 0,
    brickLinkPrice: 0,
    currency: '',
});

// getters
const getters = {};

// actions
const actions = {};

// mutations
const mutations = {
    initialiseStore(state) {
        state.selectedPrio1 =
            localStorage.getItem('selectedPrio1') || 'bricksAndPieces';
        state.selectedPrio2 =
            localStorage.getItem('selectedPrio2') || 'pickABrick';
        state.selectedPrio3 =
            localStorage.getItem('selectedPrio3') || 'brickLink';
        state.useHave = (localStorage.getItem('useHave') || 'true') === 'true';
    },
    setwantedListPositionsMerged(state, payload) {
        //console.log(payload)
        state.wantedListPositionsMerged = payload;
    },
    setWantedList(state, payload) {
        state.wantedList = payload;
    },
    setSelectedPrio1(state, payload) {
        state.selectedPrio1 = payload;
        localStorage.setItem('selectedPrio1', payload);
    },
    setSelectedPrio2(state, payload) {
        state.selectedPrio2 = payload;
        localStorage.setItem('selectedPrio2', payload);
    },
    setSelectedPrio3(state, payload) {
        state.selectedPrio3 = payload;
        localStorage.setItem('selectedPrio3', payload);
    },
    setUseHave(state, payload) {
        state.useHave = payload;
        localStorage.setItem('useHave', payload);
    },
    addToBricksAndPiecesList(state, payload) {
        var found = state.brickAndPiecesList.find(
            (f) =>
                f.bricksAndPieces.itemNumber ==
                payload.bricksAndPieces.itemNumber
        );

        var qtyForPrice = 0;

        if (found) {
            found.qty = { ...found.qty };
            found.qty.min = parseInt(found.qty.min);
            found.qty.have = parseInt(found.qty.have);
            found.qty.order = parseInt(found.qty.order);
            found.qty.min += parseInt(payload.qty.min);
            found.qty.have += parseInt(payload.qty.have);
            found.qty.order += parseInt(payload.qty.order);
            found.qty.balance = found.qty.min - found.qty.have;

            qtyForPrice = found.qty.order;
            if (qtyForPrice > 200) {
                qtyForPrice = 200;
            }

            if (found.bricksAndPieces.maxAmount < qtyForPrice) {
                qtyForPrice = found.qty.maxAmount;
            }
        } else {
            if (payload.qty.order > 200) {
                payload.qty.order = 200;
            }
            if (payload.bricksAndPieces.maxAmount < payload.qty.order) {
                payload.qty.maxAmount = payload.bricksAndPieces.maxAmount;
            }
            state.brickAndPiecesList.push(JSON.parse(JSON.stringify(payload)));
            state.bricksAndPiecesPositions++;
            state.wantedListPositionsMerged++;

            qtyForPrice = payload.qty.order;
            if (qtyForPrice > 200) {
                qtyForPrice = 200;
            }
            if (payload.bricksAndPieces.maxAmount < qtyForPrice) {
                qtyForPrice = payload.qty.maxAmount;
            }
        }

        state.bricksAndPiecesPrice +=
            qtyForPrice * payload.bricksAndPieces.price.amount;
        state.currency = payload.bricksAndPieces.price.currency;
    },
    clearBricksAndPiecesList(state) {
        state.brickAndPiecesList = [];
        state.bricksAndPiecesPositions = 0;
        state.bricksAndPiecesPrice = 0;
        state.wantedListPositionsMerged =
            state.pickABrickPositions +
            state.brickLinkPositions +
            state.notAllocatedPositions;
    },
    addToPickABrickList(state, payload) {
        var found = state.pickABrickList.find(
            (f) => f.pickABrick.variant.id == payload.pickABrick.variant.id
        );

        var qtyForPrice = 0;

        if (found) {
            var orderSizeBeforeCalculation = found.qty.order;

            found.qty = { ...found.qty };
            found.qty.min = parseInt(found.qty.min);
            found.qty.have = parseInt(found.qty.have);
            found.qty.order = parseInt(found.qty.order);
            found.qty.min += parseInt(payload.qty.min);
            found.qty.have += parseInt(payload.qty.have);
            found.qty.order += parseInt(payload.qty.order);
            found.qty.balance = found.qty.min - found.qty.have;

            qtyForPrice = found.qty.order;
            if (qtyForPrice > 999) {
                qtyForPrice = 999;
            }
            qtyForPrice -= orderSizeBeforeCalculation;
        } else {
            state.pickABrickList.push(JSON.parse(JSON.stringify(payload)));
            state.pickABrickPositions++;
            state.wantedListPositionsMerged++;

            qtyForPrice = payload.qty.order;
            if (qtyForPrice > 999) {
                qtyForPrice = 999;
            }
        }

        state.pickABrickPrice +=
            (qtyForPrice * payload.pickABrick.variant.price.centAmount) / 100;
        state.currency = payload.pickABrick.variant.price.currencyCode;
    },
    clearPickABrickList(state) {
        state.pickABrickList = [];
        state.pickABrickPositions = 0;
        state.pickABrickPrice = 0;
        state.wantedListPositionsMerged =
            state.bricksAndPiecesPositions +
            state.brickLinkPositions +
            state.notAllocatedPositions;
    },
    addToBrickLinkList(state, payload) {
        var found = state.brickLinkList.find(
            (f) =>
                f.itemid == payload.itemid &&
                f.color.brickLinkId == payload.color.brickLinkId
        );

        if (found) {
            found.qty = { ...found.qty };
            found.qty.min = parseInt(found.qty.min);
            found.qty.have = parseInt(found.qty.have);
            found.qty.order = parseInt(found.qty.order);
            found.qty.min += parseInt(payload.qty.min);
            found.qty.have += parseInt(payload.qty.have);
            found.qty.order += parseInt(payload.qty.order);
            found.qty.balance = found.qty.min - found.qty.have;
        } else {
            state.brickLinkList.push(JSON.parse(JSON.stringify(payload)));
            state.brickLinkPositions++;
            state.wantedListPositionsMerged++;
        }

        var price = 0;
        if (payload.brickLink?.wantedList?.maxprice)
            price = payload.brickLink?.wantedList?.maxprice;
        if (price < 0) price = 0;
        state.brickLinkPrice = payload.qty.order * price;
    },
    clearBrickLinkList(state) {
        state.brickLinkList = [];
        state.brickLinkPositions = 0;
        state.brickLinkPrice = 0;
        state.wantedListPositionsMerged =
            state.bricksAndPiecesPositions +
            state.pickABrickPositions +
            state.notAllocatedPositions;
    },
    addToNotAllocatedList(state, payload) {
        var found = state.notAllocatedList.find(
            (f) =>
                f.itemid == payload.itemid &&
                f.color.brickLinkId == payload.color.brickLinkId
        );

        if (found) {
            found.qty = { ...found.qty };
            found.qty.min = parseInt(found.qty.min);
            found.qty.have = parseInt(found.qty.have);
            found.qty.order = parseInt(found.qty.order);
            found.qty.min += parseInt(payload.qty.min);
            found.qty.have += parseInt(payload.qty.have);
            found.qty.order += parseInt(payload.qty.order);
            found.qty.balance = found.qty.min - found.qty.have;
        } else {
            state.notAllocatedList.push(JSON.parse(JSON.stringify(payload)));
            state.notAllocatedPositions++;
            state.wantedListPositionsMerged++;
        }
    },
    clearNotallocatedList(state) {
        state.notAllocatedList = [];
        state.notAllocatedPositions = 0;
        state.wantedListPositionsMerged =
            state.bricksAndPiecesPositions +
            state.pickABrickPositions +
            state.brickLinkPositions;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
