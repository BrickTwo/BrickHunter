<template>
    <b-container class="p-0" fluid="xl">
        <b-row>
            <b-col cols="3">
                <label>{{ labelFile }}:</label>
            </b-col>
            <b-col cols="9">
                    <b-form-radio-group
                        v-model="showUploadField"
                        name="radio-sub-component"
                    >
                        <b-form-radio value="filePicker">Dateiupload</b-form-radio>
                        <b-form-radio value="textArea">Textfeld</b-form-radio>
                    </b-form-radio-group>
            </b-col>
        </b-row>
        <b-row v-if="showUploadField == 'textArea'">
            <b-col offset="3" cols="9">
                <xml-field
                    @load="loadXml"
                    :state="!!wantedList"
                    style="width: 100%"
                />
            </b-col>
        </b-row>
        <b-row v-if="showUploadField == 'filePicker'">
            <b-col offset="3" cols="9">
                <xml-reader
                    id="uploadXml"
                    @load="loadXml"
                    @fileName="fileName"
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="3">
                <label>{{ labelName }}:</label>
            </b-col>
            <b-col cols="9">
                <b-form-input v-model="name" :state="name.length > 0" />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="3">
                <label>{{ labelShoppingCart }}:</label>
            </b-col>
            <b-col cols="9">
                <b-form-checkbox v-model="cart" />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="9" offset="3">
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
        wantedList: null,
        name: '',
        cart: true,
        showUploadField: 'filePicker',
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

            var partList = [];

            wantedList.then((list) => {
                list[0].map((item) => {
                    var part = {};

                    part.source = 'brickLink';
                    part.itemid = item.itemid[0];
                    part.searchids = [this.cleanItemId(item.itemid)];
                    if (item.color) {
                        part.color = this.findColor(item.color[0], this.COLOR);
                    } else {
                        part.color = this.findColor(0, this.COLOR);
                    }
                    part.qty = {
                        min: 0,
                        have: 0,
                        balance: 0,
                        order: 0,
                    };
                    if (item.minqty) {
                        part.qty.min = item.minqty[0];
                    }
                    if (item.qtyfilled) {
                        part.qty.have = item.qtyfilled[0];
                    }
                    part.qty.balance = part.qty.min - part.qty.have;
                    if (part.qty.balance < 0) {
                        part.qty.balance = 0;
                    }
                    part.bricksAndPieces = null;
                    part.pickABrick = null;
                    part.brickLink = {};
                    part.brickLink.wantedList = {};
                    part.brickLink.wantedList.itemtype = item.itemtype[0];
                    if (item.maxprice) {
                        part.brickLink.wantedList.maxprice = item.maxprice[0];
                    } else {
                        part.brickLink.wantedList.maxprice = 0;
                    }
                    if (item.condition) {
                        part.brickLink.wantedList.condition = item.condition[0];
                    } else {
                        part.brickLink.wantedList.condition = null;
                    }
                    if (item.notify) {
                        part.brickLink.wantedList.notify = item.notify[0];
                    } else {
                        part.brickLink.wantedList.notify = null;
                    }

                    part.image = {
                        source: 'brickLink',
                        rsc: `https://img.bricklink.com/ItemImage/${part.brickLink.wantedList.itemtype}T/${part.color?.brickLinkId}/${part.itemid}.t1.png`,
                    };

                    partList.push(part);
                });
                this.wantedList = [...partList];
                //this.totalBricks = this.wantedList.length;

                return list;
            });
        },
        importList() {
            var totalPositionsAfterImport =
                this.$store.state.partList.totalPositions +
                this.wantedList.length;

            //console.log(totalPositionsAfterImport, this.$store.state.partList.totalPositions, this.wantedList.length);

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
                source: 'brickLink',
                positions: this.wantedList,
            };
            //console.log('importList', partList);
            this.$store.commit('partList/setPartList', partList);

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
    computed: {
        /*showUploadField() {
            if (navigator.userAgent.indexOf('Chrome') != -1) return true; //is chrome or edge
            if (this.$store.state.mode == 'standalone') return true;
            return false;
        },*/
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
