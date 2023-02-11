import version from '@/utility/version.js';

// initial state
const state = () => ({
    notAllocatedPositions: 0,
    wantedList: [],
    brickAndPiecesList: {},
    pickABrickList: {},
    brickLinkList: {},
    notAllocatedList: {},
    currency: '',
    settings: {},
});

// getters
const getters = {
    getBricksAndPiecesPositions: (state) => () => {
        return state.brickAndPiecesList.length;
    },
    getBricksAndPiecesBrickAmount: (state) => () => {
        let amount = 0;
        state.brickAndPiecesList.map((pos) => {
            amount += pos.qty.order;
        });
        return amount;
    },
    getBricksAndPiecesTotalPrice: (state) => () => {
        let price = 0;
        state.brickAndPiecesList.map((pos) => {
            price += pos.qty.order * pos.bricksAndPieces.price.amount;
        });
        return price;
    },

    getPickABrickPositions: (state) => () => {
        return state.pickABrickList.length;
    },
    getPickABrickBrickAmount: (state) => () => {
        let amount = 0;
        state.pickABrickList.map((pos) => {
            amount += pos.qty.order;
        });
        return amount;
    },
    getPickABrickTotalPrice: (state) => () => {
        let price = 0;
        state.pickABrickList.map((pos) => {
            price +=
                (pos.qty.order * pos.pickABrick.variant.price.centAmount) / 100;
        });
        return price;
    },

    getBrickLinkPositions: (state) => () => {
        return state.brickLinkList.length;
    },
    getBrickLinkBrickAmount: (state) => () => {
        let amount = 0;
        state.brickLinkList.map((pos) => {
            amount += pos.qty.order;
        });
        return amount;
    },
    getBrickLinkTotalPrice: (state) => () => {
        let returnPrice = 0;
        state.brickLinkList.map((pos) => {
            var price = 0;
            if (pos.brickLink?.wantedList?.maxprice)
                price = pos.brickLink?.wantedList?.maxprice;
            if (price < 0) price = 0;
            returnPrice += pos.qty.order * price;
        });
        return returnPrice;
    },

    getNotAllocatedPositions: (state) => () => {
        return state.notAllocatedList.length;
    },
    getNotAllocatedBrickAmount: (state) => () => {
        let amount = 0;
        state.notAllocatedList.map((pos) => {
            amount += pos.qty.order;
        });
        return amount;
    },
};

// actions
const actions = {};

