<template>
    <b-modal
        :id="id"
        :title="brick.description"
        :header-bg-variant="headerBgVariant"
        :header-text-variant="headerTextVariant"
        centered
        @ok="bricksAndPiecesFillCart()"
    >
        <b-container @click="openBrick()">
            <b-row class="text-center">
                <img :src="image" width="120px" />
            </b-row>
            <b-row>
                Beschreibung {{ brick.description }}
            </b-row>
            <b-row>Element: {{ brick.itemNumber }}</b-row>
            <b-row>Designnummer: {{ brick.designId }}</b-row>
            <b-row>{{ brick.priceAmount }} {{ brick.priceCurrency }}</b-row>
            <b-row>
                Farbe BrickLink: <span style="display: block"
                    ><div :style="colorCode"></div>
                    <span>{{ color.brickLinkName }}</span></span
                >
            </b-row>
            <b-row>
                Farbe LEGO: <span style="display: block"
                    ><div :style="colorCode"></div>
                    <span>{{ color.legoName }}</span></span
                >
            </b-row>
            <b-row>Max Bestellmeng: {{ brick.maxAmount }}</b-row>
            <b-row>Erstmalig Verfügbar: {{ brick.firstSeen }}</b-row>
            <b-row>Letztmalig Verfügbar: {{ brick.lastSeen }}</b-row>
            <b-row>Aktualisiert: {{ brick.lastUpdate }}</b-row>
            <b-row>Category: {{ brick.categoryId }}</b-row>
            <b-row>Verfügabr: {{ brick.isAvailable }}</b-row>
        </b-container>
        <template #modal-footer="{ cancel, ok }">
            <b-button @click="cancel()">
                cancel
            </b-button>
            <!-- Button with custom close trigger value -->
            <b-button @click="ok()">
                ok
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import { brickColorMixin } from '@/mixins/brickColorMixin';
import BrickModal from './BrickModal';

export default {
    props: {
        brick: {
            type: Object,
        },
    },
    data: () => ({
        color: null,
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
    }),
    components: {
        BrickModal,
    },
    mixins: [brickColorMixin],
    methods: {
        openBrick() {
            this.$bvModal.show('modal-open-lego-fill-cart');
        },
        bricksAndPiecesFillCart() {},
        cancel() {},
        ok() {},
    },
    beforeMount() {
        this.color = this.COLOR.find(
            (c) => c.bricksAndPiecesName == this.brick.colorFamily
        );
        if (!this.color) {
            this.color = this.COLOR.find((c) => c.brickLinkId == 0);
            this.color.legoName = this.brick.colorFamily;
            this.color.bricksAndPiecesName = this.brick.colorFamily;
            this.color.pickABrickName = this.brick.colorFamily;
        }
    },
    computed: {
        id() {
            return `modal-${this.brick.itemNumber}`;
        },
        image() {
            //return `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${this.brick.itemNumber}.jpg`;
            return this.brick.imageUrl;
        },
        colorCode() {
            return `background-color: ${this.color.colorCode}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`;
        },
    },
};
</script>
