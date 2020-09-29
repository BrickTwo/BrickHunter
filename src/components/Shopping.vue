<template>
    <div>
        <b-form-checkbox id="usePickaBrick" v-model="usePickaBrick">
            {{ usePickABrick }}
        </b-form-checkbox>
        <b-form-checkbox id="useStonesAndPieces" v-model="useStonesAndPieces">
            {{ useBricksAndPieces }}
        </b-form-checkbox>

        <b-form-group :label="whatShouldBePreferred" style="margin-top: 10px">
            <b-form-radio-group
                v-model="behaviourOnSamePrice"
                name="behaviourOnSamePrice"
            >
                <b-form-radio value="pickABrick" :disabled="!usePickaBrick">{{
                    pickABrick
                }}</b-form-radio>
                <b-form-radio value="bricksAndPieces" :disabled="!useStonesAndPieces">{{
                    bricksAndPieces
                }}</b-form-radio>
                <b-form-radio value="bl">{{ brickLink }}</b-form-radio>
            </b-form-radio-group>
        </b-form-group>

        <b-form-checkbox id="useHave" v-model="useHave">
            {{ useHaveText }}
        </b-form-checkbox>

        <b-nav tabs>
            <b-nav-item
                :active="page == 'overview'"
                @click="page = 'overview'"
                >{{ tabOverview }}</b-nav-item
            >
            <b-nav-item :active="page == 'bricksAndPieces'" @click="page = 'bricksAndPieces'">{{
                bricksAndPieces
            }}</b-nav-item>
            <b-nav-item :active="page == 'pickABrick'" @click="page = 'pickABrick'">{{
                pickABrick
            }}</b-nav-item>
        </b-nav>

        <div v-if="page == 'overview'">
            <h2>{{ titleAmountPositions }}</h2>
            {{ amountWantedList }}: {{ wantedList.length }}<br />
            {{ pickABrick }}: {{ pickABrickPositions }}<br />
            {{ bricksAndPieces }}: {{ bricksAndPiecesPositions }}<br />
            {{ amountTotalFoundLego }}: {{ bricksAndPiecesPositions + pickABrickPositions }}

            <h2>{{ titlePrice }}</h2>
            {{ pickABrick }}: {{ currency }} {{ pickABrickPrice }}<br />
            {{ bricksAndPieces }}: {{ currency }} {{ bricksAndPiecesPrice }}<br />
            {{ total }}: {{ currency }}
            {{ Math.round((bricksAndPiecesPrice + pickABrickPrice) * 100) / 100 }}
        </div>
        <div v-if="page == 'bricksAndPieces'">
            <p style="margin-top: 5px; margin-bottom: 5px;">
                <b-button
                    id="btn-bricksAndPieces-add-to-card"
                    variant="primary"
                    @click="bricksAndPiecesFillCart"
                    :disabled="
                        !bricksAndPiecesList || bricksAndPiecesList.length == 0 || !useStonesAndPieces
                    "
                    >{{ buttonFillBricksAndPiecesCart }}</b-button
                >
                <b-button
                    variant="danger"
                    @click="bricksAndPiecesClearCart"
                    :disabled="
                        !bricksAndPiecesList || bricksAndPiecesList.length == 0 || !useStonesAndPieces
                    "
                    style="margin-left: 10px;"
                    >{{ buttonClearBricksAndPiecesCart }}</b-button
                >
                <b-button
                    variant="primary"
                    @click="printBricksAndPieces"
                    style="margin-left: 10px; vertical-align: bottom;"
                    :disabled="
                        !bricksAndPiecesList || bricksAndPiecesList.length == 0 || !useStonesAndPieces
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
                <b-tooltip target="btn-bricksAndPieces-add-to-card" variant="danger">{{
                    buttonFillBricksAndPiecesCartInfo
                }}</b-tooltip>
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
                    :disabled="
                        !pickABrickList || pickABrickList.length == 0 || !usePickaBrick
                    "
                    >{{ buttonFillPickABrickCart }}</b-button
                >
                <b-button
                    variant="danger"
                    @click="pickABrickClearCart"
                    :disabled="
                        !pickABrickList || pickABrickList.length == 0 || !usePickaBrick
                    "
                    style="margin-left: 10px;"
                    >{{ buttonClearPickABrickCart }}</b-button
                >
                <b-button
                    variant="primary"
                    @click="printPickABrick"
                    style="margin-left: 10px; vertical-align: bottom;"
                    :disabled="
                        !pickABrickList || pickABrickList.length == 0 || !usePickaBrick
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
                <span>
                    <b-progress
                        :value="loadPAPPercentage"
                        :max="100"
                        show-progress
                        animated
                        v-if="loadPAPPercentage < 100"
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
    </div>
