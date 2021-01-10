import { mapState, mapMutations } from 'vuex';

export const shoppingMixin = {
    computed: mapState({
        shopping: (state) => state.shopping.all,
    }),
    methods: {
        ...mapMutations('shopping', [
            'setWantedList',
            'addToBricksAndPiecesList',
            'clearBricksAndPiecesList',
            'addToPickABrickList',
            'clearPickABrickList',
            'addToBrickLinkList',
            'clearBrickLinkList',
            'addToNotAllocatedList',
            'clearNotallocatedList',
        ]),
        calcTotalPrice() {
            this.clearBricksAndPiecesList();
            this.clearPickABrickList();
            this.clearBrickLinkList();
            this.clearNotallocatedList();

            if (this.$store.state.shopping.wantedList) {
                this.$store.state.shopping.wantedList.forEach((item) => {
                    if (this.$store.state.shopping.settings.useHave && item.source == 'brickLink') {
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
                            item.brickLink?.wantedList?.maxprice
                        );
                        if (price[1]) {
                            if (price[0] == 'bricksAndPieces') {
                                this.addToBricksAndPiecesList(item);
                            } else if (price[0] == 'pickABrick') {
                                this.addToPickABrickList(item);
                            } else if (price[0] == 'brickLink' || item.source == 'brickLink') {
                                this.addToBrickLinkList(item);
                            } else {
                                this.addToNotAllocatedList(item);
                            }
                        } else {
                            if (price[0] == 'brickLink' || item.source == 'brickLink') {
                                this.addToBrickLinkList(item);
                            } else {
                                this.addToNotAllocatedList(item);
                            }
                        }
                    }
                });

                if (
                    this.$store.state.shopping.settings.selectedPrio1 != 'brickLink' &&
                    this.$store.state.shopping.settings.selectedPrio2 != 'brickLink' &&
                    this.$store.state.shopping.settings.selectedPrio3 != 'brickLink'
                ) {
                    this.clearBrickLinkList();
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
            if (this.$store.state.shopping.settings.ignoreBrickLinkPrice) brickLinkPrice = 0;

            var prices = Array();

            if (
                this.$store.state.shopping.settings.selectedPrio1 == 'bricksAndPieces' &&
                bricksAndPiecesPrice
            ) {
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            } else if (
                this.$store.state.shopping.settings.selectedPrio1 == 'pickABrick' &&
                pickABrickPrice
            ) {
                prices.push(['pickABrick', pickABrickPrice]);
            } else if (
                this.$store.state.shopping.settings.selectedPrio1 == 'brickLink' &&
                brickLinkPrice
            ) {
                prices.push(['brickLink', brickLinkPrice]);
            }

            if (
                this.$store.state.shopping.settings.selectedPrio2 == 'bricksAndPieces' &&
                bricksAndPiecesPrice
            ) {
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            } else if (
                this.$store.state.shopping.settings.selectedPrio2 == 'pickABrick' &&
                pickABrickPrice
            ) {
                prices.push(['pickABrick', pickABrickPrice]);
            } else if (
                this.$store.state.shopping.settings.selectedPrio2 == 'brickLink' &&
                brickLinkPrice
            ) {
                prices.push(['brickLink', brickLinkPrice]);
            }

            if (
                this.$store.state.shopping.settings.selectedPrio3 == 'bricksAndPieces' &&
                bricksAndPiecesPrice
            ) {
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            } else if (
                this.$store.state.shopping.settings.selectedPrio3 == 'pickABrick' &&
                pickABrickPrice
            ) {
                prices.push(['pickABrick', pickABrickPrice]);
            } else if (
                this.$store.state.shopping.settings.selectedPrio3 == 'brickLink' &&
                brickLinkPrice
            ) {
                prices.push(['brickLink', brickLinkPrice]);
            }

            if (prices.length == 0) {
                prices.push(['notAllocated', 0]);
            }

            prices = prices.sort(function(a, b) {
                return a[1] - b[1];
            });

            return prices[0];
        },
    },
};
