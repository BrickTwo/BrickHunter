<template>
    <b-container fluid="lg">
        <b-row v-if="!isChrome">
            <b-col sm="3">
                <label>{{ labelFile }}:</label>
            </b-col>
            <b-col sm="9">
                <xml-field
                    @load="loadXml"
                    :state="!!wantedList"
                    style="width: 650px"
                />
            </b-col>
        </b-row>
        <b-row v-if="isChrome"
            ><b-col sm="3">
                <label>{{ labelFile }}:</label>
            </b-col>
            <b-col sm="9">
                <xml-reader
                    id="uploadXml"
                    @load="loadXml"
                    @fileName="fileName"
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="3">
                <label>{{ labelName }}:</label>
            </b-col>
            <b-col sm="9">
                <b-form-input v-model="name" :state="name.length > 0" />
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="3">
                <label>{{ labelShoppingCart }}:</label>
            </b-col>
            <b-col sm="9">
                <b-form-checkbox v-model="cart" />
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="9" offset-md="3">
                <b-button
                    variant="primary"
                    class="button"
                    @click="importList()"
                    :disabled="name.length == 0 || !wantedList"
                >
                    {{ labelImport }}
                </b-button>
                <b-button variant="danger" class="button" @click="clear()">
                    {{ labelClear }}
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import XmlReader from './XmlReader';
import XmlField from './XmlField';
import { brickProcessorMixin } from '@/mixins/brickProcessorMixin';
import { brickColorMixin } from '@/mixins/brickColorMixin';

export default {
    data: () => ({
        isChrome: navigator.userAgent.indexOf('Chrome') != -1,
        wantedList: null,
        name: '',
        cart: true,
    }),
    components: {
        XmlReader,
        XmlField,
    },
    mixins: [brickProcessorMixin, brickColorMixin],
    methods: {
        fileName(fileName) {
            this.name = fileName.substring(0, fileName.length - 4);
        },
        loadXml(wantedList) {
            //console.log(wantedList)
            this.pickABrickBrickCounter = 0;
            this.bricksAndPiecesBrickCounter = 0;

            wantedList.then((list) => {
                list[0].map((item) => {
                    item.itemtype = item.itemtype[0];
                    item.itemid = item.itemid[0];
                    //console.log(this.ItemIdToDesignId(item.itemid))
                    item.searchids = [this.cleanItemId(item.itemid)];
                    item.designid = '';
                    if (item.color) {
                        item.color = item.color[0];
                        item.color = this.findColor(item.color, this.COLOR);
                    } else {
                        item.color = this.findColor(0, this.COLOR);
                    }
                    if (item.maxprice) {
                        item.maxprice = item.maxprice[0];
                    } else {
                        item.maxprice = 0;
                    }
                    item.qty = {
                        min: 0,
                        have: 0,
                        balance: 0,
                        order: 0,
                    };
                    if (item.minqty) {
                        item.qty.min = item.minqty[0];
                    }
                    if (item.qtyfilled) {
                        item.qty.have = item.qtyfilled[0];
                    }
                    item.qty.balance = item.qty.min - item.qty.have;
                    if (item.qty.balance < 0) {
                        item.qty.balance = 0;
                    }
                    if (item.condition) {
                        item.condition = item.condition[0];
                    } else {
                        item.condition = null;
                    }
                    if (item.notify) {
                        item.notify = item.notify[0];
                    } else {
                        item.notify = null;
                    }
                    item.image = `https://img.bricklink.com/ItemImage/${item.itemtype}T/${item.color?.brickLinkId}/${item.itemid}.t1.png`;
                    item.bricksAndPieces = null;
                    item.pickABrick = null;
                    item.brickLink = null;
                });
                this.wantedList = [...list[0]];
                this.totalBricks = this.wantedList.length;

                return list;
            });
        },
        importList() {
            var totalPositionsAfterImport =
                this.$store.state.totalPositions + this.wantedList.length;

            if (totalPositionsAfterImport > 2000) {
                this.$bvToast.toast(
                    this.labelErrorImportBrickLinkTextToManyPositions,
                    {
                        title: this.labelImportBrickLinkTitle,
                        autoHideDelay: 5000,
                        variant: 'danger',
                    }
                );
                return;
            }

            var partList = {
                id: this.generateUUID(),
                name: this.name,
                cart: this.cart,
                date: new Date(0, 0, 0, 0, 0, 0, 0),
                positions: this.wantedList,
            };
            //console.log('importList', partList);
            this.$store.commit('setPartList', partList);

            this.$bvToast.toast(this.labelSuccessfullImportBrickLinkText, {
                title: this.labelImportBrickLinkTitle,
                autoHideDelay: 5000,
                variant: 'success',
            });

            this.clear();
        },
        clear() {
            this.wantedList = [];
            this.name = '';
            this.cart = true;
            eventHub.$emit('clearWantedList', '');
        },
        generateUUID() {
            // Public Domain/MIT
            var d = new Date().getTime();
            if (
                typeof performance !== 'undefined' &&
                typeof performance.now === 'function'
            ) {
                d += performance.now(); //use high-precision timer if available
            }
            var newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                /[xy]/g,
                function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
                }
            );

            return newGuid;
        },
    },
    beforeMount() {
        this.wantedList = JSON.parse(
            localStorage.getItem('wantedList') || null
        );
        this.totalBricks = 0;
        if (this.wantedList) this.totalBricks = this.wantedList.length;
    },
    computed: {
        labelFile() {
            return browser.i18n.getMessage('import_file');
        },
        labelName() {
            return browser.i18n.getMessage('import_name');
        },
        labelShoppingCart() {
            return browser.i18n.getMessage('import_shoppingCart');
        },
        labelImport() {
            return browser.i18n.getMessage('import_importButton');
        },
        labelClear() {
            return browser.i18n.getMessage('import_clearButton');
        },
        labelImportBrickLinkTitle() {
            return browser.i18n.getMessage(
                'import_successfullImportBrickLinkTitle'
            );
        },
        labelSuccessfullImportBrickLinkText() {
            return browser.i18n.getMessage(
                'import_successfullImportBrickLinkText'
            );
        },
        labelErrorImportBrickLinkTextToManyPositions() {
            return browser.i18n.getMessage(
                'import_errorImportBrickLinkTextToManyPositions'
            );
        },
    },
};
</script>
