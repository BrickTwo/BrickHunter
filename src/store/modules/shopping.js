// initial state
const state = () => ({
    wantedListPositionsMerged: 0,
    bricksAndPiecesPositions: 0,
    pickABrickPositions: 0,
    brickLinkPositions: 0,
    wantedList: [],
    selectedPrio1: null,
    selectedPrio2: null,
    selectedPrio3: null,
    useHave: null,
    brickAndPiecesList: {},
    pickABrickList: {},
    brickLinkList: {},
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
    incrementBricksAndPiecesPositions(state) {
        state.bricksAndPiecesPositions++;
    },
    incrementPickABrickPositions(state) {
        state.pickABrickPositions++;
    },
    incrementBrickLinkPositions(state) {
        state.brickLinkPositions++;
    },
    resetBricksAndPiecesPositions(state) {
        state.bricksAndPiecesPositions = 0;
    },
    resetPickABrickPositions(state) {
        state.pickABrickPositions = 0;
    },
    resetBrickLinkPositions(state) {
        state.brickLinkPositions = 0;
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
        state.brickAndPiecesList.push(payload);
    },
    clearBricksAndPiecesList(state, payload) {
        state.brickAndPiecesList = [];
    },
    addToPickABrickList(state, payload) {
        state.pickABrickList.push(payload);
    },
    clearPickABrickList(state, payload) {
        state.pickABrickList = [];
    },
    addToBrickLinkList(state, payload) {
        state.brickLinkList.push(payload);
    },
    clearBrickLinkList(state, payload) {
        state.brickLinkList = [];
    },
    setBricksAndPiecesPrice(state, payload) {
        state.bricksAndPiecesPrice = payload;
    },
    setPickABrickPrice(state, payload) {
        state.pickABrickPrice = payload;
    },
    setbrickLinkPrice(state, payload) {
        state.brickLinkPrice = payload;
    },
    incrementBricksAndPiecesPrice(state, payload) {
        state.bricksAndPiecesPrice += payload;
    },
    incrementPickABrickPrice(state, payload) {
        state.pickABrickPrice += payload;
    },
    incrementbrickLinkPrice(state, payload) {
        state.brickLinkPrice += payload;
    },
    setCurrency(state, payload) {
        state.currency = payload;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
