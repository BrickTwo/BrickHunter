// initial state
const state = () => ({
    categories: [],
    categoriesFiltered: [],
    favorites: [],
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
        console.log(state.favorites)
    },
    setCategories(state, payload) {
        state.categories = payload;
    },
    setCategoriesFiltered(state, payload) {
        state.categoriesFiltered = payload;

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
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
