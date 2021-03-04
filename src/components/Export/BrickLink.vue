<template>
    <b-container class="bv-example-row" fluid="xl">
        <div v-if="partList.source != 'brickLink'">
            <b-row>
                <b-col>
                    Diese Liste kann aktuell nicht nach BrickLink exportiert
                    werden!
                </b-col>
            </b-row>
        </div>
        <div v-if="partList.source == 'brickLink'">
            <b-row v-if="partList.source == 'brickLink'">
                <b-col>
                    <b-button
                        variant="primary"
                        @click="onDownload"
                        :disabled="!wantedList || wantedList.length == 0"
                    >
                        {{ downloadButton }}
                    </b-button>
                    <b-button
                        variant="primary"
                        @click="onCopy"
                        :disabled="!wantedList || wantedList.length == 0"
                        style="margin-left: 5px"
                    >
                        {{ copyButton }}
                    </b-button>

                    <!-- <input type="text" value="" id="wantedList" style="position:absolute; top: 5000px"> -->
                    <textarea
                        id="wantedList"
                        style="position:absolute; top: -500px; height: 0; width: 0; z-index: -5 "
                    >
                    </textarea>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-checkbox
                        id="exportPickaBrickPrices"
                        v-model="exportPickaBrickPrices"
                    >
                        {{ usePickABrickPrices }}
                    </b-form-checkbox>
                    <b-form-checkbox
                        id="exportStonesAndPiecesPrices"
                        v-model="exportStonesAndPiecesPrices"
                    >
                        {{ useBricksAndPiecesPrices }}
                    </b-form-checkbox>
                    <b-form-checkbox
                        id="writeLegoIdInRemark"
                        v-model="writeLegoIdInRemark"
                    >
                        {{ writeLegoIdRemark }}
                    </b-form-checkbox>
                    <b-form-checkbox
                        id="writeSourceOfPriceInRemark"
                        v-model="writeSourceOfPriceInRemark"
                    >
                        {{ writePriceOriginRemark }}
                    </b-form-checkbox>

                    <b-form-group
                        :label="whatShouldBePreferred"
                        style="margin-top: 10px"
                    >
                        <b-form-radio-group
                            v-model="behaviourOnSamePrice"
                            name="behaviourOnSamePrice"
                        >
                            <b-form-radio
                                value="pickABrick"
                                :disabled="!exportPickaBrickPrices"
                                >{{ pickABrick }}</b-form-radio
                            >
                            <b-form-radio
                                value="bricksAndPieces"
                                :disabled="!exportStonesAndPiecesPrices"
                                >{{ bricksAndPieces }}</b-form-radio
                            >
                            <b-form-radio value="brickLink">{{
                                brickLink
                            }}</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>

                    <b-form-checkbox id="recalcHave" v-model="recalcHave">
                        {{ increaseHave }}
                    </b-form-checkbox>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<style scoped>
.row {
    margin-top: 5px;
}
</style>

