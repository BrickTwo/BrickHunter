<template>
    <b-container class="bv-example-row" fluid="lg">
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
                <b-tooltip
                    target="btn-bricksAndPieces-add-to-card"
                    variant="danger"
                >
                    {{ buttonFillBricksAndPiecesCartInfo }}
                </b-tooltip>
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
export default {
    data() {
        return {
            brickList: null,
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
        bricksAndPiecesFillCart() {
            var order = [];
            //console.log("bricksAndPieceslist", this.brickList)
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
        printBricksAndPieces() {
            //console.log('print');
            this.$htmlToPaper('bricksAndPiecesList');
        },
    },
    beforeMount() {
        this.brickList = this.$store.state.shopping.brickAndPiecesList;
    },
    computed: {
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
    },
};
</script>
