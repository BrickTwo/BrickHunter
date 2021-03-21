const axios = require('axios');
import store from '@/store';
var activeRequests = 0;
//var absoluteCounter = 0;

export default {
    async throttling() {
        activeRequests++;
        //absoluteCounter++;

        //console.log(absoluteCounter, new Date().toISOString(), 'throttling start', activeRequests);
        await this.sleep(200 * activeRequests);
        activeRequests--;
        //console.log(absoluteCounter, new Date().toISOString(), 'throttling end', activeRequests);
        return;
    },
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    sendPrices(items) {
        if (!items) return;

        let response = null;
        try {
            response = axios.post(
                'https://brickhunter.bricktwo.net/api/bricksandpieces/update.php',
                items
            );
        } catch (err) {}
        return response;
    },
    async getCategoriesAsync(country) {
        let response = null;
        try {
            let url = `https://brickhunter.bricktwo.net/api/categories/read.php?country=${country}`;
            store.commit('addLog', { func: 'getCategoriesAsync', url: url });
            await this.throttling();
            response = await axios.get(url);
            store.commit('addLog', {
                func: 'getCategoriesAsync',
                respStat: response.status,
            });
        } catch (err) {
            store.commit('addLog', { func: 'getCategoriesAsync', err: err });
        }
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
        sortDirection,
        showAll,
        itemNumbers,
        excludedCategories
    ) {
        if (!keyword) {
            keyword = '';
        }
        if (categoryId == 9999999) {
            categoryId = '';
        }
        if (showAll) showAll = 1;
        if (!showAll) showAll = 0;

        let response = null;

        try {
            let url = `https://brickhunter.bricktwo.net/api/bricks/read.php?page=${page}&limit=${limit}&country=${country}&category=${categoryId}&color=${colorId}&keyword=${keyword}&sortfield=${sortField}&sortdir=${sortDirection}&showall=${showAll}&notcategories=${excludedCategories}`;
            store.commit('addLog', { func: 'getBricksAsync', url: url });
            await this.throttling();
            response = await axios({
                method: 'post',
                url: url,
                data: {
                    itemnumbers: itemNumbers,
                },
            });
            store.commit('addLog', {
                func: 'getBricksAsync',
                respStat: response.status,
            });
        } catch (err) {
            store.commit('addLog', { func: 'getBricksAsync', err: err });
        }
        return response.data;
    },
    async getBrickAsync(itemNumber, country) {
        let response = null;
        try {
            let url = `https://brickhunter.bricktwo.net/api/bricks/single/read.php?itemnumber=${itemNumber}&country=${country}`;
            store.commit('addLog', { func: 'getBrickAsync', url: url });
            await this.throttling();
            response = await axios.get(url);
            store.commit('addLog', {
                func: 'getBrickAsync',
                respStat: response.status,
            });
        } catch (err) {
            store.commit('addLog', { func: 'getBrickAsync', err: err });
        }
        return response?.data;
    },
    async getColorsAsync() {
        let response = null;
        try {
            let url = `https://brickhunter.bricktwo.net/api/colors/read.php`;
            store.commit('addLog', { func: 'getColorsAsync', url: url });
            await this.throttling();
            response = await axios.get(url);
            store.commit('addLog', {
                func: 'getColorsAsync',
                respStat: response.status,
            });
        } catch (err) {
            store.commit('addLog', { func: 'getColorsAsync', err: err });
        }
        return response.data;
    },
    async getSyncAsync() {
        let response = null;
        try {
            let url = `https://brickhunter.bricktwo.net/api/sync/read.php`;
            store.commit('addLog', { func: 'getSyncAsync', url: url });
            await this.throttling();
            response = await axios.get(url);
            store.commit('addLog', {
                func: 'getSyncAsync',
                respStat: response.status,
            });
        } catch (err) {
            store.commit('addLog', { func: 'getSyncAsync', err: err });
        }
        return response.data;
    },
    prepareSendPrice(bricks, country) {
        //api bricktwo
        if (!bricks) return null;

        let returnValue = [];

        bricks.forEach((brick) => {
            let value = {
                designId: brick.designId,
                itemNumber: brick.itemNumber,
                priceAmount: brick.price.amount,
                priceCurrency: brick.price.currency,
                maxAmount: brick.maxAmount,
                isAvailable: brick.isAvailable,
                isSoldOut: brick.isSoldOut,
                isIPElement: brick.isIPElement,
                color: brick.color,
                colorFamily: brick.colorFamily,
                description: brick.description,
                imageUrl: brick.imageUrl,
                category: brick.category,
                materialType: brick.materialType,
                country: country,
            };

            returnValue.push(value);
        });

        return returnValue;
    },
};