// mutations
const mutations = {
    initialiseStore(state, oldVersion) {
        if (version.isSmaller(oldVersion, '1.4.2')) {
            state.settings.selectedPrio1 =
                localStorage.getItem('selectedPrio1') || 'bricksAndPieces';
            state.settings.selectedPrio2 =
                localStorage.getItem('selectedPrio2') || 'pickABrick';
            state.settings.selectedPrio3 =
                localStorage.getItem('selectedPrio3') || 'brickLink';
            state.settings.useHave =
                (localStorage.getItem('useHave') || 'true') === 'true';
            state.settings.setwantedListPositionsMerged = false;

            localStorage.setItem(
                'settingsShopping',
                JSON.stringify(state.settings)
            );
        }

        state.settings = JSON.parse(
            localStorage.getItem('settingsShopping')
        ) || {
            selectedPrio1: 'bricksAndPieces',
            selectedPrio2: 'pickABrick',
            selectedPrio3: 'brickLink',
            useHave: true,
            ignoreBrickLinkPrice: false,
            subtractBrickLinkPrice: false,
            subtractBrickLinkPriceAmount: 0.0,
            subtractBrickLinkPriceUnit: 'absolute',
        };

        if (!state.settings.selectedPrio1)
            state.settings.selectedPrio1 = 'bricksAndPieces';
        if (!state.settings.selectedPrio2)
            state.settings.selectedPrio2 = 'pickABrick';
        if (!state.settings.selectedPrio3)
            state.settings.selectedPrio3 = 'brickLink';
        if (!state.settings.useHave) state.settings.useHave = true;
        if (!state.settings.ignoreBrickLinkPrice)
            state.settings.ignoreBrickLinkPrice = false;
        if (!state.settings.subtractBrickLinkPrice)
            state.settings.subtractBrickLinkPrice = false;
        if (!state.settings.subtractBrickLinkPriceAmount)
            state.settings.subtractBrickLinkPriceAmount = 0.0;
        if (!state.settings.subtractBrickLinkPriceUnit)
            state.settings.subtractBrickLinkPriceUnit = 'absolute';
    },
    setWantedList(state, payload) {
        state.wantedList = payload;
    },
    setSelectedPrio1(state, payload) {
        state.settings.selectedPrio1 = payload;
        localStorage.setItem(
            'settingsShopping',
            JSON.stringify(state.settings)
        );
    },
    setSelectedPrio2(state, payload) {
        state.settings.selectedPrio2 = payload;
        localStorage.setItem(
            'settingsShopping',
            JSON.stringify(state.settings)
        );
    },
    setSelectedPrio3(state, payload) {
        state.settings.selectedPrio3 = payload;
        localStorage.setItem(
            'settingsShopping',
            JSON.stringify(state.settings)
        );
    },
    setUseHave(state, payload) {
        state.settings.useHave = payload;
        localStorage.setItem(
            'settingsShopping',
            JSON.stringify(state.settings)
        );
    },
    setIgnoreBrickLinkPrice(state, payload) {
        state.settings.ignoreBrickLinkPrice = payload;
        localStorage.setItem(
            'settingsShopping',
            JSON.stringify(state.settings)
        );
    },
    setSubtractBrickLinkPrice(state, payload) {
        state.settings.subtractBrickLinkPrice = payload;
        localStorage.setItem(
            'settingsShopping',
            JSON.stringify(state.settings)
        );
    },
    setSubtractBrickLinkPriceAmount(state, payload) {
        state.settings.subtractBrickLinkPriceAmount = payload;
        localStorage.setItem(
            'settingsShopping',
            JSON.stringify(state.settings)
        );
    },
    setSubtractBrickLinkPriceUnit(state, payload) {
        state.settings.subtractBrickLinkPriceUnit = payload;
        localStorage.setItem(
            'settingsShopping',
            JSON.stringify(state.settings)
        );
    },
    addToBricksAndPiecesList(state, payload) {
        var found = state.brickAndPiecesList.find(
            (f) =>
                f.bricksAndPieces.itemNumber ==
                payload.bricksAndPieces.itemNumber
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

            payload.qty.order = found.qty.order;
            if (payload.qty.order > 200) {
                payload.qty.order = 200;
            }

            if (found.bricksAndPieces.maxAmount < payload.qty.order) {
                payload.qty.order = found.qty.maxAmount;
            }
        } else {
            if (payload.qty.order > 200) {
                payload.qty.order = 200;
            }
            if (payload.bricksAndPieces.maxAmount < payload.qty.order) {
                payload.qty.maxAmount = payload.bricksAndPieces.maxAmount;
            }
            state.brickAndPiecesList.push(JSON.parse(JSON.stringify(payload)));
        }
        state.currency = payload.bricksAndPieces.price.currency;
    },
    clearBricksAndPiecesList(state) {
        state.brickAndPiecesList = [];
        state.qtyForPrice = 0;
    },
    addToPickABrickList(state, payload) {
        var found = state.pickABrickList.find(
            (f) => f.pickABrick.variant.id == payload.pickABrick.variant.id
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

            if (found.qty.order > 999) {
                found.qty.order = 999;
            }

            if (found.pickABrick.variant.attributes.maxOrderQuantity < payload.qty.order) {
                payload.qty.order = found.qty.maxAmount;
            }
        } else {
            if (payload.qty.order > 999) {
                payload.qty.order = 999;
            }
            if (payload.pickABrick.variant.attributes.maxOrderQuantity < payload.qty.order) {
                payload.qty.maxAmount = payload.pickABrick.variant.attributes.maxOrderQuantity;
                payload.qty.order = payload.qty.maxAmount;
            }
            state.pickABrickList.push(JSON.parse(JSON.stringify(payload)));
        }
        state.currency = payload.pickABrick.variant.price.currencyCode;
    },
    clearPickABrickList(state) {
        state.pickABrickList = [];
    },
    addToBrickLinkList(state, payload) {
        var found = state.brickLinkList.find((f) => {
            if (payload.color?.id == 1) {
                return (
                    f.designId == payload.designId &&
                    f.color.legoName == payload.color.legoName
                );
            } else {
                return (
                    f.designId == payload.designId &&
                    f.color.brickLinkId == payload.color.brickLinkId
                );
            }
        });

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
        }
    },
    clearBrickLinkList(state) {
        state.brickLinkList = [];
    },
    addToNotAllocatedList(state, payload) {
        var found = state.notAllocatedList.find((f) => {
            if (payload.color.id == 1) {
                return (
                    f.designId == payload.designId &&
                    f.color.legoName == payload.color.legoName
                );
            } else {
                return (
                    f.designId == payload.designId &&
                    f.color.brickLinkId == payload.color.brickLinkId
                );
            }
        });

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
        }
    },
    clearNotallocatedList(state) {
        state.notAllocatedList = [];
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
