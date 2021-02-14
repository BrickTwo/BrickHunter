import version from '../../function/version.js'

// initial state
const state = () => ({
    wantedListPositionsMerged: 0,
    bricksAndPiecesPositions: 0,
    pickABrickPositions: 0,
    brickLinkPositions: 0,
    notAllocatedPositions: 0,
    wantedList: [],
    brickAndPiecesList: {},
    pickABrickList: {},
    brickLinkList: {},
    notAllocatedList: {},
    bricksAndPiecesPrice: 0,
    pickABrickPrice: 0,
    brickLinkPrice: 0,
    currency: '',
    settings: {},
});

// getters
const getters = {};

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
    setwantedListPositionsMerged(state, payload) {
        //console.log(payload)
        state.wantedListPositionsMerged = payload;
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
        var found = state.brickLinkList.find((f) => {
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
            state.brickLinkList.push(JSON.parse(JSON.stringify(payload)));
            state.brickLinkPositions++;
            state.wantedListPositionsMerged++;
        }

        var price = 0;
        if (payload.brickLink?.wantedList?.maxprice)
            price = payload.brickLink?.wantedList?.maxprice;
        if (price < 0) price = 0;
        state.brickLinkPrice += payload.qty.order * price;
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
