<template>
    <b-col cols="3" class="p-1 h-100">
        <b-container class="brick p-2">
            <b-row
                class="text-center"
                style="min-height: 120px; cursor: pointer;"
                @click="openBrick()"
            >
                <!--<b-img-lazy center :src="image" style="max-height: 120px; max-width: 175px" />-->
                <div :style="bgimage" />
            </b-row>
            <b-row style="height: 48px; overflow: hidden">
                {{ brick.description }}
            </b-row>
            <b-row>
                <b-col>Element:</b-col>
                <b-col class="text-right">{{ brick.itemNumber }}</b-col>
            </b-row>
            <b-row>
                <b-col>Designnummer:</b-col>
                <b-col class="text-right">{{ brick.designId }}</b-col>
            </b-row>
            <b-overlay
                id="overlay-background"
                :show="brick.update"
                :opacity="opacity"
                :blur="blur"
                rounded="sm"
            >
                <b-row v-if="brick.isAvailable">
                    <b-col cols="10" class="p-0">Max. Menge:</b-col>
                    <b-col cols="2" class="p-0 text-right">{{
                        brick.maxAmount
                    }}</b-col>
                </b-row>
                <b-row
                    v-if="!brick.isAvailable"
                    style="background-color: #dc3545; color: white; border-radius: 0.25rem; margin: 0 -5px; padding: 0 5px;"
                >
                    AUSVERKAUFT!
                </b-row>
                <b-row>
                    <b-col>
                        <b-img
                            :src="getFlagImgUrl(brick.country)"
                            width="20px"
                        />
                    </b-col>
                    <b-col class="text-right">
                        {{ brick.priceAmount }} {{ brick.priceCurrency }}
                    </b-col>
                </b-row>
                <b-row v-if="brick.localPrice">
                    <b-col>
                        <b-img
                            :src="getFlagImgUrl($store.state.country)"
                            width="20px"
                        />
                    </b-col>
                    <b-col class="text-right">
                        {{ brick.localPrice.priceAmount }}
                        {{ brick.localPrice.priceCurrency }}
                    </b-col>
                </b-row>
            </b-overlay>
            <b-row style="display: block;oveflow: hidden;white-space: nowrap;">
                <div :style="colorCode"></div>
                <span style="white-space: nowrap;">{{
                    color.brickLinkName
                }}</span>
            </b-row>
        </b-container>
        <b-button
            @click="addToPartList()"
            variant="primary"
            class="w-100"
            style="margin-top: -5px"
        >
            Hinzufügen
        </b-button>
        <BrickModal :brick="brick" />
    </b-col>
</template>

<style scoped>
.brick {
    border: 1px solid gray;
    border-radius: 0.25rem;
}
.row {
    margin: 0;
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
        bgimage() {
            return `background-image: url(${this.brick.imageUrl}), url('placeholder.jpg'); width: 100%; background-repeat: no-repeat; background-size: contain; background-position: center;`;
        },
        colorCode() {
            return `background-color: ${this.color.colorCode}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`;
        },
    },
};
</script>
