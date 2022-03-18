<template>
    <b-container>
        <b-row>
            <b-col>
                <h2>{{ titleAmountPositions }}</h2>
                {{ amountPartList }}: {{ wantedListPositions }}->{{
                    $store.getters['shopping/getBricksAndPiecesPositions']() +
                        $store.getters['shopping/getPickABrickPositions']() +
                        $store.getters['shopping/getBrickLinkPositions']() +
                        $store.getters['shopping/getNotAllocatedPositions']()
                }}
                ({{
                    $store.getters['shopping/getBricksAndPiecesBrickAmount']() +
                        $store.getters['shopping/getPickABrickBrickAmount']() +
                        $store.getters['shopping/getBrickLinkBrickAmount']() +
                        $store.getters['shopping/getNotAllocatedBrickAmount']()
                }})<br />
                <!-- {{ bricksAndPieces }}:
                {{ $store.getters['shopping/getBricksAndPiecesPositions']() }}
                ({{
                    $store.getters['shopping/getBricksAndPiecesBrickAmount']()
                }})<br /> -->
                {{ pickABrick }}:
                {{ $store.getters['shopping/getPickABrickPositions']() }}
                ({{
                    $store.getters['shopping/getPickABrickBrickAmount']()
                }})<br />
                {{ brickLink }}:
                {{ $store.getters['shopping/getBrickLinkPositions']() }}
                ({{
                    $store.getters['shopping/getBrickLinkBrickAmount']()
                }})<br />
                {{ notAllocated }}:
                {{ $store.getters['shopping/getNotAllocatedPositions']() }}
                ({{
                    $store.getters['shopping/getNotAllocatedBrickAmount']()
                }})<br />
                {{ amountTotalFoundLego }}:
                {{
                    $store.getters['shopping/getBricksAndPiecesPositions']() +
                        $store.getters['shopping/getPickABrickPositions']()
                }}

                <h2>{{ titlePrice }}</h2>
                <!-- {{ bricksAndPieces }}:
                {{ $store.state.shopping.currency }}
                {{
                    Math.round(
                        $store.getters[
                            'shopping/getBricksAndPiecesTotalPrice'
                        ]() * 100
                    ) / 100
                }}<br /> -->
                {{ pickABrick }}:
                {{ $store.state.shopping.currency }}
                {{
                    Math.round(
                        $store.getters['shopping/getPickABrickTotalPrice']() *
                            100
                    ) / 100
                }}<br />
                {{ brickLink }}: (<a id="bricklinkCurrency" href="">?</a>)
                {{
                    Math.round(
                        $store.getters['shopping/getBrickLinkTotalPrice']() *
                            100
                    ) / 100
                }}<br />
                {{ total }}: {{ $store.state.shopping.currency }}
                {{
                    Math.round(
                        ($store.getters[
                            'shopping/getBricksAndPiecesTotalPrice'
                        ]() +
                            $store.getters[
                                'shopping/getPickABrickTotalPrice'
                            ]() +
                            $store.getters[
                                'shopping/getBrickLinkTotalPrice'
                            ]()) *
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
                action: 'donate',
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
