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
                    <b-form-radio value="filePicker">
                        {{ labelFileUpload }}
                    </b-form-radio>
                    <b-form-radio value="textArea">
                        {{ labelImport_textArea }}
                    </b-form-radio>
                </b-form-radio-group>
            </b-col>
        </b-row>
        <b-row v-if="showUploadField == 'textArea'">
            <b-col offset="3" cols="9">
                <StringField
                    @load="onFileChange"
                    :state="!!partList"
                    style="width: 100%"
                />
            </b-col>
        </b-row>
        <b-row v-if="showUploadField == 'filePicker'">
            <b-col offset="3" cols="9">
                <FileReader id="uploadFile" @load="onFileChange" />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="3">
                <label>{{ labelFileFormat }}:</label>
            </b-col>
            <b-col cols="9">
                <b-form-select
                    disabled
                    v-model="selectedSource"
                    :options="sourceOptions"
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
        <b-row v-if="selectedSource=='BrickHunter'">
            <b-col cols="3">
                <label>{{ labelOverride }}:</label>
            </b-col>
            <b-col cols="9">
                <b-form-checkbox v-model="override" />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="9" offset="3">
                <b-button
                    variant="primary"
                    class="button"
                    @click="importList()"
                    :disabled="name.length == 0 || !partList"
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
import FileReader from './FileReader';
import StringField from './StringField';
import { brickColorMixin } from '@/mixins/brickColorMixin';
import brickBrickLink from '@/utility/brick/bricklink.js';

export default {
    data: () => ({
        partList: null,
        name: '',
        cart: true,
        override: true,
        showUploadField: 'filePicker',
        sourceOptions: [
            {
                value: 'Unknown',
                text: browser.i18n.getMessage('import_fileFormatUnknown'),
            },
            {
                value: 'BrickHunter',
                text: browser.i18n.getMessage('extName'),
            },
            {
                value: 'BrickLink',
                text: browser.i18n.getMessage('brickLink'),
            },
        ],
        selectedSource: 'Unknown',
    }),
    components: {
        FileReader,
        StringField,
    },
    mixins: [brickColorMixin],
    methods: {
        onFileChange(returnObject) {
            console.log(returnObject)
            this.partList = null;
            this.name = '';

            switch (returnObject.fileType.toLowerCase()) {
                case 'xml':
                    this.selectedSource = 'BrickLink';
                    this.partListFromBrickLink(returnObject);
                    break;
                case 'json':
                    this.selectedSource = 'BrickHunter';
                    this.partListFromBrickHunter(returnObject);
                    break;
                default:
                    this.selectedSource = 'Unknown';
            }
        },
        partListFromBrickHunter(returnObject) {
            let partList = returnObject.content;
            this.name = partList.name;
            this.cart = partList.cart;

            if (partList.version != '1.0') return;
            if (!partList.positions) return;

            if (
                partList.source != 'brickLink' &&
                partList.source != 'lego' &&
                partList.source != 'singleParts'
            )
                return;

            let notValide = false;

            partList.positions.map((position) => {
                if (!position.source) notValide = true;
                if (!position.designId) notValide = true;
                if (!position.color) notValide = true;
                if (!position.qty)
                    position.qty = {
                        min: 0,
                        have: 0,
                        balance: 0,
                        order: 0,
                    };
                if (!position.image) notValide = true;
                if (!position.bricksAndPieces) position.bricksAndPieces = null;
                if (!position.pickABrick) position.pickABrick = null;
                if (!position.brickLink) position.brickLink = null;
            });

            if (notValide) return;

            this.partList = partList;
        },
        partListFromBrickLink(returnObject) {
            this.name = returnObject.fileName.substring(
                0,
                returnObject.fileName.length - 4
            );

            var partList = [];
            returnObject.content.inventory.item.map((item) => {
                var part = {};

                part.source = 'brickLink';
                part.designId = item.itemid[0];
                part.searchids = [brickBrickLink.cleanDesignId(part.designId)];
                if (item.color) {
                    part.color = this.findColor(item.color[0], this.COLOR);
                } else {
                    part.color = this.findColor(9999, this.COLOR);
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
                if (item.remarks) {
                    part.brickLink.wantedList.remarks = item.remarks[0];
                } else {
                    part.brickLink.wantedList.remarks = null;
                }

                part.image = {
                    source: 'brickLink',
                    rsc: `https://img.bricklink.com/ItemImage/${part.brickLink.wantedList.itemtype}N/${part.color?.brickLinkId}/${part.designId}.png`,
                };

                partList.push(part);
            });

            this.partList = [...partList];
        },
        importList() {
            switch (this.selectedSource) {
                case 'BrickLink':
                    this.importBrickLink();
                    break;
                case 'BrickHunter':
                    this.importBrickHunter();
                    break;
            }
        },
        importBrickLink() {
            var partList = {
                id: this.generateUUID(),
                name: this.name,
                cart: this.cart,
                date: new Date(0, 0, 0, 0, 0, 0, 0),
                source: 'brickLink',
                positions: this.partList,
                version: '1.0',
            };

            this.$store.commit('partList/setPartList', partList);

            this.$bvToast.toast(this.labelSuccessfullImportBrickLinkText, {
                title: this.labelImportBrickLinkTitle,
                autoHideDelay: 5000,
                variant: 'success',
            });

            this.clear();
        },
        importBrickHunter() {
            if (!this.override) {
                this.partList.id = this.generateUUID();
            }

            if (this.name) this.partList.name = this.name;
            if (!this.partList.date)
                this.partList.date = new Date(0, 0, 0, 0, 0, 0, 0);
            this.partList.cart = this.cart;

            this.$store.commit('partList/setPartList', this.partList);

            this.$bvToast.toast(this.labelSuccessfullImportBrickLinkText, {
                title: this.labelImportBrickLinkTitle,
                autoHideDelay: 5000,
                variant: 'success',
            });

            this.clear();
        },
        clear() {
            this.partList = null;
            this.name = '';
            this.cart = true;
            eventHub.$emit('clearPartList', '');
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
        labelFileUpload() {
            return browser.i18n.getMessage('import_fileUpload');
        },
        labelImport_textArea() {
            return browser.i18n.getMessage('import_textArea');
        },
        labelFileFormat() {
            return browser.i18n.getMessage('import_fileFormat');
        },
        labelOverride() {
            return browser.i18n.getMessage('import_override');
        },
    },
};
</script>
