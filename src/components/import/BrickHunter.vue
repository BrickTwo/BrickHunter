<template>
    <b-container class="p-0" fluid="xl">
        <b-row>
            <b-col cols="3">
                <label>{{ labelFile }}:</label>
            </b-col>
            <b-col cols="9">
                <json-reader
                    id="uploadJson"
                    @load="loadJson"
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
import JsonReader from './JsonReader';
import { brickColorMixin } from '@/mixins/brickColorMixin';

export default {
    data: () => ({
        partList: null,
        name: '',
        override: true,
    }),
    components: {
        JsonReader,
    },
    mixins: [brickColorMixin],
    methods: {
        fileName(fileName) {
            this.name = fileName.substring(0, fileName.length - 4);
        },
        loadJson(partList) {
            this.name = partList.name;

            console.log(partList, this.name, this.name.length)

            if(partList.version != '1.0') return;
            if(!partList.positions) return;
            console.log(partList.source)
            if(partList.source != 'brickLink' && partList.source != 'lego' && partList.source != 'singleParts') return;

            let notValide = false;

            partList.positions.map(position => {
                if(!position.source) notValide = true;
                if(!position.designId) notValide = true;
                if(!position.color) notValide = true;
                if(!position.qty) position.qty = {
                    min: 0,
                    have: 0,
                    balance: 0,
                    order: 0,
                };
                if(!position.image) notValide = true;
                if(!position.bricksAndPieces) position.bricksAndPieces = null;
                if(!position.pickABrick) position.pickABrick = null;
                if(!position.brickLink) position.brickLink = null;
            });

            if (notValide) return;

            this.partList = partList;
        },
        importList() {
            if(!this.override) {
                this.partList.id = this.generateUUID()
            }

            if(this.name) this.partList.name = this.name;
            if(!this.partList.date) this.partList.date = new Date(0, 0, 0, 0, 0, 0, 0);
            if(!this.partList.cart) this.partList.cart = true;

            //console.log('importList', partList);
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
        labelFile() {
            return browser.i18n.getMessage('import_file');
        },
        labelName() {
            return browser.i18n.getMessage('import_name');
        },
        labelOverride() {
            return browser.i18n.getMessage('import_override');
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
    },
};
</script>
