const axios = require('axios');
export const requestsMixin = {
    methods: {
        getBricklink(item) {
            var response = null;
            try {
                response = axios.get(
                    `https://www.bricklink.com/r3/catalog/parts/Brick_Round/Cone/product.page?P=${item}`
                );
            } catch (err) {}
            return response;
        },
        sendPrices(items) {
            if (!items) return;

            var response = null;
            try {
                response = axios.post(
                    'https://brickhunter.bricktwo.net/api/bricksandpieces/update.php',
                    items
                );
            } catch (err) {}
            return response;
        },
        async getCategoriesAsync() {
            var response = null;
            try {
                response = await axios.get(
                    `https://brickhunter.bricktwo.net/api/categories/read.php?country=${this.$store.state.country}`
                );
            } catch (err) {}
            return response.data;
        },
        async getBricksAsync(
            $page,
            $limit,
            categoryId,
            colorId,
            keyword,
            sortField,
            sortDirection
        ) {
            if (!keyword) {
                keyword = '';
            }
            if (categoryId == 9999999) {
                categoryId = '';
            }

            var response = null;
            try {
                response = await axios.get(
                    `https://brickhunter.bricktwo.net/api/bricks/read.php?page=${$page}&limit=${$limit}&country=${this.$store.state.country}&category=${categoryId}&color=${colorId}&keyword=${keyword}&sortfield=${sortField}&sortdir=${sortDirection}`
                );
            } catch (err) {}
            return response.data;
        },
        async getBrickAsync($itemNumber) {
            var response = null;
            try {
                response = await axios.get(
                    `https://brickhunter.bricktwo.net/api/bricks/single/read.php?itemnumber=${$itemNumber}&country=${this.$store.state.country}`
                );
            } catch (err) {}
            return response?.data;
        },
        async getColorsAsync() {
            var response = null;
            try {
                response = await axios.get(
                    `https://brickhunter.bricktwo.net/api/colors/read.php`
                );
            } catch (err) {}
            return response.data;
        },
        async getSyncAsync() {
            var response = null;
            try {
                response = await axios.get(
                    `https://brickhunter.bricktwo.net/api/sync/read.php`
                );
            } catch (err) {}
            return response.data;
        },
    },
};
