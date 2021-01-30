<template>
    <vuetable
        ref="vuetable"
        :dataManager="dataManager"
        :api-mode="false"
        :fields="fields"
        :table-height="tableHeight"
        :showSortIcons="showSort"
        :sortOrder="sortOrder"
        :css="css.table"
        :key="key"
    >
        <template slot="quantity" slot-scope="props">
            <b-form-input
                v-if="edit"
                v-model="props.rowData.qty.min"
                type="number"
            />
            <div v-if="limitMaxQty > 0 && !edit">
                <div v-if="props.rowData.qty.maxAmount">
                    <div
                        v-if="
                            props.rowData.qty.order >
                                props.rowData.qty.maxAmount
                        "
                    >
                        <span id="maxqty" style="color: red">
                            {{ props.rowData.qty.maxAmount }}
                        </span>
                        <br />
                        <span style="color: grey; font-size: small;">
                            [{{ props.rowData.qty.order }}]
                        </span>
                    </div>
                    <div v-else>
                        {{ props.rowData.qty.order }}
                    </div>
                </div>
                <div v-else>
                    {{ props.rowData.qty.min }}
                </div>
                <div v-if="props.rowData.qty.order > limitMaxQty">
                    <span id="maxqty" style="color: red">
                        {{ limitMaxQty }}
                    </span>
                    <br />
                    <span style="color: grey; font-size: small;">
                        [{{ props.rowData.qty.order }}]
                    </span>
                </div>
                <div v-if="props.rowData.qty.have > 0">
                    {{ props.rowData.qty.order }}
                </div>
            </div>
            <div v-else-if="!edit">
                <span id="maxqty">
                    {{ props.rowData.qty.min }}
                </span>
                <div v-if="props.rowData.qty.have > 0">
                    <br />
                    <span style="color: grey; font-size: small;">
                        ({{ props.rowData.qty.have }})
                    </span>
                </div>
            </div>
        </template>
        <template slot="brickLinkPrice" slot-scope="props">
            <b-form-input
                v-if="edit"
                v-model="props.rowData.brickLink.wantedList.maxprice"
                type="number"
            />
            <div
                v-if="
                    props.rowData.brickLink &&
                        props.rowData.brickLink.wantedList &&
                        props.rowData.brickLink.wantedList.maxprice > 0 &&
                        !edit
                "
            >
                {{ props.rowData.brickLink.wantedList.maxprice }}
            </div>
        </template>
        <template slot="pickABrick" slot-scope="props">
            <div v-if="!props.rowData.pickABrick" />
            <div v-else-if="props.rowData.pickABrick.isLoading">
                <b-icon
                    icon="arrow-clockwise"
                    animation="spin"
                    font-scale="1.5"
                />
            </div>
            <div
                v-else-if="props.rowData.pickABrick.error && edit"
                style="cursor: pointer;"
                @click="reloadPickABrickPosition(props.rowData)"
            >
                <span style="display: block">
                    <b-icon
                        icon="exclamation-triangle-fill"
                        style="margin-right: 5px;"
                        variant="danger"
                    />
                    <span style="color: grey; font-size: small;"
                        >Error: {{ props.rowData.pickABrick.error }}</span
                    >
                </span>
                <span style="color: #007bff;">
                    {{ label_reload }}
                </span>
            </div>
            <div v-else-if="props.rowData.pickABrick.error">
                <span style="display: block">
                    <b-icon
                        icon="exclamation-triangle-fill"
                        style="margin-right: 5px;"
                        variant="danger"
                    />
                    <span style="color: grey; font-size: small;"
                        >Error: {{ props.rowData.pickABrick.error }}</span
                    >
                </span>
            </div>
            <div v-else>
                {{ props.rowData.pickABrick.variant.price.currencyCode }}
                {{ props.rowData.pickABrick.variant.price.centAmount / 100
                }}<br />
                <span style="color: grey; font-size: small;">
                    [{{
                        props.rowData.pickABrick.variant.attributes
                            .designNumber
                    }}/{{ props.rowData.pickABrick.variant.id }}]
                </span>
            </div>
        </template>
        <template slot="bricksAndPieces" slot-scope="props">
            <div v-if="!props.rowData.bricksAndPieces" />
            <div v-else-if="props.rowData.bricksAndPieces.isLoading">
                <b-icon
                    icon="arrow-clockwise"
                    animation="spin"
                    font-scale="1.5"
                />
            </div>
            <div
                v-else-if="props.rowData.bricksAndPieces.error && edit"
                style="cursor: pointer;"
                @click="reloadBricksAndPiecesPosition(props.rowData)"
            >
                <span style="display: block">
                    <b-icon
                        icon="exclamation-triangle-fill"
                        style="margin-right: 5px;"
                        variant="danger"
                    />
                    <span style="color: grey; font-size: small;"
                        >Error: {{ props.rowData.bricksAndPieces.error }}</span
                    >
                </span>
                <span style="color: #007bff;">
                    {{ label_reload }}
                </span>
            </div>
            <div v-else-if="props.rowData.bricksAndPieces.error">
                <span style="display: block">
                    <b-icon
                        icon="exclamation-triangle-fill"
                        style="margin-right: 5px;"
                        variant="danger"
                    />
                    <span style="color: grey; font-size: small;"
                        >Error: {{ props.rowData.bricksAndPieces.error }}</span
                    >
                </span>
            </div>
            <div v-else>
                {{ props.rowData.bricksAndPieces.price.currency }}
                {{ props.rowData.bricksAndPieces.price.amount }}<br />
                <span style="color: grey; font-size: small;">
                    [{{ props.rowData.bricksAndPieces.designId }}/{{
                        props.rowData.bricksAndPieces.itemNumber
                    }}]
                </span>
            </div>
        </template>
        <template slot="actions" slot-scope="props">
            <b-icon
                v-if="edit"
                icon="trash"
                aria-hidden="true"
                @click="deletePosition(props.rowData)"
                style="cursor: pointer"
            />
        </template>
    </vuetable>
