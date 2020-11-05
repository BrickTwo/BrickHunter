<template>
    <b-container class="bv-example-row" fluid="lg">
        <b-row>
            <b-col>
                <b-button
                    class="button"
                    id="btn-pickABrick-add-to-card"
                    variant="primary"
                    @click="pickABrickFillCart"
                    :disabled="!brickList || brickList.length == 0"
                >
                    {{ buttonFillPickABrickCart }}
                </b-button>
                <b-button
                    class="button"
                    variant="danger"
                    @click="pickABrickClearCart"
                    :disabled="!brickList || brickList.length == 0"
                >
                    {{ buttonClearPickABrickCart }}
                </b-button>
                <b-button
                    class="button"
                    variant="primary"
                    @click="printPickABrick"
                    :disabled="!brickList || brickList.length == 0"
                >
                    <b-icon icon="printer" aria-hidden="true" />
                </b-button>
                <b-button class="button" variant="primary" @click="showInfo">
                    <b-icon icon="info-circle" aria-hidden="true" />
                </b-button>
                <span>
                    <b-progress
                        :value="loadPABPercentage"
                        :max="100"
                        show-progress
                        animated
                        v-if="loadPABPercentage < 100"
                        style="margin-top: 10px"
                    />
                </span>
            </b-col>
        </b-row>
        <b-row>
            <b-col id="pickABrickList">
                <brick-list :bricklist="brickList" :limitMaxQty="999" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import BrickList from '../BrickList';
export default {
    data() {
        return {
            brickList: null,
            pickABrickShoppingCartId: null,
            authorization: null,
            loadPABPercentage: 100,
        };
    },
    components: {
        BrickList,
    },
    methods: {
        showInfo() {
            //console.log('changePage');
            this.$router.push('/info').catch(() => {});
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
            var percentageSingle = 100 / this.brickList.length;
            this.loadPABPercentage = 0;
            for (var i = 0; i < this.brickList.length; i++) {
                this.loadPABPercentage += percentageSingle;
                //console.log(this.brickList[i])
                await this.pickABrickAddToCart(this.brickList[i]);
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

                    //console.log(`https://www.lego.com/${languageSelected}-${countrySelected}/page/static/pick-a-brick`);
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
        printPickABrick() {
            //console.log('print');
            this.$htmlToPaper('pickABrickList');
        },
    },
    beforeMount() {
        this.brickList = this.$store.state.shopping.pickABrickList;

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
