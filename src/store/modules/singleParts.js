// initial state
const state = () => ({
    categories: [],
    categoriesFiltered: [],
});

// getters
const getters = {
    getCategoryById: (state) => (id) => {
        return state.categories.find((category) => category.id === id);
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
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
