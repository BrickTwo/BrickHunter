<template>
    <b-col cols="3">
        <b-container>
            <b-row class="text-center">
                <img :src="image" width="120px" />
            </b-row>
            <b-row>
                {{ brick.description }}
            </b-row>
            <b-row>Element: {{ brick.itemNumber }}</b-row>
            <b-row>Designnummer: {{ brick.designId }}</b-row>
            <b-row>{{ brick.priceAmount }} {{ brick.priceCurrency }}</b-row>
            <b-row>
                <span style="display: block"
                    ><div
                        :style="colorCode"
                    ></div>
                    <span>{{color.brickLinkName}}</span></span
                >
            </b-row>
            <b-row>
<span style="color: grey; font-size: small; margin-left: 20px"
                    >[{{color.legoName}}]</span
                >
            </b-row>
        </b-container>
    </b-col>
</template>

<script>
import { brickColorMixin } from '@/mixins/brickColorMixin';

export default {
    props: {
        brick: {
            type: Object,
        },
    },
    data: () => ({
        color: null,
    }),
    mixins: [brickColorMixin],
    methods: {},
    beforeMount() {
        this.color = this.COLOR.find(
            (c) => c.bricksAndPiecesName == this.brick.colorFamily
        );
    },
    computed: {
        image() {
            return `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${this.brick.itemNumber}.jpg`;
        },
        colorCode() {
            return `background-color: ${this.color.colorCode}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`;
        }
    },
};
</script>