<script>
export default {
    props: {
        partListId: {
            type: String,
        },
    },
    data() {
        return {
            exportPickaBrickPrices: null,
            exportStonesAndPiecesPrices: null,
            writeLegoIdInRemark: null,
            writeSourceOfPriceInRemark: null,
            behaviourOnSamePrice: null,
            recalcHave: null,
            wantedList: null,
            partList: null,
        };
    },
    methods: {
        onDownload() {
            let xmlContent = 'data:text/xml;charset=utf-8,';
            xmlContent += this.creatXml();

            const data = encodeURI(xmlContent);
            const link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', 'WantedList.xml');
            link.click();
        },
        onCopy() {
            var copyText = document.getElementById('wantedList');
            copyText.value = this.creatXml(false);
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand('copy');
        },
        creatXml(withHeader = true) {
            var xml2js = require('xml2js');

            var wantedList = this.createBrickLinkObject();

            var builder = new xml2js.Builder();
            var xml = builder.buildObject(wantedList);

            if (withHeader) return xml;

            var startpos = xml.substr(xml).indexOf('>') + 2;
            return xml.substr(startpos, xml.length);
        },
        createBrickLinkObject() {
            var brickLink = { INVENTORY: Array() };

            for (var i = 0; i < this.wantedList.length; i++) {
                var bricksAndPiecesPrice = 0;
                var pickABrickPrice = 0;

                if (this.wantedList[i].bricksAndPieces?.price?.amount)
                    bricksAndPiecesPrice = this.wantedList[i].bricksAndPieces
                        .price.amount;
                if (this.wantedList[i].pickABrick?.variant?.price?.centAmount)
                    pickABrickPrice =
                        this.wantedList[i].pickABrick.variant.price.centAmount /
                        100;
                var price = this.calculatePrice(
                    pickABrickPrice,
                    bricksAndPiecesPrice,
                    this.wantedList[i].brickLink?.wantedList?.maxprice
                );

                var remarks = this.wantedList[i].brickLink?.wantedList?.remarks;
                if(!remarks) remarks = '';
                if (
                    this.writeLegoIdInRemark &&
                    (price[0] === 'pickABrick' ||
                        price[0] === 'bricksAndPieces')
                ) {
                    if(remarks.length > 0) remarks += '\n';
                    remarks = 'LEGO Id: ';
                    if (price[0] === 'pickABrick')
                        remarks += this.wantedList[i].pickABrick.variant
                            .attributes.designNumber;
                    if (price[0] === 'bricksAndPieces')
                        remarks += this.wantedList[i].bricksAndPieces.designId;
                }

                if (this.writeSourceOfPriceInRemark) {
                    if (remarks.length > 0) remarks += '\n';
                    remarks += 'Source: ';
                    if (price[0] === 'pickABrick') remarks += 'Pick a Brick';
                    if (price[0] === 'bricksAndPieces')
                        remarks += 'Steine und Teile';
                    if (price[0] === 'brickLink') remarks += 'BrickLink';
                }

                var have = parseInt(this.wantedList[i].qty.have);
                if (
                    this.recalcHave &&
                    price[1] > 0 &&
                    price[0] != 'brickLink'
                ) {
                    have += parseInt(this.wantedList[i].qty.balance);
                }

                var item = {
                    ITEM: {
                        ITEMTYPE: this.wantedList[i].brickLink?.wantedList
                            ?.itemtype,
                        ITEMID: this.wantedList[i].designId,
                        COLOR: this.wantedList[i].color.brickLinkId,
                        MAXPRICE: price[1],
                        MINQTY: this.wantedList[i].qty.min,
                        QTYFILLED: have,
                        CONDITION: this.wantedList[i].brickLink?.wantedList
                            ?.condition,
                        NOTIFY: this.wantedList[i].brickLink?.wantedList
                            ?.notify,
                        REMARKS: remarks,
                    },
                };

                brickLink.INVENTORY.push(item);
            }

            return brickLink;
        },
        calculatePrice(pickABrickPrice, bricksAndPiecesPrice, brickLinkPrice) {
            if (!pickABrickPrice) pickABrickPrice = 0;
            if (!bricksAndPiecesPrice) bricksAndPiecesPrice = 0;
            if (!brickLinkPrice) brickLinkPrice = 0;

            var prices = Array();

            if (this.exportPickaBrickPrices && pickABrickPrice > 0)
                prices.push(['pickABrick', pickABrickPrice]);
            if (this.exportStonesAndPiecesPrices && bricksAndPiecesPrice > 0)
                prices.push(['bricksAndPieces', bricksAndPiecesPrice]);
            if (brickLinkPrice > 0) prices.push(['brickLink', brickLinkPrice]);

            if (prices.length == 0) return ['brickLink', '-1.0000'];
            prices = prices.sort(function(a, b) {
                return a[1] - b[1];
            });
            //console.log(prices);
            return prices[0];
        },
    },
    watch: {
        exportPickaBrickPrices: function(val, oldVal) {
            if (!val) {
                if (this.behaviourOnSamePrice == 'pickABrick') {
                    if (this.exportStonesAndPiecesPrices) {
                        this.behaviourOnSamePrice = 'bricksAndPieces';
                    } else {
                        this.behaviourOnSamePrice = 'brickLink';
                    }
                }
            }
            localStorage.setItem('exportPickaBrickPrices', val);
            localStorage.setItem(
                'behaviourOnSamePrice',
                this.behaviourOnSamePrice
            );
        },
        exportStonesAndPiecesPrices: function(val, oldVal) {
            if (!val) {
                if (this.behaviourOnSamePrice == 'bricksAndPieces') {
                    if (this.exportPickaBrickPrices) {
                        this.behaviourOnSamePrice = 'pickABrick';
                    } else {
                        this.behaviourOnSamePrice = 'brickLink';
                    }
                }
            }
            localStorage.setItem('exportStonesAndPiecesPrices', val);
            localStorage.setItem(
                'behaviourOnSamePrice',
                this.behaviourOnSamePrice
            );
        },
        writeLegoIdInRemark: function(val, oldVal) {
            localStorage.setItem('writeLegoIdInRemark', val);
        },
        writeSourceOfPriceInRemark: function(val, oldVal) {
            localStorage.setItem('writeSourceOfPriceInRemark', val);
        },
        behaviourOnSamePrice: function(val, oldVal) {
            localStorage.setItem('behaviourOnSamePrice', val);
        },
        usePickaBrick: function(val, oldVal) {
            localStorage.setItem('recalcHave', val);
        },
    },
    beforeMount() {
        this.exportPickaBrickPrices =
            localStorage.getItem('exportPickaBrickPrices') || true;
        this.exportStonesAndPiecesPrices =
            localStorage.getItem('exportStonesAndPiecesPrices') || true;
        this.writeLegoIdInRemark =
            localStorage.getItem('writeLegoIdInRemark') || true;
        this.writeSourceOfPriceInRemark =
            localStorage.getItem('writeSourceOfPriceInRemark') || true;
        this.behaviourOnSamePrice =
            localStorage.getItem('behaviourOnSamePrice') || 'bricksAndPieces';
        this.recalcHave = localStorage.getItem('recalcHave') || true;

        this.partList = this.$store.getters['partList/getPartListsById'](
            this.partListId
        );
        this.wantedList = this.partList.positions;
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
        usePickABrickPrices() {
            return browser.i18n.getMessage(
                'exportWantedList_usePickABrickPrices'
            );
        },
        useBricksAndPiecesPrices() {
            return browser.i18n.getMessage(
                'exportWantedList_useBricksAndPiecesPrices'
            );
        },
        writeLegoIdRemark() {
            return browser.i18n.getMessage(
                'exportWantedList_writeLegoIdRemark'
            );
        },
        writePriceOriginRemark() {
            return browser.i18n.getMessage(
                'exportWantedList_writePriceOriginRemark'
            );
        },
        whatShouldBePreferred() {
            return browser.i18n.getMessage(
                'exportWantedList_whatShouldBePreferred'
            );
        },
        increaseHave() {
            return browser.i18n.getMessage('exportWantedList_increaseHave');
        },
        downloadButton() {
            return browser.i18n.getMessage('exportWantedList_downloadButton');
        },
        copyButton() {
            return browser.i18n.getMessage('exportWantedList_copyButton');
        },
    },
};
</script>
