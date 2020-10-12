<template>
    <div>
        <b-nav tabs>
            <b-nav-item
                :active="page == 'settings'"
                @click="page = 'settings'"
                >{{ tabSettings }}</b-nav-item
            >
            <b-nav-item
                :active="page == 'overview'"
                @click="page = 'overview'"
                >{{ tabOverview }}</b-nav-item
            >
            <b-nav-item
                :active="page == 'bricksAndPieces'"
                @click="page = 'bricksAndPieces'"
                v-if="
                    selectedPrio1 == 'bricksAndPieces' ||
                        selectedPrio2 == 'bricksAndPieces' ||
                        selectedPrio3 == 'bricksAndPieces'
                "
                >{{ bricksAndPieces }} ({{
                    bricksAndPiecesPositions
                }})</b-nav-item
            >
            <b-nav-item
                :active="page == 'pickABrick'"
                @click="page = 'pickABrick'"
                v-if="
                    selectedPrio1 == 'pickABrick' ||
                        selectedPrio2 == 'pickABrick' ||
                        selectedPrio3 == 'pickABrick'
                "
                >{{ pickABrick }} ({{ pickABrickPositions }})</b-nav-item
            >

            <b-nav-item
                :active="page == 'brickLink'"
                @click="page = 'brickLink'"
                v-if="
                    selectedPrio1 == 'brickLink' ||
                        selectedPrio2 == 'brickLink' ||
                        selectedPrio3 == 'brickLink'
                "
                >{{ brickLink }} ({{ brickLinkPositions }})</b-nav-item
            >
        </b-nav>
        <div v-if="page == 'settings'">
            <ul style="padding: 0px; list-style-type: none;">
                <li>
                    {{ priorityOne }}
                    <b-form-select
                        v-model="selectedPrio1"
                        :options="optionsPrio1"
                    ></b-form-select>
                </li>
                <li>
                    {{ priorityTwo }}
                    <b-form-select
                        v-model="selectedPrio2"
                        :options="optionsPrio2"
                    ></b-form-select>
                </li>
                <li>
                    {{ priorityThree }}
                    <b-form-select
                        v-model="selectedPrio3"
                        :options="optionsPrio3"
                    ></b-form-select>
                </li>
            </ul>
            <b-form-checkbox id="useHave" v-model="useHave">
                {{ useHaveText }}
            </b-form-checkbox>
        </div>

        <div v-if="page == 'overview'">
            <h2>{{ titleAmountPositions }}</h2>
            {{ amountWantedList }}: {{ wantedListPositions }}<br />
            {{ bricksAndPieces }}: {{ bricksAndPiecesPositions }}<br />
            {{ pickABrick }}: {{ pickABrickPositions }}<br />
            {{ brickLink }}: {{ brickLinkPositions }}<br />
            {{ amountTotalFoundLego }}:
            {{ bricksAndPiecesPositions + pickABrickPositions }}

            <h2>{{ titlePrice }}</h2>
            {{ bricksAndPieces }}: {{ currency }} {{ bricksAndPiecesPrice
            }}<br />
            {{ pickABrick }}: {{ currency }} {{ pickABrickPrice }}<br />
            {{ brickLink }}: (<a id="bricklinkCurrency" href="">?</a>)
            {{ brickLinkPrice }}<br />
            {{ total }}: {{ currency }}
            {{
                Math.round(
                    (bricksAndPiecesPrice + pickABrickPrice + brickLinkPrice) *
                        100
                ) / 100
            }}
            <b-tooltip target="bricklinkCurrency" variant="danger">{{
                brickLinkCurrencyInfo
            }}</b-tooltip>
        </div>

        <div v-if="page == 'bricksAndPieces'">
            <p style="margin-top: 5px; margin-bottom: 5px;">
                <b-button
                    id="btn-bricksAndPieces-add-to-card"
                    variant="primary"
                    @click="bricksAndPiecesFillCart"
                    :disabled="
                        !bricksAndPiecesList || bricksAndPiecesList.length == 0
                    "
                    >{{ buttonFillBricksAndPiecesCart }}</b-button
                >
                <b-button
                    variant="danger"
                    @click="bricksAndPiecesClearCart"
                    :disabled="
                        !bricksAndPiecesList || bricksAndPiecesList.length == 0
                    "
                    style="margin-left: 10px;"
                    >{{ buttonClearBricksAndPiecesCart }}</b-button
                >
                <b-button
                    variant="primary"
                    @click="printBricksAndPieces"
                    style="margin-left: 10px; vertical-align: bottom;"
                    :disabled="
                        !bricksAndPiecesList || bricksAndPiecesList.length == 0
                    "
                >
                    <b-icon icon="printer" aria-hidden="true"></b-icon>
                </b-button>
                <b-button
                    variant="primary"
                    @click="showInfo"
                    style="margin-left: 10px; vertical-align: bottom;"
                >
                    <b-icon icon="info-circle" aria-hidden="true"></b-icon>
                </b-button>
                <b-tooltip
                    target="btn-bricksAndPieces-add-to-card"
                    variant="danger"
                    >{{ buttonFillBricksAndPiecesCartInfo }}</b-tooltip
                >
            </p>
            <div id="bricksAndPiecesList">
                <brick-list
                    :bricklist="bricksAndPiecesList"
                    :limitMaxQty="200"
                ></brick-list>
            </div>
        </div>
        <div v-if="page == 'pickABrick'">
            <p style="margin-top: 5px; margin-bottom: 5px;">
                <b-button
                    id="btn-pickABrick-add-to-card"
                    variant="primary"
                    @click="pickABrickFillCart"
                    :disabled="!pickABrickList || pickABrickList.length == 0"
                    >{{ buttonFillPickABrickCart }}</b-button
                >
                <b-button
                    variant="danger"
                    @click="pickABrickClearCart"
                    :disabled="!pickABrickList || pickABrickList.length == 0"
                    style="margin-left: 10px;"
                    >{{ buttonClearPickABrickCart }}</b-button
                >
                <b-button
                    variant="primary"
                    @click="printPickABrick"
                    style="margin-left: 10px; vertical-align: bottom;"
                    :disabled="!pickABrickList || pickABrickList.length == 0"
                >
                    <b-icon icon="printer" aria-hidden="true"></b-icon>
                </b-button>
                <b-button
                    variant="primary"
                    @click="showInfo"
                    style="margin-left: 10px; vertical-align: bottom;"
                >
                    <b-icon icon="info-circle" aria-hidden="true"></b-icon>
                </b-button>
                <span>
                    <b-progress
                        :value="loadPABPercentage"
                        :max="100"
                        show-progress
                        animated
                        v-if="loadPABPercentage < 100"
                        style="margin-top: 10px"
                    ></b-progress>
                </span>
            </p>
            <div id="pickABrickList">
                <brick-list
                    :bricklist="pickABrickList"
                    :limitMaxQty="999"
                ></brick-list>
            </div>
        </div>
        <div v-if="page == 'brickLink'">
            <p style="margin-top: 5px; margin-bottom: 5px;">
                <b-button
                    variant="primary"
                    @click="onDownload"
                    :disabled="!wantedList || wantedList.length == 0"
                    >{{ buttonBrickLinkDownload }}</b-button
                >
                <b-button
                    variant="primary"
                    @click="onCopy"
                    :disabled="!wantedList || wantedList.length == 0"
                    style="margin-left: 5px"
                    >{{ buttonBrickLinkCopy }}</b-button
                >

                <!-- <input type="text" value="" id="wantedList" style="position:absolute; top: 5000px"> -->
                <textarea
                    id="wantedList"
                    style="position:absolute; top: 5px; height: 0; width: 0; z-index: -5 "
                >
                </textarea>
                <b-button
                    variant="primary"
                    @click="printBrickLink"
                    style="margin-left: 10px; vertical-align: bottom;"
                    :disabled="!brickLinkList || brickLinkList.length == 0"
                >
                    <b-icon icon="printer" aria-hidden="true"></b-icon>
                </b-button>
                <b-button
                    variant="primary"
                    @click="showInfo"
                    style="margin-left: 10px; vertical-align: bottom;"
                >
                    <b-icon icon="info-circle" aria-hidden="true"></b-icon>
                </b-button>
            </p>
            <div id="brickLinkList">
                <brick-list :bricklist="brickLinkList"></brick-list>
            </div>
        </div>
    </div>
