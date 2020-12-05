<template>
    <b-container class="p-0" fluid="xl">
        <b-row>
            <b-col cols="3">
                <label>{{ labelSetNumber }}:</label>
            </b-col>
            <b-col cols="9">
                <b-form-input
                    v-model="setNumber"
                    @blur.native="loadLegoSet()"
                    :state="setNumberExist"
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
                <label>{{ labelUseSetNumberSuffix }}:</label>
            </b-col>
            <b-col cols="9">
                <b-form-checkbox v-model="setNumberSuffix" />
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
import { brickProcessorMixin } from '@/mixins/brickProcessorMixin';
import { brickColorMixin } from '@/mixins/brickColorMixin';

export default {
    data: () => ({
        wantedList: [],
        setNumber: '',
        setNumberExist: false,
        name: '',
        setName: '',
        setNumberSuffix: true,
        cart: true,
    }),
    mixins: [brickProcessorMixin, brickColorMixin],
    methods: {
        async loadLegoSet() {
            if (this.setNumber.length > 0) {
                var response = await browser.runtime.sendMessage({
                    contentScriptQuery: 'getLegoSet',
                    setNumber: this.setNumber,
                });

                if (!response) {
                    this.setNumberExist = false;
                    return;
                }

                this.setNumberExist = true;
                this.name = response.set.locale['de-de'].title;
                this.setName = this.name;
                if (this.setNumberSuffix) {
                    this.name = this.setNumber + ' - ' + this.name;
                }

                this.fillPartList(response.bricks);
            } else {
                this.setNumberExist = false;
            }
        },
        fillPartList(parts) {
            var partList = [];

            parts.map((item) => {
                var part = {};

                part.source = 'lego';
                part.itemid = item.itemNumber;
                part.searchids = [part.itemid];
                part.color = this.findLegoColor(item.colorFamily, this.COLOR);
                part.qty = {
                    min: 0,
                    have: 0,
                    balance: 0,
                    order: 0,
                };
                if (item.itemQuantity) {
                    part.qty.min = item.itemQuantity;
                }
                if (item.itemQuantity) {
                    part.qty.balance = item.itemQuantity;
                }
                part.image = {
                    source: 'lego',
                    itemId: `${part.itemid}`,
                };
                part.bricksAndPieces = null;
                part.pickABrick = null;
                part.brickLink = null;
                partList.push(part);
            });

            this.wantedList = [...partList];
        },
        importList() {
            var totalPositionsAfterImport =
                this.$store.state.partList.totalPositions +
                this.wantedList.length;

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
                source: 'lego',
                positions: this.wantedList,
            };
            
            this.$store.commit('partList/setPartList', partList);

            this.$bvToast.toast(this.labelSuccessfullImportBrickLinkText, {
                title: this.labelImportBrickLinkTitle,
                autoHideDelay: 5000,
                variant: 'success',
            });

            this.clear();
        },
        clear() {
            this.setNumber = '';
            this.setNumberExist = false;
            this.name = '';
            this.cart = true;
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
    watch: {
        setNumberSuffix: function(val) {
            if (val) {
                this.name = this.setNumber + ' - ' + this.name;
                return;
            }
            this.name = this.setName;
        },
    },
    computed: {
        labelSetNumber() {
            return browser.i18n.getMessage('import_setNumber');
        },
        labelName() {
            return browser.i18n.getMessage('import_name');
        },
        labelUseSetNumberSuffix() {
            return browser.i18n.getMessage('import_useSetNumberSuffix');
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
