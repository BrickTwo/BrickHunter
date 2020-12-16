<template>
    <b-col cols="12" class="p-1">
        <b-container class="brick p-2">
            <b-row>
                <b-col cols="2" @click="openBrick()" style="cursor: pointer;">
                    <div :style="bgimage" />
                    <b-icon
                        icon="box-arrow-up-left"
                        aria-hidden="true"
                        style="position: absolute; bottom: 0; right: 0;"
                    />
                </b-col>
                <b-col cols="5">
                    <b-row style="overflow: hidden; white-space: nowrap;">
                        {{ brick.description }}
                    </b-row>
                    <b-row
                        ><b-col>Element:</b-col>
                        <b-col
                            class="text-right"
                            style="cursor: pointer"
                            @click="setKeyword(brick.itemNumber)"
                            >{{ brick.itemNumber }}</b-col
                        ></b-row
                    >
                    <b-row
                        ><b-col>Designnummer:</b-col>
                        <b-col
                            class="text-right"
                            style="cursor: pointer"
                            @click="setKeyword(brick.designId)"
                            >{{ brick.designId }}</b-col
                        ></b-row
                    >
                </b-col>
                <b-col cols="4">
                    <b-overlay
                        id="overlay-background"
                        :show="brick.update"
                        rounded="sm"
                        style="margin: 0 -5px; padding: 0 5px;"
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
                            Nicht auf Lager
                        </b-row>
                        <b-row v-if="!brick.localPrice">
                            <b-col>
                                <b-img
                                    :src="getFlagImgUrl(brick.country)"
                                    width="20px"
                                />
                            </b-col>
                            <b-col class="text-right">
                                {{ brick.priceAmount }}
                                {{ brick.priceCurrency }}
                            </b-col>
                        </b-row>
                        <b-row v-else>
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
                    <b-row>
                        <span
                            style="display: block; cursor: pointer"
                            @click="setColor()"
                        >
                            <div :style="colorCode"></div>
                            <span>{{ color.brickLinkName }}</span></span
                        >
                    </b-row>
                </b-col>
                <b-col cols="1" class="p-0" style="margin: -9px; right: -18px;">
                    <b-button
                        @click="addToPartList()"
                        variant="primary"
                        class="w-100 h-100"
                    >
                        <b-icon
                            icon="plus-circle"
                            font-scale="2"
                            aria-hidden="true"
                        />
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
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
        setKeyword(value) {
            this.$emit('setKeyword', value);
        },
        setColor() {
            this.$emit('setColor', this.color.id);
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
            return `background-image: url(${this.brick.imageUrl}), url('placeholder.jpg'); width: 100%; height: 100%; background-repeat: no-repeat; background-size: contain; background-position: center;`;
        },
        colorCode() {
            return `background-color: ${this.color.colorCode}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`;
        },
    },
};
</script>
