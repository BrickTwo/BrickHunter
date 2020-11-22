const APIURL = 'http://api.openweathermap.org';
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
        async getCategoriesAsync(country) {
            var response = await axios.get(
                `https://brickhunter.bricktwo.net/api/categories/read.php?country=${country}`
            );
            return response.data;
        },
        async getBricksAsync(categoryId) {
            var response = await axios.get(
                `https://brickhunter.bricktwo.net/api/bricks/read.php?category=${categoryId}`
            );
            return response.data;
        },
    },
};
