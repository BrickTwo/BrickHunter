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
            if(!items) return;
            
            return axios.post(
                'https://brickhunter.bricktwo.net/api/userbricks.php',
                items
            );
        },
    },
};
