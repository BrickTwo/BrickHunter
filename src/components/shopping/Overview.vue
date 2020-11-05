<template>
    <div>
        <h2>{{ titleAmountPositions }}</h2>
        {{ amountPartList }}:
        {{ $store.state.shopping.wantedListPositionsMerged }} ({{
            wantedListPositions
        }})<br />
        {{ bricksAndPieces }}:
        {{ $store.state.shopping.bricksAndPiecesPositions }}<br />
        {{ pickABrick }}: {{ $store.state.shopping.pickABrickPositions }}<br />
        {{ brickLink }}: {{ $store.state.shopping.brickLinkPositions }}<br />
        {{ amountTotalFoundLego }}:
        {{
            $store.state.shopping.bricksAndPiecesPositions +
                $store.state.shopping.pickABrickPositions
        }}

        <h2>{{ titlePrice }}</h2>
        {{ bricksAndPieces }}: {{ $store.state.shopping.currency }}
        {{ $store.state.shopping.bricksAndPiecesPrice }}<br />
        {{ pickABrick }}: {{ $store.state.shopping.currency }}
        {{ $store.state.shopping.pickABrickPrice }}<br />
        {{ brickLink }}: (<a id="bricklinkCurrency" href="">?</a>)
        {{ $store.state.shopping.brickLinkPrice }}<br />
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            wantedListPositions: 0,
        };
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
    },
};
</script>
