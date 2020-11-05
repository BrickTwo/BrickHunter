import { mapState, mapMutations } from 'vuex';

export const shoppingMixin = {
    computed: mapState({
        shopping: (state) => state.shopping.all,
    }),
    methods: {
        ...mapMutations('shopping', [
            'incrementBricksAndPiecesPositions',
            'incrementPickABrickPositions',
            'incrementBrickLinkPositions',
            'resetBricksAndPiecesPositions',
            'resetPickABrickPositions',
            'resetBrickLinkPositions',
            'setWantedList',
            'addToBricksAndPiecesList',
            'clearBricksAndPiecesList',
            'addToPickABrickList',
            'clearPickABrickList',
            'addToBrickLinkList',
            'clearBrickLinkList',
            'setBricksAndPiecesPrice',
            'setPickABrickPrice',
            'setbrickLinkPrice',
            'incrementBricksAndPiecesPrice',
            'incrementPickABrickPrice',
            'incrementbrickLinkPrice',
            'setCurrency',
        ]),
        calcTotalPrice() {
            this.resetBricksAndPiecesPositions();
            this.resetPickABrickPositions();
            this.resetBrickLinkPositions();
            this.setBricksAndPiecesPrice(0);
            this.setPickABrickPrice(0);
            this.setbrickLinkPrice(0);
            this.clearBricksAndPiecesList();
            this.clearPickABrickList();
            this.clearBrickLinkList();

            if (this.$store.state.shopping.wantedList) {
                this.$store.state.shopping.wantedList.forEach((item) => {
                    if (this.$store.state.shopping.useHave) {
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
                                /*console.log(
                                    item.bricksAndPieces.maxAmount,
                                    item.qty.order
                                );*/
                                if (
                                    item.bricksAndPieces.maxAmount <
                                    item.qty.order
                                ) {
                                    item.qty.maxAmount =
                                        item.bricksAndPieces.maxAmount;
                                    this.incrementBricksAndPiecesPrice(
                                        item.qty.maxAmount * price[1]
                                    );
                                } else {
                                    this.incrementBricksAndPiecesPrice(
                                        item.qty.order * price[1]
                                    );
                                }
                                //console.log(item);
                                this.incrementBricksAndPiecesPositions();
                                this.setCurrency(
                                    item.bricksAndPieces.price.currency
                                );
                                this.fillBricksAndPiecesList(item);
                            } else if (price[0] == 'pickABrick') {
                                this.incrementPickABrickPositions();
                                this.incrementPickABrickPrice(
                                    item.qty.order * price[1]
                                );
                                this.setCurrency(
                                    item.pickABrick.variant.price.currencyCode
                                );
                                this.fillPickABrickList(item);
                            } else {
                                this.incrementBrickLinkPositions();
                                this.incrementbrickLinkPrice(
                                    item.qty.order * price[1]
                                );
                                this.fillBrickLinkList(item);
                            }
                        } else {
                            this.incrementBrickLinkPositions();
                            this.incrementbrickLinkPrice(
                                item.qty.order * price[1]
                            );
                            this.fillBrickLinkList(item);
                        }
                    }
                });

                if (
                    this.$store.state.shopping.selectedPrio1 != 'brickLink' &&
                    this.$store.state.shopping.selectedPrio2 != 'brickLink' &&
                    this.$store.state.shopping.selectedPrio3 != 'brickLink'
                ) {
                    this.resetBrickLinkPositions();
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
                this.$store.state.shopping.selectedPrio1 == 'bricksAndPieces' &&
                bricksAndPiecesPrice
            ) {
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            } else if (
                this.$store.state.shopping.selectedPrio1 == 'pickABrick' &&
                pickABrickPrice
            ) {
                prices.push(['pickABrick', pickABrickPrice]);
            } else if (
                this.$store.state.shopping.selectedPrio1 == 'brickLink' &&
                brickLinkPrice
            ) {
                prices.push(['brickLink', brickLinkPrice]);
            }

            if (
                this.$store.state.shopping.selectedPrio2 == 'bricksAndPieces' &&
                bricksAndPiecesPrice
            ) {
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            } else if (
                this.$store.state.shopping.selectedPrio2 == 'pickABrick' &&
                pickABrickPrice
            ) {
                prices.push(['pickABrick', pickABrickPrice]);
            } else if (
                this.$store.state.shopping.selectedPrio2 == 'brickLink' &&
                brickLinkPrice
            ) {
                prices.push(['brickLink', brickLinkPrice]);
            }

            if (
                this.$store.state.shopping.selectedPrio3 == 'bricksAndPieces' &&
                bricksAndPiecesPrice
            ) {
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            } else if (
                this.$store.state.shopping.selectedPrio3 == 'pickABrick' &&
                pickABrickPrice
            ) {
                prices.push(['pickABrick', pickABrickPrice]);
            } else if (
                this.$store.state.shopping.selectedPrio3 == 'brickLink' &&
                brickLinkPrice
            ) {
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
            this.addToBricksAndPiecesList(pos);
        },
        fillPickABrickList(pos) {
            this.addToPickABrickList(pos);
        },
        fillBrickLinkList(pos) {
            this.addToBrickLinkList(pos);
        },
    },
};
