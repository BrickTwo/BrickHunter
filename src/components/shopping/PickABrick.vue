<template>
    <b-container class="bv-example-row" fluid="xl">
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
                <Affiliate
                    class="button"
                    style="display: inline;"
                    :noAffiliate="true"
                />
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
                <img
                    alt=""
                    border="0"
                    src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
                    @click="donate()"
                    style="cursor: pointer"
                />
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
                <b-modal
                    id="modal-open-lego-clear-cart"
                    :title="actionCannotPerform"
                    :header-bg-variant="headerBgVariant"
                    :header-text-variant="headerTextVariant"
                    centered
                    @ok="pickABrickClearCart()"
                >
                    <p class="my-4">
                        {{ openLegoWebsiteText }}
                    </p>
                    <p>
                        <b-button
                            variant="primary"
                            @click="openInNewTab('https://www.lego.com/')"
                        >
                            {{ openLegoWebsite }}
                        </b-button>
                    </p>
                    <template #modal-footer="{ cancel, ok }">
                        <b-button @click="cancel()">
                            {{ labelCancel }}
                        </b-button>
                        <!-- Button with custom close trigger value -->
                        <b-button @click="ok()">
                            {{ tryAgain }}
                        </b-button>
                    </template>
                </b-modal>
                <b-modal
                    id="modal-open-lego-fill-cart"
                    :title="actionCannotPerform"
                    :header-bg-variant="headerBgVariant"
                    :header-text-variant="headerTextVariant"
                    centered
                    @ok="pickABrickFillCart()"
                >
                    <p class="my-4">
                        {{ openLegoWebsiteText }}
                    </p>
                    <p>
                        <b-button
                            variant="primary"
                            @click="openInNewTab('https://www.lego.com/')"
                        >
                            {{ openLegoWebsite }}
                        </b-button>
                    </p>
                    <template #modal-footer="{ cancel, ok }">
                        <b-button @click="cancel()">
                            {{ labelCancel }}
                        </b-button>
                        <!-- Button with custom close trigger value -->
                        <b-button @click="ok()">
                            {{ tryAgain }}
                        </b-button>
                    </template>
                </b-modal>
                <b-modal
                    id="modal-use-popup"
                    :title="actionCannotPerform"
                    :header-bg-variant="headerBgVariant"
                    :header-text-variant="headerTextVariant"
                    centered
                    @ok="bricksAndPiecesFillCart()"
                >
                    <p class="my-4">
                        {{ pleaseUsePopup }}
                    </p>
                </b-modal>
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
import Affiliate from '@/components/Affiliate.vue';
export default {
    data() {
        return {
            brickList: null,
            pickABrickShoppingCartId: null,
            authorization: null,
            loadPABPercentage: 100,
            headerBgVariant: 'dark',
            headerTextVariant: 'light',
        };
    },
    components: {
        BrickList,
        Affiliate,
    },
    methods: {
        showInfo() {
            //console.log('changePage');
            this.$router.push('/info').catch(() => {});
        },
        async pickABrickClearCart() {
            if (!this.showCartButtons) {
                this.$bvModal.show('modal-use-popup');
                return;
            }
            var cartId = await this.getShoppingCartId('clear');
            if (!cartId) return;
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
                            var countrySelected = this.$store.state.country;
                            var languageSelected = this.$store.state.language;

                            browser.runtime.sendMessage({
                                contentScriptQuery: 'openPickABrick',
                            });
                            /*if (this.$store.state.mode == 'popup') {
                                browser.tabs.update(tab.id, {
                                    url: `https://www.lego.com/${languageSelected}-${countrySelected}/page/static/pick-a-brick`,
                                });
                            } else {
                                this.openInNewTab(
                                    `https://www.lego.com/${languageSelected}-${countrySelected}/page/static/pick-a-brick`
                                );
                            }*/

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
            if (!this.showCartButtons) {
                this.$bvModal.show('modal-use-popup');
                return;
            }
            var cartId = await this.getShoppingCartId('fill');
            if (!cartId) return;
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
                    var countrySelected = this.$store.state.country;
                    var languageSelected = this.$store.state.language;

                    browser.runtime.sendMessage({
                        contentScriptQuery: 'openPickABrick',
                        affiliate: this.$store.state.affiliate,
                    });

                    //console.log(`https://www.lego.com/${languageSelected}-${countrySelected}/page/static/pick-a-brick`);
                    /*if (this.$store.state.mode == 'popup') {
                        browser.tabs.update(tab.id, {
                            url: `https://www.lego.com/${languageSelected}-${countrySelected}/page/static/pick-a-brick`,
                        });
                    } else {
                        this.openInNewTab(
                            `https://www.lego.com/${languageSelected}-${countrySelected}/page/static/pick-a-brick`
                        );
                    }*/

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
        async getShoppingCartId(action) {
            return await browser.runtime
                .sendMessage({ contentScriptQuery: 'readQAuth' })
                .then((response) => {
                    //console.log('response', response);
                    if (!response) {
                        //this.openInNewTab('https://www.lego.com/');
                        if (action == 'fill') {
                            this.$bvModal.show('modal-open-lego-fill-cart');
                        } else {
                            this.$bvModal.show('modal-open-lego-clear-cart');
                        }

                        return false;
                    }

                    this.authorization = response;
                    //console.log("authorization", this.authorization);
                    return browser.runtime
                        .sendMessage({
                            contentScriptQuery: 'pickABrickReadCart',
                            authorization: this.authorization,
                        })
                        .then((response) => {
                            //console.log("PickABrickReadCart", response);
                            this.pickABrickShoppingCartId = response.id;
                            //console.log("PickABrickReadCartId", this.pickABrickShoppingCartId);
                            return true;
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        openInNewTab(url) {
            var win = window.open(url, '_blank');
            //win.focus();
        },
        donate() {
            browser.runtime.sendMessage({
                contentScriptQuery: 'donate',
            });
        },
    },
    beforeMount() {
        this.brickList = this.$store.state.shopping.pickABrickList;
        //this.getShoppingCartId();
    },
    computed: {
        showCartButtons() {
            if (this.$store.state.mode == 'popup') return true;
            if (navigator.userAgent.indexOf('Chrome') != -1) return true; //is chrome or edge
            return false;
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
        actionCannotPerform() {
            return browser.i18n.getMessage('shopping_actionCannotPerform');
        },
        openLegoWebsiteText() {
            return browser.i18n.getMessage('shopping_openLegoWebsiteText');
        },
        openLegoWebsite() {
            return browser.i18n.getMessage('shopping_openLegoWebsite');
        },
        labelCancel() {
            return browser.i18n.getMessage('shopping_cancel');
        },
        tryAgain() {
            return browser.i18n.getMessage('shopping_tryAgain');
        },
        pleaseUsePopup() {
            return browser.i18n.getMessage('shopping_pleaseUsePopup');
        },
    },
};
</script>
