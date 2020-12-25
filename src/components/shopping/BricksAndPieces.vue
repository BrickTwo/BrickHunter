<template>
    <b-container class="bv-example-row" fluid="xl">
        <b-row>
            <b-col>
                <b-button
                    class="button"
                    id="btn-bricksAndPieces-add-to-card"
                    variant="primary"
                    @click="bricksAndPiecesFillCart"
                    :disabled="!brickList || brickList.length == 0"
                >
                    {{ buttonFillBricksAndPiecesCart }}
                </b-button>
                <b-button
                    class="button"
                    variant="danger"
                    @click="bricksAndPiecesClearCart"
                    :disabled="!brickList || brickList.length == 0"
                >
                    {{ buttonClearBricksAndPiecesCart }}
                </b-button>
                <Affiliate
                    class="button"
                    style="display: inline;"
                    :noAffiliate="true"
                />
                <b-button
                    class="button"
                    variant="primary"
                    @click="printBricksAndPieces"
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
                <b-tooltip
                    target="btn-bricksAndPieces-add-to-card"
                    variant="danger"
                >
                    {{ buttonFillBricksAndPiecesCartInfo }}
                </b-tooltip>
                <b-modal
                    id="modal-open-lego-clear-cart"
                    :title="actionCannotPerform"
                    :header-bg-variant="headerBgVariant"
                    :header-text-variant="headerTextVariant"
                    centered
                    @ok="bricksAndPiecesClearCart()"
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
                    @ok="bricksAndPiecesFillCart()"
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
            <b-col id="bricksAndPiecesList">
                <brick-list :bricklist="brickList" :limitMaxQty="200" />
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
            this.$router.push('/info').catch(() => {});
        },
        async bricksAndPiecesFillCart() {
            if (!this.showCartButtons) {
                this.$bvModal.show('modal-use-popup');
                return;
            }
            var isOpen = await this.checkIfLegoIsOpen('fill');
            if (!isOpen) return;
            var order = [];

            for (var i = 0; i < this.brickList.length; i++) {
                if (this.brickList[i].bricksAndPieces) {
                    var qty = this.brickList[i].qty.order;
                    if (qty > 200) qty = 200; // it's not possible to order more than 200 pieces per brick

                    if (qty > this.brickList[i].bricksAndPieces.maxAmount)
                        qty = this.brickList[i].bricksAndPieces.maxAmount;

                    var pos = {
                        id: this.brickList[i].bricksAndPieces.itemNumber,
                        product: this.brickList[i].bricksAndPieces,
                        quantity: parseInt(qty),
                    };

                    /*pos.product.description = pos.product.description.replace(
                        /[\""]/g,
                        '\\"'
                    ); // escape quotes in description
                    */
                    order.push(pos);
                }
            }

            browser.runtime
                .sendMessage({
                    contentScriptQuery: 'bricksAndPiecesFillCart',
                    order: order,
                    mode: this.$store.state.mode,
                    affiliate: this.$store.state.affiliate,
                })
                .then((response) => {
                    this.$bvToast.toast(this.fillCartSuccessfullText, {
                        title: this.bricksAndPieces,
                        autoHideDelay: 5000,
                        variant: 'success',
                    });
                });
        },
        async bricksAndPiecesClearCart() {
            if (!this.showCartButtons) {
                this.$bvModal.show('modal-use-popup');
                return;
            }
            var isOpen = await this.checkIfLegoIsOpen('clear');
            if (!isOpen) return;
            browser.runtime
                .sendMessage({
                    contentScriptQuery: 'bricksAndPiecesClearCart',
                    mode: this.$store.state.mode,
                })
                .then((response) => {
                    this.$bvToast.toast(this.clearCartSuccessfullText, {
                        title: this.bricksAndPieces,
                        autoHideDelay: 5000,
                        variant: 'success',
                    });
                });
        },
        printBricksAndPieces() {
            this.$htmlToPaper('bricksAndPiecesList');
        },
        async checkIfLegoIsOpen(action) {
            return await browser.tabs
                .query({ url: '*://*.lego.com/*', status: 'complete' })
                .then(async (logTabs) => {
                    if (!logTabs.length) {
                        if (action == 'fill') {
                            this.$bvModal.show('modal-open-lego-fill-cart');
                        } else {
                            this.$bvModal.show('modal-open-lego-clear-cart');
                        }
                        return false;
                    }
                    return true;
                });
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
        this.brickList = this.$store.state.shopping.brickAndPiecesList;
    },
    computed: {
        showCartButtons() {
            if (this.$store.state.mode == 'popup') return true;
            if (navigator.userAgent.indexOf('Chrome') != -1) return true; //is chrome or edge
            return false;
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
