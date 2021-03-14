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
                <b-icon
                    v-if="favorite"
                    @click.stop
                    icon="heart-fill"
                    aria-hidden="true"
                    font-scale="1.25"
                    style="position: absolute; top: 10px; right: 10px;"
                    variant="danger"
                    @click="removeFavorite(brick.itemNumber)"
                />
                <b-icon
                    v-else
                    @click.stop
                    icon="heart"
                    aria-hidden="true"
                    font-scale="1.25"
                    style="position: absolute; top: 10px; right: 10px;"
                    variant="danger"
                    @click="addFavorite(brick.itemNumber)"
                />
                <b-icon
                    icon="box-arrow-up-left"
                    aria-hidden="true"
                    style="position: absolute; top: 110px; right: 10px;"
                />
            </b-row>
            <b-row style="height: 48px; overflow: hidden;">
                {{ brick.description }}
            </b-row>
            <b-row>
                <b-col>{{ labelElement }}:</b-col>
                <b-col
                    class="text-right"
                    style="cursor: pointer"
                    @click="setKeyword(brick.itemNumber)"
                    >{{ brick.itemNumber }}</b-col
                >
            </b-row>
            <b-row>
                <b-col md="auto" class="p-0">{{ labelDesignNumber }}:</b-col>
                <b-col
                    class="text-right"
                    style="cursor: pointer"
                    @click="setKeyword(brick.designId)"
                    >{{ brick.designId }}</b-col
                >
            </b-row>
            <b-overlay
                id="overlay-background"
                :show="brick.update"
                rounded="sm"
                style="margin: 0 -5px; padding: 0 5px;"
            >
                <b-row v-if="isAvailable">
                    <b-col cols="10" class="p-0">{{ labelMaxAmount }}:</b-col>
                    <b-col cols="2" class="p-0 text-right">{{
                        brick.maxAmount
                    }}</b-col>
                </b-row>
                <b-row
                    v-if="!isAvailable"
                    style="background-color: #dc3545; color: white; border-radius: 0.25rem; margin: 0 -5px; padding: 0 5px;"
                >
                    {{ labelNotInStock }}
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
            </b-overlay>
            <b-row
                style="display: block;oveflow: hidden;white-space: nowrap; cursor: pointer"
                @click="setColor()"
            >
                <div :style="colorCode"></div>
                <span style="white-space: nowrap;">{{
                    color.brickLinkName
                }}</span>
            </b-row>
        </b-container>
        <b-button
            v-if="order <= 0"
            @click="addToPartList()"
            variant="primary"
            class="w-100"
            style="margin-top: -5px; border-radius: 0 0 0.25rem 0.25rem"
        >
            <b-icon icon="plus-circle" aria-hidden="true" /> {{ labelAdd }}
        </b-button>
        <b-container v-else class="pos" style="margin-top: -5px;">
            <b-row>
                <b-col class="m-0 p-0 text-center" style="max-width:15%">
                    <b-icon
                        icon="dash-circle"
                        style="cursor: pointer"
                        aria-hidden="true"
                        @click="editQuantity(-1)"
                    />
                </b-col>
                <b-col class="m-0 p-0 text-center" style="max-width:50%">
                    <b-form-input
                        style="height: 24px"
                        class="m-0 p-0 text-right"
                        type="number"
                        v-model="order"
                    />
                </b-col>
                <b-col class="m-0 p-0 text-center" style="max-width:15%">
                    <b-icon
                        icon="plus-circle"
                        style="cursor: pointer"
                        aria-hidden="true"
                        @click="editQuantity(1)"
                    />
                </b-col>
                <b-col class="m-0 p-0 text-center" style="max-width:5%">
                </b-col>
                <b-col
                    class="m-0 p-0 text-right"
                    style="max-width:15%; color:#dc3545"
                >
                    <b-icon
                        icon="trash"
                        style="cursor: pointer"
                        aria-hidden="true"
                        @click="removeFromPartList()"
                    />
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
.pos {
    border: 1px solid #ffc107;
    border-radius: 0 0 0.25rem 0.25rem;
    background-color: #ffc107;
    padding: 6px 0.5rem;
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
        order: 0,
        favorite: false,
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
            this.order = 1;
            /*if (this.$store.state.partList.totalPositions >= 2000) {
                this.order = 0;
                this.brick.order = this.order;
            }*/
            this.$emit('addToPartList', this.brick);
        },
        setKeyword(value) {
            this.$emit('setKeyword', value);
        },
        setColor() {
            this.$emit('setColor', this.color.id);
        },
        editQuantity(value) {
            this.order = parseInt(this.order) + parseInt(value);
        },
        removeFromPartList() {
            this.order = 0;
        },
        addFavorite(itemNumber) {
            this.favorite = true;
            this.$store.commit('singleParts/addFavorite', itemNumber);
        },
        removeFavorite(itemNumber) {
            this.favorite = false;
            this.$store.commit('singleParts/removeFavorite', itemNumber);
        },
    },
    beforeMount() {
        this.color = this.COLOR.find(
            (c) =>
                c.bricksAndPiecesName.toUpperCase() ==
                this.brick.colorFamily.toUpperCase()
        );
        if (!this.color) {
            this.color = this.COLOR.find((c) => c.brickLinkId == 0);
            this.color.legoName = this.brick.colorFamily;
            this.color.bricksAndPiecesName = this.brick.colorFamily;
            this.color.pickABrickName = this.brick.colorFamily;
        }

        if (this.brick.order) {
            this.order = this.brick.order;
        }

        this.favorite = this.$store.getters['singleParts/isFavorite'](
            this.brick.itemNumber
        );
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
        buttonVariant() {
            if (this.brick.order && this.brick.order > 0) {
                return 'warning';
            }
            return 'primary';
        },
        labelElement() {
            return browser.i18n.getMessage('import_sp_element');
        },
        labelDesignNumber() {
            return browser.i18n.getMessage('import_sp_designNumber');
        },
        labelMaxAmount() {
            return browser.i18n.getMessage('import_sp_maxAmount');
        },
        labelNotInStock() {
            return browser.i18n.getMessage('import_sp_notInStock');
        },
        labelAdd() {
            return browser.i18n.getMessage('import_sp_add');
        },
        isAvailable() {
            if (!parseInt(this.brick.isAvailable)) return false;
            if (!!parseInt(this.brick.isSoldOut)) return false;
            if (this.brick.maxAmount <= 0) return false;
            if (this.brick.priceAmount <= 0) return false;
            return true;
        },
    },
    watch: {
        order: function() {
            if (this.order < 0) {
                this.order = 0;
            }
            this.brick.order = this.order;
            this.$emit('setOrderQuantity', this.brick);
        },
    },
};
</script>
