// initial state
const state = () => ({
    categories: [],
    categoriesFiltered: [],
    favorites: [],
    haveIts: [],
    filter: {},
});

// getters
const getters = {
    getCategoryById: (state) => (id) => {
        return state.categories.find((category) => category.id === id);
    },
    isFavorite: (state) => (itemNumber) => {
        return state.favorites.indexOf(parseInt(itemNumber)) != -1;
    },
    isHaveIt: (state) => (itemNumber) => {
        return state.haveIts.indexOf(parseInt(itemNumber)) != -1;
    },
};

// actions
const actions = {};

// mutations
const mutations = {
    initialiseStore(state) {
        var category = {
            id: 9999999,
            name: 'All',
            quantity: state.categoriesFiltered.reduce(
                (a, b) => a + (parseInt(b['quantity']) || 0),
                0
            ),
        };

        state.categoriesFiltered.unshift(category);

        let favorites = JSON.parse(window.localStorage.getItem('favorites'));
        if (favorites) {
            state.favorites = favorites;
        }

        let haveIts = JSON.parse(window.localStorage.getItem('haveIts'));
        if (haveIts) {
            state.haveIts = haveIts;
        }

        state.filter = JSON.parse(
            localStorage.getItem('filterSingleParts')
        ) || {
            page: 1,
            limit: 24,
            categoryId: 9999999,
            colorId: 'all',
            keyword: '',
            sortField: 'DESCRIPTION',
            sortDirection: 'ASC',
            showAll: 0,
            showFavorites: false,
            showHaveIts: false,
            showPartListId: '',
            excludedCategories: [],
            selectCategoriesToBeHidden: true,
        };
    },
    setCategories(state, payload) {
        state.categories = payload;
    },
    setCategoriesFiltered(state, payload) {
        state.categoriesFiltered = payload;

        if(!state.categoriesFiltered) state.categoriesFiltered = [];

        var category = {
            id: 9999999,
            name: 'All',
            quantity: state.categoriesFiltered.reduce(
                (a, b) => a + (parseInt(b['quantity']) || 0),
                0
            ),
        };

        state.categoriesFiltered.unshift(category);
    },
    setFavorites(state, payload) {
        state.favorites = payload;
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    addFavorite(state, itemNumber) {
        if (state.favorites.indexOf(parseInt(itemNumber)) != -1) return;
        state.favorites.push(parseInt(itemNumber));
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    removeFavorite(state, itemNumber) {
        var index = state.favorites.findIndex((f) => {
            return f == itemNumber;
        });
        if (index >= 0) {
            state.favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    setHaveIts(state, payload) {
        state.haveIts = payload;
        localStorage.setItem('haveIts', JSON.stringify(state.haveIts));
    },
    addHaveIt(state, itemNumber) {
        if (state.haveIts.indexOf(parseInt(itemNumber)) != -1) return;
        state.haveIts.push(parseInt(itemNumber));
        localStorage.setItem('haveIts', JSON.stringify(state.haveIts));
    },
    removeHaveIt(state, itemNumber) {
        var index = state.haveIts.findIndex((f) => {
            return f == itemNumber;
        });
        if (index >= 0) {
            state.haveIts.splice(index, 1);
        }
        localStorage.setItem('haveIts', JSON.stringify(state.haveIts));
    },
    setFilter(state, payload) {
        state.filter = {
            page: payload.page,
            limit: payload.limit,
            categoryId: payload.categoryId,
            colorId: payload.colorId,
            keyword: payload.keyword,
            sortField: payload.sortField,
            sortDirection: payload.sortDirection,
            showAll: payload.showAll,
            showFavorites: payload.showFavorites,
            showHaveIts: payload.showHaveIts,
            showPartListId: payload.showPartListId,
            excludedCategories: payload.excludedCategories,
            selectCategoriesToBeHidden: payload.selectCategoriesToBeHidden,
        };

        localStorage.setItem('filterSingleParts', JSON.stringify(state.filter));
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
