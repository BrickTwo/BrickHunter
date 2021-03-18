// initial state
const state = () => ({
    categories: [],
    categoriesFiltered: [],
    favorites: [],
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
