import apiBrickTwo from '@/utility/api/bricktwo.js';
import { bus } from '@/utility/bus';

// initial state
const state = () => ({
    categories: [],
    categoriesFiltered: [],
    favorites: [],
    haveIts: [],
    notificationDesignIds: [],
    notificationItemNumbers: [],
    filter: {},
    notificationChatId: null,
    time: new Date(Date.now())
});

// getters
const getters = {
    getCategoryById: (state) => (id) => {
        return state.categories.find((category) => category.id == id);
    },
    isFavorite: (state) => (itemNumber) => {
        return state.favorites.indexOf(parseInt(itemNumber)) != -1;
    },
    isHaveIt: (state) => (itemNumber) => {
        return state.haveIts.indexOf(parseInt(itemNumber)) != -1;
    },
    isNotificationDesignId: (state) => (designId) => {
        return state.notificationDesignIds.indexOf(parseInt(designId)) != -1;
    },
    isNotificationItemNumber: (state) => (itemNumber) => {
        return (
            state.notificationItemNumbers.indexOf(parseInt(itemNumber)) != -1
        );
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
            showNotifications: false,
            showPartListId: '',
            excludedCategories: [],
            selectCategoriesToBeHidden: true,
        };

        state.notificationChatId = window.localStorage.getItem(
            'notificationChatId'
        );

        if (state.notificationChatId) {
            apiBrickTwo
                .getSubscriptions(state.notificationChatId)
                .then((result) => {
                    if (result.DesignId) {
                        result.DesignId.forEach((d) => {
                            state.notificationDesignIds.push(parseInt(d));
                        });
                    }
                    if (result.ItemNumber) {
                        result.ItemNumber.forEach((i) => {
                            state.notificationItemNumbers.push(parseInt(i));
                        });
                    }
                    bus.$emit('notificationInitialized', true);
                });
        } else {
            bus.$emit('notificationInitialized', true);
        }
    },
    setCategories(state, payload) {
        state.categories = payload;
    },
    setCategoriesFiltered(state, payload) {
        state.categoriesFiltered = payload;

        if (!state.categoriesFiltered) state.categoriesFiltered = [];

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
            showNotifications: payload.showNotifications,
            showPartListId: payload.showPartListId,
            excludedCategories: payload.excludedCategories,
            selectCategoriesToBeHidden: payload.selectCategoriesToBeHidden,
        };

        localStorage.setItem('filterSingleParts', JSON.stringify(state.filter));
    },
    setNotificationChatId(state, chatId) {
        if(state.notificationChatId == chatId) return;
        state.notificationChatId = chatId;
        localStorage.setItem('notificationChatId', state.notificationChatId);

        /*state.notificationDesignIds = [];
        state.notificationItemNumbers = [];

        if (state.notificationChatId) {
            apiBrickTwo
                .getSubscriptions(state.notificationChatId)
                .then((result) => {
                    if (result.DesignId) {
                        result.DesignId.forEach((d) => {
                            state.notificationDesignIds.push(parseInt(d));
                        });
                    }
                    if (result.ItemNumber) {
                        result.ItemNumber.forEach((i) => {
                            state.notificationItemNumbers.push(parseInt(i));
                        });
                    }
                });
        }*/
    },
    setNotificationDesignId(state, payload) {
        state.notificationDesignIds = [];
        if (payload) {
            payload.forEach((d) => {
                state.notificationDesignIds.push(parseInt(d));
            });
        }
        apiBrickTwo.setSubscriptions(
            state.notificationChatId,
            state.notificationItemNumbers,
            state.notificationDesignIds
        );
        console.log(state.notificationDesignIds)
        //localStorage.setItem('haveIts', JSON.stringify(state.haveIts));
    },
    addNotificationDesignId(state, itemNumber) {
        if (state.notificationDesignIds.indexOf(parseInt(itemNumber)) != -1)
            return;
        state.notificationDesignIds.push(parseInt(itemNumber));
        apiBrickTwo.setSubscriptions(
            state.notificationChatId,
            state.notificationItemNumbers,
            state.notificationDesignIds
        );
        //localStorage.setItem('haveIts', JSON.stringify(state.haveIts));
    },
    removeNotificationDesignId(state, itemNumber) {
        var index = state.notificationDesignIds.findIndex((f) => {
            return f == itemNumber;
        });
        if (index >= 0) {
            state.notificationDesignIds.splice(index, 1);
        }
        apiBrickTwo.setSubscriptions(
            state.notificationChatId,
            state.notificationItemNumbers,
            state.notificationDesignIds
        );
        //localStorage.setItem('haveIts', JSON.stringify(state.haveIts));
    },
    setNotificationItemNumber(state, payload) {
        state.notificationItemNumbers = [];
        if (payload) {
            payload.forEach((i) => {
                state.notificationItemNumbers.push(parseInt(i));
            });
        }
        apiBrickTwo.setSubscriptions(
            state.notificationChatId,
            state.notificationItemNumbers,
            state.notificationDesignIds
        );
        //localStorage.setItem('haveIts', JSON.stringify(state.haveIts));
    },
    addNotificationItemNumber(state, itemNumber) {
        if (state.notificationItemNumbers.indexOf(parseInt(itemNumber)) != -1)
            return;
        state.notificationItemNumbers.push(parseInt(itemNumber));
        apiBrickTwo.setSubscriptions(
            state.notificationChatId,
            state.notificationItemNumbers,
            state.notificationDesignIds
        );
        //localStorage.setItem('haveIts', JSON.stringify(state.haveIts));
    },
    removeNotificationItemNumber(state, itemNumber) {
        var index = state.notificationItemNumbers.findIndex((f) => {
            return f == itemNumber;
        });
        if (index >= 0) {
            state.notificationItemNumbers.splice(index, 1);
        }
        apiBrickTwo.setSubscriptions(
            state.notificationChatId,
            state.notificationItemNumbers,
            state.notificationDesignIds
        );
        //localStorage.setItem('haveIts', JSON.stringify(state.haveIts));
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
