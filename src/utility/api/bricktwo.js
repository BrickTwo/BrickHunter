const axios = require('axios');

export default {
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
        sortDirection,
        showAll,
        itemNumbers = null
    ) {
        if (!keyword) {
            keyword = '';
        }
        if (categoryId == 9999999) {
            categoryId = '';
        }
        if(showAll) showAll = 1;
        if(!showAll) showAll = 0;

        let response = null;
        
        try {
          response = await axios({
                method: 'post',
                url: `https://brickhunter.bricktwo.net/api/bricks/read.php?page=${page}&limit=${limit}&country=${country}&category=${categoryId}&color=${colorId}&keyword=${keyword}&sortfield=${sortField}&sortdir=${sortDirection}&showall=${showAll}`,
                data: {
                    itemnumbers: itemNumbers
                }
            });
        } catch (err) {}
        return response.data;
    },
    async getBrickAsync(itemNumber, country) {
        let response = null;
        try {
            response = await axios.get(
                `https://brickhunter.bricktwo.net/api/bricks/single/read.php?itemnumber=${itemNumber}&country=${country}`
            );
        } catch (err) {}
        return response?.data;
    },
    async getColorsAsync() {
        let response = null;
        try {
            response = await axios.get(
                `https://brickhunter.bricktwo.net/api/colors/read.php`
            );
        } catch (err) {}
        return response.data;
    },
    async getSyncAsync() {
        let response = null;
        try {
            response = await axios.get(
                `https://brickhunter.bricktwo.net/api/sync/read.php`
            );
        } catch (err) {}
        return response.data;
    },
    prepareSendPrice(bricks, country) { //api bricktwo
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
}