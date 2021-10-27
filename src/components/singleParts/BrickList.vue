<template>
    <b-col cols="12" class="p-1">
        <b-container class="brick p-2">
            <b-row>
                <b-col cols="2" @click="openBrick()" style="cursor: pointer;">
                    <div :style="bgimage" />
                    <b-icon
                        v-if="favorite"
                        @click.stop
                        icon="heart-fill"
                        aria-hidden="true"
                        font-scale="1.25"
                        style="position: absolute; top: 0; right: 0;"
                        variant="danger"
                        @click="removeFavorite(brick.itemNumber)"
                    />
                    <b-icon
                        v-else
                        @click.stop
                        icon="heart"
                        aria-hidden="true"
                        font-scale="1.25"
                        style="position: absolute; top: 0; right: 0;"
                        variant="danger"
                        @click="addFavorite(brick.itemNumber)"
                    />
                    <b-icon
                        v-if="haveIt"
                        @click.stop
                        icon="check-circle-fill"
                        aria-hidden="true"
                        font-scale="1.25"
                        style="position: absolute; top: 25; right: 0;"
                        variant="success"
                        @click="removeHaveIt(brick.itemNumber)"
                    />
                    <b-icon
                        v-else
                        @click.stop
                        icon="check-circle"
                        aria-hidden="true"
                        font-scale="1.25"
                        style="position: absolute; top: 25; right: 0;"
                        variant="success"
                        @click="addHaveIt(brick.itemNumber)"
                    />
                    <b-icon
                        icon="box-arrow-up-left"
                        aria-hidden="true"
                        style="position: absolute; bottom: 0; right: 0;"
                    />
                    <div style="position: absolute; top: 0px; left: 0px;">
                        <font-awesome-icon
                            v-if="itemNumberSelect || designIdSelect"
                            @click.stop
                            :icon="['fab', 'telegram-plane']"
                            @click="showNotificationHandler(brick.itemNumber)"
                            :id="`popover-1-${brick.itemNumber}`"
                            style="height: 20px; width: 20px; color: #0088CC;"
                        />
                        <font-awesome-icon
                            v-else
                            @click.stop
                            :icon="['fab', 'telegram-plane']"
                            @click="showNotificationHandler(brick.itemNumber)"
                            :id="`popover-1-${brick.itemNumber}`"
                            style="height: 20px; width: 20px;"
                        />
                        <b-popover
                            :showNotification="
                                showNotification == brick.itemNumber
                            "
                            :target="`popover-1-${brick.itemNumber}`"
                            placement="bottomright"
                            triggers="click blur"
                        >
                            <b-form-checkbox
                                v-model="itemNumberSelect"
                                @change="
                                    editNotificationItemNumber(brick.itemNumber)
                                "
                            >
                                {{ labelElement }}
                            </b-form-checkbox>
                            <b-form-checkbox
                                v-model="designIdSelect"
                                @change="
                                    editNotificationDesignId(brick.designId)
                                "
                            >
                                {{ labelDesignNumber }}
                            </b-form-checkbox>
                        </b-popover>
                    </div>
                </b-col>
                <b-col cols="5">
                    <b-row style="overflow: hidden; white-space: nowrap;">
                        {{ brick.description }}
                    </b-row>
                    <b-row
                        ><b-col>{{ labelElement }}:</b-col>
                        <b-col
                            class="text-right"
                            style="cursor: pointer"
                            @click="setKeyword(brick.itemNumber)"
                            >{{ brick.itemNumber }}</b-col
                        ></b-row
                    >
                    <b-row
                        ><b-col>{{ labelDesignNumber }}:</b-col>
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
                        <b-row v-if="isAvailable">
                            <b-col cols="10" class="p-0"
                                >{{ labelMaxAmount }}:</b-col
                            >
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
                                {{ brick.priceAmount }}
                                {{ brick.priceCurrency }}
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
                        v-if="order <= 0"
                        @click="addToPartList()"
                        variant="primary"
                        class="w-100 h-100"
                        style="border-radius: 0 0.25rem 0.25rem 0"
                    >
                        <b-icon
                            icon="plus-circle"
                            font-scale="2"
                            aria-hidden="true"
                        />
                    </b-button>
                    <b-container v-else class=" p-0 w-100 h-100 pos">
                        <b-row class="pl-1 pr-1" style="height: 33%">
                            <b-col class="m-0 p-0 text-center">
                                <b-icon
                                    icon="dash-circle"
                                    style="cursor: pointer"
                                    aria-hidden="true"
                                    @click="editQuantity(-1)"
                                />
                            </b-col>
                            <b-col class="m-0 p-0 text-center">
                                <b-icon
                                    icon="plus-circle"
                                    style="cursor: pointer"
                                    aria-hidden="true"
                                    @click="editQuantity(1)"
                                />
                            </b-col> </b-row
                        ><b-row class="pl-1 pr-1" style="height: 33%">
                            <b-col class="m-0 p-0 text-center">
                                <b-form-input
                                    style="height: 24px"
                                    class="m-0 p-0 w-100 text-right"
                                    type="number"
                                    v-model="order"
                                />
                            </b-col> </b-row
                        ><b-row class="pl-1 pr-1" style="height: 33%">
                            <b-col
                                class="m-0 p-0 text-center"
                                style="color:#dc3545"
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
    border-radius: 0 0.25rem 0.25rem 0;
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
import { bus } from '@/utility/bus';

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
        haveIt: false,
        showNotification: null,
        itemNumberSelect: false,
        designIdSelect: false,
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
        addHaveIt(itemNumber) {
            this.haveIt = true;
            this.$store.commit('singleParts/addHaveIt', itemNumber);
        },
        removeHaveIt(itemNumber) {
            this.haveIt = false;
            this.$store.commit('singleParts/removeHaveIt', itemNumber);
        },
        editNotificationItemNumber(itemNumber) {
            if (this.itemNumberSelect) {
                this.addNotificationItemNumber(itemNumber);
            } else {
                this.removeNotificationItemNumber(itemNumber);
            }
        },
        addNotificationItemNumber(itemNumber) {
            this.$store.commit(
                'singleParts/addNotificationItemNumber',
                itemNumber
            );
        },
        removeNotificationItemNumber(itemNumber) {
            this.$store.commit(
                'singleParts/removeNotificationItemNumber',
                itemNumber
            );
        },
        editNotificationDesignId(designId) {
            if (this.designIdSelect) {
                this.addNotificationDesignId(designId);
            } else {
                this.removeNotificationDesignId(designId);
            }
            bus.$emit('ChangeNotification', {});
        },
        addNotificationDesignId(designId) {
            this.$store.commit('singleParts/addNotificationDesignId', designId);
        },
        removeNotificationDesignId(designId) {
            this.$store.commit(
                'singleParts/removeNotificationDesignId',
                designId
            );
        },
        showNotificationHandler(itemNumber) {
            if (this.showNotification == itemNumber) {
                this.showNotification = null;
            } else {
                this.showNotification = itemNumber;
            }
        },
    },
    beforeMount() {
        let color = this.COLOR.filter(
            (c) =>
                c.bricksAndPiecesName.toUpperCase() ==
                this.brick.colorFamily.toUpperCase()
        );

        this.color = color[color.length - 1];

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

        this.haveIt = this.$store.getters['singleParts/isHaveIt'](
            this.brick.itemNumber
        );

        this.designIdSelect = this.$store.getters[
            'singleParts/isNotificationDesignId'
        ](this.brick.designId);

        this.itemNumberSelect = this.$store.getters[
            'singleParts/isNotificationItemNumber'
        ](this.brick.itemNumber);
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
    created() {
        bus.$on('ChangeNotification', () => {
            this.designIdSelect = this.$store.getters[
                'singleParts/isNotificationDesignId'
            ](this.brick.designId);
        });
    },
};
</script>
