<template>
    <b-col cols="3">
        <b-container @click="openBrick()" class="brick">
            <b-row class="text-center">
                <b-img-lazy center :src="image" width="120px" alt="Center image" />
            </b-row>
            <b-row>
                {{ brick.description }}
            </b-row>
            <b-row>Element: {{ brick.itemNumber }}</b-row>
            <b-row>Designnummer: {{ brick.designId }}</b-row>
            <b-row>
                <b-col cols="2" class="p-0" >
                    <img :src="getFlagImgUrl(brick.country)" width="20px" />
                </b-col>
                <b-col cols="6" class="p-0" >
                    {{ brick.priceAmount }} {{ brick.priceCurrency }}
                </b-col>
                <b-col  cols="4" class="p-0 text-right">
                    {{ brick.maxAmount }}
                </b-col>
            </b-row>
            <b-row v-if="brick.localPrice">
                <b-col cols="2" class="p-0" >
                    <img :src="getFlagImgUrl($store.state.country)" width="20px" />
                </b-col>
                <b-col cols="6" class="p-0" >
                    {{ brick.localPrice.priceAmount }}
                    {{ brick.localPrice.priceCurrency }}
                </b-col>
                <b-col  cols="4" class="p-0 text-right">
                    {{ brick.maxAmount }}
                </b-col>
            </b-row>
            <b-row>
                <span style="display: block"
                    ><div :style="colorCode"></div>
                    <span>{{ color.brickLinkName }}</span></span
                >
            </b-row>
            <b-row v-if="brick.maxAmount <= 0">
                AUSVERKAUFT!
            </b-row>
            <b-row v-if="brick.update">
                <svg
                    viewBox="0 0 16 16"
                    width="1em"
                    height="1em"
                    focusable="false"
                    role="img"
                    aria-label="arrow clockwise"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi-arrow-clockwise b-icon bi b-icon-animation-spin"
                    style="font-size: 150%;"
                >
                    <g>
                        <path
                            fill-rule="evenodd"
                            d="M3.17 6.706a5 5 0 0 1 7.103-3.16.5.5 0 1 0 .454-.892A6 6 0 1 0 13.455 5.5a.5.5 0 0 0-.91.417 5 5 0 1 1-9.375.789z"
                        ></path>
                        <path
                            fill-rule="evenodd"
                            d="M8.147.146a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 1 1-.707-.708L10.293 3 8.147.854a.5.5 0 0 1 0-.708z"
                        ></path>
                    </g>
                </svg>
            </b-row>
            <b-row @click.stop>
                <b-button @click="addToPartList()">
                Hinzufügen
                </b-button>
            </b-row>
        </b-container>
        <BrickModal :brick="brick" />
    </b-col>
</template>

<style scoped>
.brick {
    border: 1px solid gray;
}
</style>

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
        getFlagImgUrl(value) {
            return 'flags/' + value + '.png';
        },
        addToPartList() {
            this.$emit('addToPartList', this.brick);
        }
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
