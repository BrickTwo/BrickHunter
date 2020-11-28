<template>
    <b-col cols="3">
        <b-container @click="openBrick()">
            <b-row class="text-center">
                <img :src="image" width="120px" />
            </b-row>
            <b-row>
                {{ brick.description }}
            </b-row>
            <b-row>Element: {{ brick.itemNumber }}</b-row>
            <b-row>Designnummer: {{ brick.designId }}</b-row>
            <b-row>
                <b-col>
                    {{ brick.priceAmount }} {{ brick.priceCurrency }}
                </b-col>
                <b-col class="text-right">
                    {{ brick.maxAmount }}
                </b-col>
            </b-row>
            <b-row>
                <span style="display: block"
                    ><div :style="colorCode"></div>
                    <span>{{ color.brickLinkName }}</span></span
                >
            </b-row>
        </b-container>
        <BrickModal :brick="brick" />
    </b-col>
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
        showModal: false,
    }),
    components: {
        BrickModal,
    },
    mixins: [brickColorMixin],
    methods: {
        openBrick() {
            this.$bvModal.show(`modal-${this.brick.itemNumber}`);
        },
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
