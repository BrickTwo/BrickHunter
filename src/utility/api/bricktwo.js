const axios = require('axios');

export default {
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
    async getCategoriesAsync(country) {
        var response = null;
        try {
            response = await axios.get(
                `https://brickhunter.bricktwo.net/api/categories/read.php?country=${country}`
            );
        } catch (err) {}
        return response.data;
    },
    async getBricksAsync(
        page,
        limit,
        country,
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
                `https://brickhunter.bricktwo.net/api/bricks/read.php?page=${page}&limit=${limit}&country=${country}&category=${categoryId}&color=${colorId}&keyword=${keyword}&sortfield=${sortField}&sortdir=${sortDirection}`
            );
        } catch (err) {}
        return response.data;
    },
    async getBrickAsync(itemNumber, country) {
        var response = null;
        try {
            response = await axios.get(
                `https://brickhunter.bricktwo.net/api/bricks/single/read.php?itemnumber=${itemNumber}&country=${country}`
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
}