</template>

<script>
import BrickList from './BrickList';
export default {
    data() {
        return {
            useHave: null,
            wantedList: null,
            bricksAndPiecesList: null,
            pickABrickList: null,
            brickLinkList: null,
            wantedListPositions: 0,
            bricksAndPiecesPositions: 0,
            pickABrickPositions: 0,
            brickLinkPositions: 0,
            bricksAndPiecesPrice: 0,
            pickABrickPrice: 0,
            brickLinkPrice: 0,
            currency: null,
            page: 'overview',
            pickABrickShoppingCartId: null,
            authorization: null,
            loadPABPercentage: 100,
            optionsPrio1: [
                {
                    value: 'none',
                    text: browser.i18n.getMessage('shopping_optionsNone'),
                },
                {
                    value: 'bricksAndPieces',
                    text: browser.i18n.getMessage('bricksAndPieces'),
                },
                {
                    value: 'pickABrick',
                    text: browser.i18n.getMessage('pickABrick'),
                },
                {
                    value: 'brickLink',
                    text: browser.i18n.getMessage('brickLink'),
                },
            ],
            optionsPrio2: [
                {
                    value: 'none',
                    text: browser.i18n.getMessage('shopping_optionsNone'),
                },
                {
                    value: 'bricksAndPieces',
                    text: browser.i18n.getMessage('bricksAndPieces'),
                },
                {
                    value: 'pickABrick',
                    text: browser.i18n.getMessage('pickABrick'),
                },
                {
                    value: 'brickLink',
                    text: browser.i18n.getMessage('brickLink'),
                },
            ],
            optionsPrio3: [
                {
                    value: 'none',
                    text: browser.i18n.getMessage('shopping_optionsNone'),
                },
                {
                    value: 'bricksAndPieces',
                    text: browser.i18n.getMessage('bricksAndPieces'),
                },
                {
                    value: 'pickABrick',
                    text: browser.i18n.getMessage('pickABrick'),
                },
                {
                    value: 'brickLink',
                    text: browser.i18n.getMessage('brickLink'),
                },
            ],
            selectedPrio1: 'bricksAndPieces',
            selectedPrio2: 'pickABrick',
            selectedPrio3: 'brickLink',
        };
    },
    components: {
        BrickList,
    },
    methods: {
        showInfo() {
            //console.log('changePage');
            this.$emit('changePage', 'info');
        },
        pickABrickClearCart() {
            browser.runtime
                .sendMessage({
                    contentScriptQuery: 'pickABrickClearCart',
                    authorization: this.authorization,
                    PABCartId: this.pickABrickShoppingCartId,
                })
                .then((response) => {
                    //console.log("PickABrickClearCart", response);
                    browser.tabs
                        .query({ currentWindow: true, active: true })
                        .then((tabs) => {
                            var tab = tabs[0];
                            var countrySelected =
                                localStorage.getItem('country') || null;
                            var languageSelected =
                                localStorage.getItem('language') || null;
                            browser.tabs.update(tab.id, {
                                url: `https://www.lego.com/${languageSelected}-${countrySelected}/page/static/pick-a-brick`,
                            });

                            this.$bvToast.toast(this.clearCartSuccessfullText, {
                                title: this.pickABrick,
                                autoHideDelay: 5000,
                                variant: 'success',
                            });
                        });
                })
                .catch(() => {});
        },
        async pickABrickFillCart() {
            var percentageSingle = 100 / this.pickABrickList.length;
            this.loadPABPercentage = 0;
            for (var i = 0; i < this.pickABrickList.length; i++) {
                this.loadPABPercentage += percentageSingle;
                //console.log(this.pickABrickList[i])
                await this.pickABrickAddToCart(this.pickABrickList[i]);
            }
            this.loadPABPercentage = 100;
            browser.tabs
                .query({ currentWindow: true, active: true })
                .then((tabs) => {
                    var tab = tabs[0];
                    var countrySelected =
                        localStorage.getItem('country') || null;
                    var languageSelected =
                        localStorage.getItem('language') || null;

                    console.log(`https://www.lego.com/${languageSelected}-${countrySelected}/page/static/pick-a-brick`);
                    browser.tabs.update(tab.id, {
                        url: `https://www.lego.com/${languageSelected}-${countrySelected}/page/static/pick-a-brick`,
                    });

                    this.$bvToast.toast(this.fillCartSuccessfullText, {
                        title: this.pickABrick,
                        autoHideDelay: 5000,
                        variant: 'success',
                    });
                });
        },
        async pickABrickAddToCart(item) {
            if (item.pickABrick) {
                var qty = item.qty.order;
                if (qty > 999) qty = 999; // it's not possible to order more than 999 pieces per brick

                var partId = item.pickABrick.variant.id;

                var response = await browser.runtime.sendMessage({
                    contentScriptQuery: 'pickABrickAddToCart',
                    authorization: this.authorization,
                    PABCartId: this.pickABrickShoppingCartId,
                    qty: qty,
                    partId: partId,
                });
            }
        },
        bricksAndPiecesFillCart() {
            var order = [];
            //console.log("bricksAndPieceslist", this.bricksAndPiecesList)
            for (var i = 0; i < this.bricksAndPiecesList.length; i++) {
                if (this.bricksAndPiecesList[i].bricksAndPieces) {
                    var qty = this.bricksAndPiecesList[i].qty.order;
                    if (qty > 200) qty = 200; // it's not possible to order more than 200 pieces per brick

                    var pos = {
                        id: this.bricksAndPiecesList[i].bricksAndPieces
                            .itemNumber,
                        product: this.bricksAndPiecesList[i].bricksAndPieces,
                        quantity: parseInt(qty),
                    };

                    pos.product.description = pos.product.description.replace(
                        /[\""]/g,
                        '\\"'
                    ); // escape quotes in description
                    //console.log(pos.product.description)
                    order.push(pos);
                }
            }

            browser.runtime
                .sendMessage({
                    contentScriptQuery: 'bricksAndPiecesFillCart',
                    order: order,
                })
                .then((response) => {
                    //console.log(response)
                    this.$bvToast.toast(this.fillCartSuccessfullText, {
                        title: this.bricksAndPieces,
                        autoHideDelay: 5000,
                        variant: 'success',
                    });
                });
        },
        bricksAndPiecesClearCart() {
            browser.runtime
                .sendMessage({ contentScriptQuery: 'bricksAndPiecesClearCart' })
                .then((response) => {
                    //console.log(response)
                    this.$bvToast.toast(this.clearCartSuccessfullText, {
                        title: this.bricksAndPieces,
                        autoHideDelay: 5000,
                        variant: 'success',
                    });
                });
        },
        calcTotalPrice() {
            this.bricksAndPiecesPositions = 0;
            this.pickABrickPositions = 0;
            this.brickLinkPositions = 0;
            this.bricksAndPiecesPrice = 0;
            this.pickABrickPrice = 0;
            this.brickLinkPrice = 0;
            this.bricksAndPiecesList = [];
            this.pickABrickList = [];
            this.brickLinkList = [];

            if (this.wantedList) {
                this.wantedList.forEach((item) => {
                    if (this.useHave) {
                        item.qty.order = item.qty.balance;
                    } else {
                        item.qty.order = item.qty.min;
                    }
                    if (item.qty.order > 0) {
                        var bricksAndPiecesPrice = 0;
                        var pickABrickPrice = 0;

                        if (item?.bricksAndPieces?.price?.amount)
                            bricksAndPiecesPrice =
                                item.bricksAndPieces.price.amount;
                        if (item?.pickABrick?.variant?.price?.centAmount)
                            pickABrickPrice =
                                item.pickABrick.variant.price.centAmount / 100;
                        var price = this.getPrice(
                            bricksAndPiecesPrice,
                            pickABrickPrice,
                            item.maxprice
                        );

                        if (price[1]) {
                            if (price[0] == 'bricksAndPieces') {
                                this.bricksAndPiecesPositions++;
                                this.bricksAndPiecesPrice +=
                                    item.qty.order * price[1];
                                this.currency =
                                    item.bricksAndPieces.price.currency;
                                this.fillBricksAndPiecesList(item);
                            } else if (price[0] == 'pickABrick') {
                                this.pickABrickPositions++;
                                this.pickABrickPrice +=
                                    item.qty.order * price[1];
                                this.currency =
                                    item.pickABrick.variant.price.currencyCode;
                                this.fillPickABrickList(item);
                            } else {
                                this.brickLinkPositions++;
                                this.brickLinkPrice +=
                                    item.qty.order * price[1];
                                this.fillBrickLinkList(item);
                            }
                        } else {
                            this.brickLinkPositions++;
                            this.brickLinkPrice += item.qty.order * price[1];
                            this.fillBrickLinkList(item);
                        }
                    }
                });

                if (
                    this.selectedPrio1 != 'brickLink' &&
                    this.selectedPrio2 != 'brickLink' &&
                    this.selectedPrio3 != 'brickLink'
                ) {
                    this.brickLinkPositions = 0;
                    this.brickLinkPrice = 0;
                }
            }

            this.bricksAndPiecesPrice =
                Math.round(this.bricksAndPiecesPrice * 100) / 100;
            this.pickABrickPrice = Math.round(this.pickABrickPrice * 100) / 100;
            this.brickLinkPrice = Math.round(this.brickLinkPrice * 100) / 100;
        },
        getPrice(bricksAndPiecesPrice, pickABrickPrice, brickLinkPrice) {
            if (!bricksAndPiecesPrice) bricksAndPiecesPrice = 0;
            if (!pickABrickPrice) pickABrickPrice = 0;
            if (!brickLinkPrice || brickLinkPrice < 0) brickLinkPrice = 0;

            var prices = Array();

            if (
                this.selectedPrio1 == 'bricksAndPieces' &&
                bricksAndPiecesPrice
            ) {
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            } else if (this.selectedPrio1 == 'pickABrick' && pickABrickPrice) {
                prices.push(['pickABrick', pickABrickPrice]);
            } else if (this.selectedPrio1 == 'brickLink' && brickLinkPrice) {
                prices.push(['brickLink', brickLinkPrice]);
            }

            if (
                this.selectedPrio2 == 'bricksAndPieces' &&
                bricksAndPiecesPrice
            ) {
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            } else if (this.selectedPrio2 == 'pickABrick' && pickABrickPrice) {
                prices.push(['pickABrick', pickABrickPrice]);
            } else if (this.selectedPrio2 == 'brickLink' && brickLinkPrice) {
                prices.push(['brickLink', brickLinkPrice]);
            }

            if (
                this.selectedPrio3 == 'bricksAndPieces' &&
                bricksAndPiecesPrice
            ) {
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            } else if (this.selectedPrio3 == 'pickABrick' && pickABrickPrice) {
                prices.push(['pickABrick', pickABrickPrice]);
            } else if (this.selectedPrio3 == 'brickLink' && brickLinkPrice) {
                prices.push(['brickLink', brickLinkPrice]);
            }

            if (prices.length == 0) {
                prices.push(['brickLink', 0]);
            }

            prices = prices.sort(function(a, b) {
                return a[1] - b[1];
            });

            return prices[0];
        },
        fillBricksAndPiecesList(pos) {
            this.bricksAndPiecesList.push(pos);
        },
        fillPickABrickList(pos) {
            this.pickABrickList.push(pos);
        },
        fillBrickLinkList(pos) {
            this.brickLinkList.push(pos);
        },
        onDownload() {
            let xmlContent = 'data:text/xml;charset=utf-8,';
            xmlContent += this.creatXml();

            const data = encodeURI(xmlContent);
            const link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', 'WantedList.xml');
            link.click();
        },
        onCopy() {
            var copyText = document.getElementById('wantedList');
            copyText.value = this.creatXml(false);
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand('copy');
        },
        creatXml(withHeader = true) {
            var xml2js = require('xml2js');

            var wantedList = this.createBrickLinkObject();

            var builder = new xml2js.Builder();
            var xml = builder.buildObject(wantedList);

            if (withHeader) return xml;

            var startpos = xml.substr(xml).indexOf('>') + 2;
            return xml.substr(startpos, xml.length);
        },
        createBrickLinkObject() {
            if (!this.brickLinkList) return;

            var brickLink = { INVENTORY: Array() };

            for (var i = 0; i < this.brickLinkList.length; i++) {
                var bricksAndPiecesPrice = 0;
                var pickABrickPrice = 0;

                var have = parseInt(this.brickLinkList[i].qty.have);
                if (this.recalcHave) {
                    have += parseInt(this.brickLinkList[i].qty.balance);
                }

                var item = {
                    ITEM: {
                        ITEMTYPE: this.brickLinkList[i].itemtype,
                        ITEMID: this.brickLinkList[i].itemid,
                        COLOR: this.brickLinkList[i].color.brickLinkId,
                        MAXPRICE: this.brickLinkList[i].maxprice,
                        MINQTY: this.brickLinkList[i].qty.min,
                        CONDITION: this.brickLinkList[i].condition,
                        NOTIFY: this.brickLinkList[i].notify,
                    },
                };

                if (!this.recalcHave) {
                    item.QTYFILLED = have;
                }

                brickLink.INVENTORY.push(item);
            }

            return brickLink;
        },
        printBricksAndPieces() {
            //console.log('print');
            this.$htmlToPaper('bricksAndPiecesList');
        },
        printPickABrick() {
            //console.log('print');
            this.$htmlToPaper('pickABrickList');
        },
        printBrickLink() {
            //console.log('print');
            this.$htmlToPaper('brickLinkList');
        },
    },
    watch: {
        selectedPrio1: function(val, oldVal) {
            localStorage.setItem('selectedPrio1', val);
            this.calcTotalPrice();
        },
        selectedPrio2: function(val, oldVal) {
            localStorage.setItem('selectedPrio2', val);
            this.calcTotalPrice();
        },
        selectedPrio3: function(val, oldVal) {
            localStorage.setItem('selectedPrio3', val);
            this.calcTotalPrice();
        },
        useHave: function(val, oldVal) {
            localStorage.setItem('useHave', val);
            this.calcTotalPrice();
        },
    },
    beforeMount() {
        this.selectedPrio1 =
            localStorage.getItem('selectedPrio1') || 'bricksAndPieces';
        this.selectedPrio2 =
            localStorage.getItem('selectedPrio2') || 'pickABrick';
        this.selectedPrio3 =
            localStorage.getItem('selectedPrio3') || 'brickLink';
        this.useHave = (localStorage.getItem('useHave') || 'true') === 'true';
        this.wantedList = JSON.parse(
            localStorage.getItem('wantedList') || null
        );
        if (this.wantedList.length)
            this.wantedListPositions = this.wantedList.length;

        this.calcTotalPrice();

        browser.runtime
            .sendMessage({ contentScriptQuery: 'readQAuth' })
            .then((response) => {
                this.authorization = response;
                //console.log("authorization", this.authorization);
                browser.runtime
                    .sendMessage({
                        contentScriptQuery: 'pickABrickReadCart',
                        authorization: this.authorization,
                    })
                    .then((response) => {
                        //console.log("PickABrickReadCart", response);
                        this.pickABrickShoppingCartId = response.id;
                        //console.log("PickABrickReadCartId", this.pickABrickShoppingCartId);
                    })
                    .catch(() => {});
            })
            .catch(() => {});
    },
    computed: {
        pickABrick() {
            return browser.i18n.getMessage('pickABrick');
        },
        bricksAndPieces() {
            return browser.i18n.getMessage('bricksAndPieces');
        },
        brickLink() {
            return browser.i18n.getMessage('brickLink');
        },
        priorityOne() {
            return browser.i18n.getMessage('shopping_priorityOne');
        },
        priorityTwo() {
            return browser.i18n.getMessage('shopping_priorityTwo');
        },
        priorityThree() {
            return browser.i18n.getMessage('shopping_priorityThree');
        },
        whatShouldBePreferred() {
            return browser.i18n.getMessage('shopping_whatShouldBePreferred');
        },
        useHaveText() {
            return browser.i18n.getMessage('shopping_useHave');
        },
        tabSettings() {
            return browser.i18n.getMessage('shopping_tabSettings');
        },
        tabOverview() {
            return browser.i18n.getMessage('shopping_tabOverview');
        },
        titleAmountPositions() {
            return browser.i18n.getMessage('shopping_titleAmountPositions');
        },
        amountWantedList() {
            return browser.i18n.getMessage('shopping_amountWantedList');
        },
        amountTotalFoundLego() {
            return browser.i18n.getMessage('shopping_amountTotalFoundLego');
        },
        titlePrice() {
            return browser.i18n.getMessage('shopping_titlePrice');
        },
        total() {
            return browser.i18n.getMessage('shopping_total');
        },
        brickLinkCurrencyInfo() {
            return browser.i18n.getMessage('shopping_brickLinkCurrencyInfo');
        },
        buttonFillBricksAndPiecesCart() {
            return browser.i18n.getMessage(
                'shopping_buttonFillBricksAndPiecesCart'
            );
        },
        buttonFillBricksAndPiecesCartInfo() {
            return browser.i18n.getMessage(
                'shopping_buttonFillBricksAndPiecesCartInfo'
            );
        },
        buttonClearBricksAndPiecesCart() {
            return browser.i18n.getMessage(
                'shopping_buttonClearBricksAndPiecesCart'
            );
        },
        buttonFillPickABrickCart() {
            return browser.i18n.getMessage('shopping_buttonFillPickABrickCart');
        },
        buttonClearPickABrickCart() {
            return browser.i18n.getMessage(
                'shopping_buttonClearPickABrickCart'
            );
        },
        fillCartSuccessfullText() {
            return browser.i18n.getMessage('shopping_fillCartSuccessfullText');
        },
        clearCartSuccessfullText() {
            return browser.i18n.getMessage('shopping_clearCartSuccessfullText');
        },
        buttonBrickLinkDownload() {
            return browser.i18n.getMessage('shopping_buttonBrickLinkDownload');
        },
        buttonBrickLinkCopy() {
            return browser.i18n.getMessage('shopping_buttonBrickLinkCopy');
        },
    },
};
</script>
