<template>
    <div>
        <b-nav tabs>
            <b-nav-item
                :active="page == 'brickLink'"
                @click="page = 'brickLink'"
                >{{ brickLink }}</b-nav-item
            >
            <b-nav-item
                :active="page == 'bricksAndPieces'"
                @click="page = 'bricksAndPieces'"
                >{{ bricksAndPieces }}</b-nav-item
            >
            <b-nav-item
                :active="page == 'pickABrick'"
                @click="page = 'pickABrick'"
                >{{ pickABrick }}</b-nav-item
            >
        </b-nav>
        <div v-if="page == 'brickLink'">
            <p style="margin-top: 5px; margin-bottom: 5px;"></p>
            <b-container fluid>
                <b-row class="my-1" v-if="!isChrome"
                    ><b-col sm="2">
                        <label>Datei:</label>
                    </b-col>
                    <b-col sm="10">
                        <xml-field
                            @load="loadXml"
                            style="width: 650px"
                        ></xml-field> </b-col
                ></b-row>
                <b-row class="my-1" v-if="isChrome"
                    ><b-col sm="2">
                        <label>Datei:</label>
                    </b-col>
                    <b-col sm="10">
                        <xml-reader
                            id="uploadXml"
                            @load="loadXml"
                        ></xml-reader> </b-col
                ></b-row>
                <b-row class="my-1">
                    <b-col sm="2">
                        <label>Name:</label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-input
                            v-model="name"
                            :state="name.length > 0"
                        ></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="my-1">
                    <b-col sm="2">
                        <label>Warenkorb:</label>
                    </b-col>
                    <b-col sm="10">
                        <b-form-checkbox
                            id="checkbox-1"
                            v-model="cart"
                            name="checkbox-1"
                        ></b-form-checkbox>
                    </b-col>
                </b-row>
                <b-row class="my-1">
                    <b-col sm="2"> </b-col>
                    <b-col sm="10">
                        <b-button
                            id="btn-pickABrick-add-to-card"
                            variant="primary"
                            @click="importList()"
                            :disabled="name.length == 0 || !wantedList"
                            >Importieren</b-button
                        >
                        <b-button
                            variant="danger"
                            style="margin-left: 10px;"
                            @click="clear()"
                            >Zurücksetzen</b-button
                        >
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import XmlReader from './XmlReader';
import XmlField from './XmlField';
import { brickProcessorMixin } from '@/mixins/brickProcessorMixin';
import { brickColorMixin } from '@/mixins/brickColorMixin';
//import { requestsMixin } from '@/mixins/requestsMixin';
//import { brickLinkProcessorMixin } from '@/mixins/brickLinkProcessorMixin';

export default {
    data: () => ({
        page: 'brickLink',
        isChrome: navigator.userAgent.indexOf('Chrome') != -1,
        wantedList: [],
        name: '',
        cart: true,
    }),
    components: {
        XmlReader,
        XmlField,
    },
    mixins: [
        brickProcessorMixin,
        brickColorMixin,
        //requestsMixin,
        //brickLinkProcessorMixin,
    ],
    methods: {
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
            var partList = {
                id: this.generateUUID(),
                name: this.name,
                cart: this.cart,
                date: new Date(0,0,0,0,0,0,0),
                positions: this.wantedList,
            };
            console.log("importList", partList)
            this.$store.commit('setPartList', partList);
        },
        clear() {
            this.wantedList = [];
            this.name = '';
            this.cart = true;
            eventHub.$emit('clearWantedList', '');
        },
        generateUUID: function() {
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
        pickABrick() {
            return browser.i18n.getMessage('pickABrick');
        },
        bricksAndPieces() {
            return browser.i18n.getMessage('bricksAndPieces');
        },
        brickLink() {
            return browser.i18n.getMessage('brickLink');
        },
    },
};
</script>
