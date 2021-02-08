const axios = require('axios');
export const requestsMixin = {
    methods: {
        getBricklink(item) {
            return axios.get(
                `https://www.bricklink.com/r3/catalog/parts/Brick_Round/Cone/product.page?P=${item}`
            );
        },
        sendPrices(items) {
            if (!items) return;

            return axios.post(
                'https://brickhunter.bricktwo.net/api/bricksandpieces/update.php',
                items
            );
        },
        async getCategoriesAsync() {
            var response = await axios.get(
                `https://brickhunter.bricktwo.net/api/categories/read.php?country=${this.$store.state.country}`
            );
            return response.data;
        },
        async getBricksAsync($page, $limit, categoryId, colorId, keyword, sortField, sortDirection) {
            if(!keyword){
                keyword = '';
            }
            if(categoryId == 9999999){
                categoryId = '';
            }

            var response = await axios.get(
                `https://brickhunter.bricktwo.net/api/bricks/read.php?page=${$page}&limit=${$limit}&country=${this.$store.state.country}&category=${categoryId}&color=${colorId}&keyword=${keyword}&sortfield=${sortField}&sortdir=${sortDirection}`
            );
            return response.data;
        },
        async getBrickAsync($itemNumber) {
            var response = await axios.get(
                `https://brickhunter.bricktwo.net/api/bricks/single/read.php?itemnumber=${$itemNumber}&country=${this.$store.state.country}`
            );
            return response.data;
        },
        async getColorsAsync() {
            var response = await axios.get(
                `https://brickhunter.bricktwo.net/api/colors/read.php`
            );
            return response.data;
        },
        async getSyncAsync() {
            var response = await axios.get(
                `https://brickhunter.bricktwo.net/api/sync/read.php`
            );
            return response.data;
        },
    },
};
