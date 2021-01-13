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
        key: 0,
        tableHeight: '290px',
        sortOrder: [
            {
                field: 'itemid',
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
                name: 'itemid',
                sortField: 'itemid',
                title: () => browser.i18n.getMessage('brickList_itemId'),
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
            /*{
                name: 'qty',
                title: () => browser.i18n.getMessage('brickList_quantity'),
                callback: 'showQty',
                width: '50px',
            },*/
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
                name: 'pickABrick',
                sortField: 'pickABrick.variant.price.centAmount',
                title: () =>
                    browser.i18n.getMessage('brickList_pickABrickPrice'),
                callback: 'pickABrickPrice',
                width: '110px',
            },
            {
                name: 'bricksAndPieces',
                sortField: 'bricksAndPieces.price.amount',
                title: () =>
                    browser.i18n.getMessage('brickList_bricksAndPiecesPrice'),
                callback: 'bricksAndPiecesPrice',
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
                this.bricklist.sort(
                    this.compareValues(
                        sortOrder[0].sortField,
                        sortOrder[0].direction
                    )
                );
            }

            return this.bricklist;
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
        brickLinkPrice(value) {
            if (value?.wantedList?.maxprice < 0) return;
            return value?.wantedList?.maxprice;
        },
        pickABrickPrice(value) {
            if (!value) return '';
            if (value.isLoading) return this.spinner();

            var returnValue = `${value.variant.price.currencyCode} ${value
                .variant.price.centAmount /
                100}<br><span style="color: grey; font-size: small;">[${
                value.variant.attributes.designNumber
            }/${value.variant.id}]</span>`;
            return returnValue;
        },
        bricksAndPiecesPrice(value) {
            if (!value) return '';
            if (value.isLoading) return this.spinner();
            var returnValue = `${value.price.currency} ${value.price.amount}<br><span style="color: grey; font-size: small;">[${value.designId}/${value.itemNumber}]</span>`;
            return returnValue;
        },
        lineNumber(value) {
            return value + 1;
        },
        showQty(value) {
            if (this.limitMaxQty > 0) {
                if (value.maxAmount) {
                    if (value.order > value.maxAmount) {
                        return `<span id="maxqty" style="color: red">${value.maxAmount}</span><br><span style="color: grey; font-size: small;">[${value.order}]</span>`;
                    }
                    return value.order;
                }
                if (value.order > this.limitMaxQty)
                    return `<span id="maxqty" style="color: red">${this.limitMaxQty}</span><br><span style="color: grey; font-size: small;">[${value.order}]</span>`;
                if (value.have > 0) return value.order;
            } else {
                if (value.have > 0)
                    return `<span id="maxqty">${value.min}</span><br><span style="color: grey; font-size: small;">(${value.have})</span>`;
            }
            return value.min;
        },
        spinner() {
            return '<svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="arrow clockwise" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-arrow-clockwise b-icon bi b-icon-animation-spin" style="font-size: 150%;"><g><path fill-rule="evenodd" d="M3.17 6.706a5 5 0 0 1 7.103-3.16.5.5 0 1 0 .454-.892A6 6 0 1 0 13.455 5.5a.5.5 0 0 0-.91.417 5 5 0 1 1-9.375.789z"></path><path fill-rule="evenodd" d="M8.147.146a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 1 1-.707-.708L10.293 3 8.147.854a.5.5 0 0 1 0-.708z"></path></g></svg>';
        },
        deletePosition(item) {
            this.bricklist = this.bricklist.filter((pos) => {
                return (
                    pos.itemid != item.itemid ||
                    pos.color.brickLinkId != item.color.brickLinkId
                );
            });
            this.$emit('itemDeleted', item);
            this.key++;
        },
    },
    beforeMount() {
        if (this.$store.state.mode == 'standalone') {
            this.tableHeight = 'calc(100vh - 260px)';
        }
        if (
            this.bricklist.filter((p) => p.brickLink?.wantedList?.maxprice > 0)
                .length == 0
        ) {
            this.fields = this.fields.filter(
                (field) => field.name != '__slot:brickLinkPrice'
            );
        }
        this.bricklist.map((pos) => {
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
            if (val) {
                this.fields.find((field) => field.name === 'itemid').sortField =
                    'itemid';
                this.fields.find((field) => field.name === 'color').sortField =
                    'color.brickLinkName';
                this.fields.find(
                    (field) => field.name === '__slot:quantity'
                ).sortField = 'qty.min';
                this.fields.find(
                    (field) => field.name === '__slot:brickLinkPrice'
                ).sortField = 'brickLink.wantedList.maxprice';
                this.fields.find(
                    (field) => field.name === 'pickABrick'
                ).sortField = 'pickABrick.variant.price.centAmount';
                this.fields.find(
                    (field) => field.name === 'bricksAndPieces'
                ).sortField = 'bricksAndPieces.price.amount';
                this.key++;
                return;
            }
            delete this.fields.find((field) => field.name === 'itemid')
                .sortField;
            delete this.fields.find((field) => field.name === 'color')
                .sortField;
            delete this.fields.find((field) => field.name === '__slot:quantity')
                .sortField;
            delete this.fields.find(
                (field) => field.name === '__slot:brickLinkPrice'
            ).sortField;
            delete this.fields.find((field) => field.name === 'pickABrick')
                .sortField;
            delete this.fields.find((field) => field.name === 'bricksAndPieces')
                .sortField;
            this.key++;
        },
    },
};
</script>
