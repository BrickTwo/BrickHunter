const axios = require('axios');

export default {
    getBricklink(item) {
        var response = null;
        try {
            response = axios.get(
                `https://www.bricklink.com/r3/catalog/parts/Brick_Round/Cone/product.page?P=${item}`
            );
        } catch (err) {}
        return response;
    },
}