</template>

<script>
import BrickList from './BrickList';
export default {
    data() {
        return {
            usePickaBrick: null,
            useStonesAndPieces: null,
            behaviourOnSamePrice: null,
            useHave: null,
            wantedList: null,
            bricksAndPiecesList: null,
            pickABrickList: null,
            bricksAndPiecesPositions: 0,
            pickABrickPositions: 0,
            bricksAndPiecesPrice: 0,
            pickABrickPrice: 0,
            currency: null,
            page: 'overview',
            pickABrickShoppingCartId: null,
            authorization: null,
            loadPAPPercentage: 100,
        };
    },
    components: {
        BrickList,
    },
    methods: {
        showInfo() {
            console.log('changePage');
            this.$emit('changePage', 'info');
        },
        pickABrickClearCart() {
            browser.runtime
                .sendMessage({
                    contentScriptQuery: 'PickABrickClearCart',
                    authorization: this.authorization,
                    PABCartId: this.pickABrickShoppingCartId,
                })
                .then((response) => {
                    //console.log("PickABrickClearCart", response);
                    browser.tabs
                        .query({ currentWindow: true, active: true })
                        .then((tabs) => {
                            var tab = tabs[0];
                            //var countrySelected = localStorage.getItem("country") || null
                            browser.tabs.update(tab.id, {
                                url: `https://www.lego.com/page/static/pick-a-brick`,
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
            this.loadPAPPercentage = 0;
            for (var i = 0; i < this.pickABrickList.length; i++) {
                this.loadPAPPercentage += percentageSingle;
                //console.log(this.pickABrickList[i])
                await this.pickABrickAddToCart(this.pickABrickList[i]);
            }
            this.loadPAPPercentage = 100;
            browser.tabs
                .query({ currentWindow: true, active: true })
                .then((tabs) => {
                    var tab = tabs[0];
                    //var countrySelected = localStorage.getItem("country") || null
                    browser.tabs.update(tab.id, {
                        url: `https://www.lego.com/page/static/pick-a-brick`,
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
                    contentScriptQuery: 'PickABrickAddToCart',
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
                        id: this.bricksAndPiecesList[i].bricksAndPieces.itemNumber,
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
            this.bricksAndPiecesPrice = 0;
            this.pickABrickPrice = 0;
            this.bricksAndPiecesList = [];
            this.pickABrickList = [];

            if (this.wantedList) {
                this.wantedList.forEach((element) => {
                    if (this.useHave) {
                        element.qty.order = element.qty.balance;
                    } else {
                        element.qty.order = element.qty.min;
                    }
                    if (element.qty.order > 0) {
                        var bricksAndPiecesPrice = 0;
                        var pickABrickPrice = 0;

                        if (
                            element.bricksAndPieces &&
                            element.bricksAndPieces.price &&
                            element.bricksAndPieces.price.amount
                        )
                            bricksAndPiecesPrice = element.bricksAndPieces.price.amount;
                        if (
                            element.pickABrick &&
                            element.pickABrick.variant &&
                            element.pickABrick.variant.price &&
                            element.pickABrick.variant.price.centAmount
                        )
                            pickABrickPrice =
                                element.pickABrick.variant.price.centAmount / 100;
                        var price = this.getPrice(
                            pickABrickPrice,
                            bricksAndPiecesPrice,
                            element.maxprice
                        );

                        if (price[1]) {
                            if (price[0] == 'bricksAndPieces') {
                                this.bricksAndPiecesPositions++;
                                this.bricksAndPiecesPrice += element.minqty * price[1];
                                this.currency = element.bricksAndPieces.price.currency;
                                this.fillBricksAndPiecesList(element);
                            }
                            if (price[0] == 'pickABrick') {
                                this.pickABrickPositions++;
                                this.pickABrickPrice += element.minqty * price[1];
                                this.currency =
                                    element.pickABrick.variant.price.currencyCode;
                                this.fillPickABrickList(element);
                            }
                        }
                    }
                });
            }

            this.bricksAndPiecesPrice = Math.round(this.bricksAndPiecesPrice * 100) / 100;
            this.pickABrickPrice = Math.round(this.pickABrickPrice * 100) / 100;
        },
        getPrice(pickABrickPrice, bricksAndPiecesPrice, blPrice) {
            if (!pickABrickPrice) pickABrickPrice = 0;
            if (!bricksAndPiecesPrice) bricksAndPiecesPrice = 0;

            var prices = Array();

            if (pickABrickPrice == bricksAndPiecesPrice && pickABrickPrice > 0) {
                if (this.behaviourOnSamePrice == 'bricksAndPieces') {
                    prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
                } else {
                    prices.push(['pickABrick', pickABrickPrice]);
                }
            } else {
                if (this.usePickaBrick && pickABrickPrice > 0)
                    prices.push(['pickABrick', pickABrickPrice]);
                if (this.useStonesAndPieces && bricksAndPiecesPrice > 0)
                    prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            }

            if (prices.length == 0) return 0;
            prices = prices.sort(function(a, b) {
                return a[1] - b[1];
            });

            if (this.behaviourOnSamePrice == 'bl' && prices[0] == blPrice)
                return ['bl', 0];

            return prices[0];
        },
        fillBricksAndPiecesList(pos) {
            this.bricksAndPiecesList.push(pos);
        },
        fillPickABrickList(pos) {
            this.pickABrickList.push(pos);
        },
        printBricksAndPieces() {
            console.log('print');
            this.$htmlToPaper('bricksAndPiecesList');
        },
        printPickABrick() {
            console.log('print');
            this.$htmlToPaper('pickABrickList');
        },
    },
    watch: {
        usePickaBrick: function(val, oldVal) {
            if (!val) {
                if (this.behaviourOnSamePrice == 'pickABrick') {
                    if (this.useStonesAndPieces) {
                        this.behaviourOnSamePrice = 'bricksAndPieces';
                    } else {
                        this.behaviourOnSamePrice = 'bl';
                    }
                }
            }
            localStorage.setItem('usePickaBrick', val);
            localStorage.setItem(
                'behaviourOnSamePriceShopping',
                this.behaviourOnSamePrice
            );
            this.calcTotalPrice();
        },
        useStonesAndPieces: function(val, oldVal) {
            if (!val) {
                if (this.behaviourOnSamePrice == 'bricksAndPieces') {
                    if (this.usePickaBrick) {
                        this.behaviourOnSamePrice = 'pickABrick';
                    } else {
                        this.behaviourOnSamePrice = 'bl';
                    }
                }
            }
            localStorage.setItem('useStonesAndPieces', val);
            localStorage.setItem(
                'behaviourOnSamePriceShopping',
                this.behaviourOnSamePrice
            );
            this.calcTotalPrice();
        },
        behaviourOnSamePrice: function(val, oldVal) {
            localStorage.setItem('behaviourOnSamePriceShopping', val);
            this.calcTotalPrice();
        },
        useHave: function(val, oldVal) {
            localStorage.setItem('useHave', val);
            this.calcTotalPrice();
        },
    },
    beforeMount() {
        this.usePickaBrick =
            (localStorage.getItem('usePickaBrick') || 'true') === 'true';
        this.useStonesAndPieces =
            (localStorage.getItem('useStonesAndPieces') || 'true') === 'true';
        this.behaviourOnSamePrice =
            localStorage.getItem('behaviourOnSamePriceShopping') || 'bricksAndPieces';
        this.useHave = (localStorage.getItem('useHave') || 'true') === 'true';
        this.wantedList = JSON.parse(
            localStorage.getItem('wantedList') || null
        );

        this.calcTotalPrice();

        browser.runtime
            .sendMessage({ contentScriptQuery: 'readQAuth' })
            .then((response) => {
                this.authorization = response;
                //console.log("authorization", this.authorization);
                browser.runtime
                    .sendMessage({
                        contentScriptQuery: 'PickABrickReadCart',
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
        usePickABrick() {
            return browser.i18n.getMessage('shopping_usePickABrick');
        },
        useBricksAndPieces() {
            return browser.i18n.getMessage('shopping_useBricksAndPieces');
        },
        whatShouldBePreferred() {
            return browser.i18n.getMessage('shopping_whatShouldBePreferred');
        },
        useHaveText() {
            return browser.i18n.getMessage('shopping_useHave');
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
    },
};
</script>