</template>

<style>
.table {
    margin-bottom: 0px;
}

.vuetable-body-wrapper {
    overflow-x: hidden;
    overflow-y: hidden;
}

i.icon.sort:before {
    content: '\f0dc';
}

@font-face {
    font-family: Icons;
    src: url(/fonts/fa-solid-900.eot?#iefix) format('embedded-opentype'),
        url(/fonts/fa-solid-900.woff2) format('woff2'),
        url(/fonts/fa-solid-900.woff) format('woff'),
        url(/fonts/fa-solid-900.ttf) format('truetype'),
        url(/fonts/fa-solid-900.svg#icons) format('svg');
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-decoration: inherit;
    text-transform: none;
}

i.icon {
    font-family: Icons;
    font-style: normal;
    float: none !important;
    margin-left: 5px;
}

i.icon.chevron.up:before {
    content: '\f0de';
}

i.icon.chevron.down:before {
    content: '\f0dd';
}
</style>

<script>
import Vuetable from 'vuetable-2/src/components/Vuetable';

export default {
    props: {
        bricklist: {
            type: Array,
        },
        limitMaxQty: {
            type: Number,
            default: 0,
        },
        edit: {
            type: Boolean,
            default: false,
        },
        showSort: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        list: null,
        key: 0,
        tableHeight: '290px',
        sortOrder: [
            {
                field: 'designId',
                direction: 'asc',
            },
        ],
        css: {
            table: {
                tableClass:
                    'ui blue selectable celled stackable attached table',
                loadingClass: 'loading',
                ascendingIcon: 'blue chevron up icon',
                descendingIcon: 'blue chevron down icon',
                ascendingClass: 'sorted-asc',
                descendingClass: 'sorted-desc',
                sortableIcon: 'blue chevron sort icon',
                detailRowClass: 'vuetable-detail-row',
                handleIcon: 'grey sidebar icon',
                tableBodyClass:
                    'vuetable-semantic-no-top vuetable-fixed-layout',
                tableHeaderClass: 'vuetable-fixed-layout',
            },
        },
        fields: [
            {
                name: 'designId',
                sortField: 'designId',
                title: () => browser.i18n.getMessage('brickList_designId'),
                width: '90px',
            },
            {
                name: 'itemNumber',
                sortField: 'itemNumber',
                title: () => browser.i18n.getMessage('brickList_itemNumber'),
                width: '90px',
            },
            {
                name: 'image',
                title: () =>
                    browser.i18n.getMessage('brickList_brickLinkImage'),
                callback: 'showImage',
                width: '60px',
            },
            {
                name: 'color',
                sortField: 'color.brickLinkName',
                title: () =>
                    browser.i18n.getMessage('brickList_brickLinkColor'),
                callback: 'showColor',
                width: '200px',
            },
            {
                name: '__slot:quantity',
                sortField: 'qty.min',
                title: () => browser.i18n.getMessage('brickList_quantity'),
                width: '70px',
            },
            {
                name: '__slot:brickLinkPrice',
                sortField: 'brickLink.wantedList.maxprice',
                title: () =>
                    browser.i18n.getMessage('brickList_brickLinkPrice'),
                callback: 'brickLinkPrice',
                width: '90px',
            },
            {
                name: '__slot:pickABrick',
                sortField: 'pickABrick.variant.price.centAmount',
                title: () =>
                    browser.i18n.getMessage('brickList_pickABrickPrice'),
                //callback: 'pickABrickPrice',
                width: '110px',
            },
            {
                name: '__slot:bricksAndPieces',
                sortField: 'bricksAndPieces.price.amount',
                title: () =>
                    browser.i18n.getMessage('brickList_bricksAndPiecesPrice'),
                //callback: 'bricksAndPiecesPrice',
                width: '120px',
            },
            {
                name: '__slot:actions',
                title: '',
                width: '25px',
            },
        ],
    }),
    components: {
        Vuetable,
    },
    methods: {
        dataManager(sortOrder, pagination) {
            if (sortOrder.length) {
                this.list.sort(
                    this.compareValues(
                        sortOrder[0].sortField,
                        sortOrder[0].direction
                    )
                );
            }

            return this.list;
        },
        compareValues(key, order = 'asc') {
            var keys = key.split('.');
            return function innerSort(a, b) {
                var varA = a;
                var varB = b;

                keys.forEach((key) => {
                    if (!varA || !varA.hasOwnProperty(key)) {
                        // property doesn't exist on either object
                        varA = '';
                    } else {
                        varA =
                            typeof varA[key] === 'string'
                                ? varA[key].toUpperCase()
                                : varA[key];
                    }
                    if (!varB || !varB.hasOwnProperty(key)) {
                        // property doesn't exist on either object
                        varB = '';
                    } else {
                        varB =
                            typeof varB[key] === 'string'
                                ? varB[key].toUpperCase()
                                : varB[key];
                    }
                });

                let comparison = 0;
                if (varA > varB) {
                    comparison = 1;
                } else if (varA < varB) {
                    comparison = -1;
                }
                return order === 'desc' ? comparison * -1 : comparison;
            };
        },
        showImage(value) {
            if (value.rsc) {
                return `<img src="${value.rsc}" style="max-height:50px; max-width:60px;">`;
            } else {
                return `<img src="https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${value.itemId}.jpg" style="max-height:50px; max-width:60px;">`;
            }
        },
        showColor(value) {
            if (!value) return;
            return `<span style="display: block"><div style="background-color: ${value.colorCode}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block"></div><span>${value.brickLinkName}</span></span><span style="color: grey; font-size: small; margin-left: 20px">[${value.legoName}]</span>`;
        },
        deletePosition(item) {
            if (item.color.id == 1) {
                this.list = this.list.filter((pos) => {
                    return (
                        pos.designId != item.designId ||
                        pos.color.legoName != item.color.legoName
                    );
                });
            } else {
                this.list = this.list.filter((pos) => {
                    return (
                        pos.designId != item.designId ||
                        pos.color.brickLinkId != item.color.brickLinkId
                    );
                });
            }
            this.$emit('itemDeleted', item);
            this.key++;
        },
        reloadPickABrickPosition(position) {
            this.$emit('reloadPickABrickPosition', position);
        },
        reloadBricksAndPiecesPosition(position) {
            this.$emit('reloadBricksAndPiecesPosition', position);
        },
    },
    beforeMount() {
        this.list = this.bricklist;
        if (this.$store.state.mode == 'standalone') {
            this.tableHeight = 'calc(100vh - 260px)';
        }
        if (
            this.list.filter((p) => p.brickLink?.wantedList?.maxprice > 0)
                .length == 0
        ) {
            this.fields = this.fields.filter(
                (field) => field.name != '__slot:brickLinkPrice'
            );
        }

        if (this.list.filter((p) => p.itemNumber).length == 0) {
            this.fields = this.fields.filter(
                (field) => field.name != 'itemNumber'
            );
        }

        this.list.map((pos) => {
            if (pos.brickLink?.wantedList?.maxprice) {
                if (pos.brickLink.wantedList.maxprice <= 0)
                    pos.brickLink.wantedList.maxprice = 0;
                pos.brickLink.wantedList.maxprice = parseFloat(
                    pos.brickLink.wantedList.maxprice
                );
            }
        });
    },
    watch: {
        showSort: async function(val) {
            var findItemNumber = this.fields.find(
                (field) => field.name === 'itemNumber'
            );
            var findBrickLinkPrice = this.fields.find(
                (field) => field.name === '__slot:brickLinkPrice'
            );

            if (val) {
                this.fields.find(
                    (field) => field.name === 'designId'
                ).sortField = 'designId';

                if (findItemNumber) findItemNumber.sortField = 'itemNumber';

                this.fields.find((field) => field.name === 'color').sortField =
                    'color.brickLinkName';

                this.fields.find(
                    (field) => field.name === '__slot:quantity'
                ).sortField = 'qty.min';

                if (findBrickLinkPrice)
                    findBrickLinkPrice.sortField =
                        'brickLink.wantedList.maxprice';

                this.fields.find(
                    (field) => field.name === '__slot:pickABrick'
                ).sortField = 'pickABrick.variant.price.centAmount';

                this.fields.find(
                    (field) => field.name === '__slot:bricksAndPieces'
                ).sortField = 'bricksAndPieces.price.amount';

                this.key++;
                return;
            }
            delete this.fields.find((field) => field.name === 'designId')
                .sortField;
            if (findItemNumber) delete findItemNumber.sortField;
            delete this.fields.find((field) => field.name === 'color')
                .sortField;
            delete this.fields.find((field) => field.name === '__slot:quantity')
                .sortField;
            if (findBrickLinkPrice) delete findBrickLinkPrice.sortField;
            delete this.fields.find(
                (field) => field.name === '__slot:pickABrick'
            ).sortField;
            delete this.fields.find(
                (field) => field.name === '__slot:bricksAndPieces'
            ).sortField;
            this.key++;
        },
    },
    computed: {
        label_reload() {
            return browser.i18n.getMessage('brickList_reload');
        },
    },
};
</script>
