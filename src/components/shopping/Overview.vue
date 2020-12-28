<template>
    <b-container>
        <b-row>
            <b-col>
                <h2>{{ titleAmountPositions }}</h2>
                {{ amountPartList }}:
                {{ $store.state.shopping.wantedListPositionsMerged }} ({{
                    wantedListPositions
                }})<br />
                {{ bricksAndPieces }}:
                {{ $store.state.shopping.bricksAndPiecesPositions }}<br />
                {{ pickABrick }}: {{ $store.state.shopping.pickABrickPositions
                }}<br />
                {{ brickLink }}: {{ $store.state.shopping.brickLinkPositions
                }}<br />
                {{ notAllocated }}:
                {{ $store.state.shopping.notAllocatedPositions }}<br />
                {{ amountTotalFoundLego }}:
                {{
                    $store.state.shopping.bricksAndPiecesPositions +
                        $store.state.shopping.pickABrickPositions
                }}

                <h2>{{ titlePrice }}</h2>
                {{ bricksAndPieces }}:
                {{ $store.state.shopping.currency }}
                {{
                    Math.round(
                        $store.state.shopping.bricksAndPiecesPrice * 100
                    ) / 100
                }}<br />
                {{ pickABrick }}:
                {{ $store.state.shopping.currency }}
                {{
                    Math.round($store.state.shopping.pickABrickPrice * 100) /
                        100
                }}<br />
                {{ brickLink }}: (<a id="bricklinkCurrency" href="">?</a>)
                {{ Math.round($store.state.shopping.brickLinkPrice * 100) / 100
                }}<br />
                {{ total }}: {{ $store.state.shopping.currency }}
                {{
                    Math.round(
                        ($store.state.shopping.bricksAndPiecesPrice +
                            $store.state.shopping.pickABrickPrice +
                            $store.state.shopping.brickLinkPrice) *
                            100
                    ) / 100
                }}
                <b-tooltip target="bricklinkCurrency" variant="danger">{{
                    brickLinkCurrencyInfo
                }}</b-tooltip>
            </b-col>
            <b-col>
                <h1>{{ donateTitle }}</h1>
        <p>{{ donateText }}</p>
        <img
            alt=""
            border="0"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
            @click="donate()"
            style="cursor: pointer"
        />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    data() {
        return {
            wantedListPositions: 0,
        };
    },
    methods: {
        donate() {
            browser.runtime.sendMessage({
                contentScriptQuery: 'donate',
            });
        },
    },
    beforeMount() {
        if (this.$store.state.shopping.wantedList.length)
            this.wantedListPositions = this.$store.state.shopping.wantedList.length;
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
        notAllocated() {
            return browser.i18n.getMessage('shopping_notAllocated');
        },
        titleAmountPositions() {
            return browser.i18n.getMessage('shopping_titleAmountPositions');
        },
        amountPartList() {
            return browser.i18n.getMessage('shopping_amountPartList');
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
        donateTitle() {
            return browser.i18n.getMessage('info_donateTitel');
        },
        donateText() {
            return browser.i18n.getMessage('info_donateText');
        },
    },
};
</script>
