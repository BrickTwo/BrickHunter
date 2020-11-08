<template>
    <b-container class="p-0" fluid="xl">
        <b-row>
            <b-col cols="3">
                <label>Setnummer:</label>
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
        cart: true,
    }),
    mixins: [brickProcessorMixin, brickColorMixin],
    methods: {
        async loadLegoSet() {
            //console.log(this.setNumber);
            if (this.setNumber.length > 0) {
                var response = await browser.runtime.sendMessage({
                    contentScriptQuery: 'getLegoSet',
                    setNumber: this.setNumber,
                });

                if (!response) {
                    this.setNumberExist = false;
                    return;
                }

                //console.log(response);
                this.setNumberExist = true;
                this.name = response.set.locale['de-de'].title;

                this.fillPartList(response.bricks);
            } else {
                this.setNumberExist = false;
            }
        },
        fillPartList(parts) {
            //console.log(parts);

            parts.map((item) => {
                //var newItem = {};
                item.itemid = item.designId;
                item.searchids = item.itemid;
                item.color = this.findLegoColor(
                    item.colorFamily,
                    this.COLOR
                );
                item.qty = {
                    min: 0,
                    have: 0,
                    balance: 0,
                    order: 0,
                };
                item.have = 0;
                if (item.itemQuantity) {
                    item.qty.min = item.itemQuantity;
                }
                item.itemtype = 'P';
                item.image = `https://img.bricklink.com/ItemImage/${item.itemtype}T/${item.color?.brickLinkId}/${item.itemid}.t1.png`;
                item.bricksAndPieces = null;
                item.pickABrick = null;
                item.brickLink = null;
            });
            this.wantedList = [...parts];
            console.log(this.wantedList);
            //this.totalBricks = this.wantedList.length;
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
    computed: {
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
