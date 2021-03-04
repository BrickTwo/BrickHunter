<template>
    <b-table
        hover
        small
        :responsive="true"
        no-border-collapse
        select-mode="multi"
        no-local-sorting
        :sticky-header="tableHeight"
        :items="bricklist"
        :primary-key="bricklist.rowNumber"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :selectable="edit"
        :busy="isBusy"
        @row-selected="onRowSelection"
        ref="selectableTable"
        class="m-0"
        :style="style"
    >
        <template #table-colgroup="scope">
            <col
                v-for="field in scope.fields"
                :key="field.key"
                :style="{ width: field.width }"
            />
        </template>
        <template #head(selected)>
            <b-form-checkbox :v-model="selectAll" @change="onAllSelection" />
        </template>
        <template #cell(selected)="data">
            <b-form-checkbox
                :checked="data.rowSelected"
                @change="selectRow(data.index, !data.rowSelected)"
            />
        </template>
        <template #cell(image)="data">
            <img
                v-if="data.value.rsc"
                :src="data.value.rsc"
                style="max-height:50px; max-width:60px;"
            />
            <img
                v-else
                :src="calcImage(data.value)"
                style="max-height:50px; max-width:60px;"
            />
        </template>
        <template #cell(color)="data">
            <div v-if="data.value">
                <span style="display: block">
                    <div :style="calcColor(data.value)" />
                    <span>{{ data.value.brickLinkName }}</span>
                </span>
                <span
                    v-if="data.value.legoName"
                    style="color: grey; font-size: small; margin-left: 20px"
                >
                    [{{ data.value.legoName }}]
                </span>
            </div>
        </template>
        <template #cell(qty)="data">
            <b-form-input v-if="edit" v-model="data.value.min" type="number" />
            <div v-if="limitMaxQty > 0 && !edit">
                <div v-if="data.value.maxAmount">
                    <div v-if="data.value.order > data.value.maxAmount">
                        <span id="maxqty" style="color: red">
                            {{ data.value.maxAmount }}
                        </span>
                        <br />
                        <span style="color: grey; font-size: small;">
                            [{{ data.value.order }}]
                        </span>
                    </div>
                    <div v-else>
                        {{ data.value.order }}
                    </div>
                </div>
                <div v-else>
                    {{ data.value.min }}
                </div>
                <div v-if="data.value.order > limitMaxQty">
                    <span id="maxqty" style="color: red">
                        {{ limitMaxQty }}
                    </span>
                    <br />
                    <span style="color: grey; font-size: small;">
                        [{{ data.value.order }}]
                    </span>
                </div>
                <div v-if="data.value.have > 0">
                    {{ data.value.order }}
                </div>
            </div>
            <div v-else-if="!edit">
                <span id="maxqty">
                    {{ data.value.min }}
                </span>
                <div v-if="data.value.have > 0">
                    <br />
                    <span style="color: grey; font-size: small;">
                        ({{ data.value.have }})
                    </span>
                </div>
            </div>
        </template>
        <template #cell(brickLink)="data">
            <b-form-input
                v-if="data.value && data.value.wantedList && edit"
                v-model="data.value.wantedList.maxprice"
                type="number"
            />
            <div
                v-if="
                    data.value &&
                        data.value.wantedList &&
                        data.value.wantedList.maxprice > 0 &&
                        !edit
                "
            >
                {{ data.value.wantedList.maxprice }}
            </div>
        </template>
        <template #cell(pickABrick)="data">
            <div v-if="!data.value" />
            <div v-else-if="data.value.isLoading">
                <b-icon
                    icon="arrow-clockwise"
                    animation="spin"
                    font-scale="1.5"
                />
            </div>
            <div
                v-else-if="data.value.error && edit"
                style="cursor: pointer;"
                @click="reloadPickABrickPosition(data.item)"
            >
                <span style="display: block">
                    <b-icon
                        icon="exclamation-triangle-fill"
                        style="margin-right: 5px;"
                        variant="danger"
                    />
                    <span style="color: grey; font-size: small;"
                        >Error: {{ data.value.error }}</span
                    >
                </span>
                <span style="color: #007bff;">
                    {{ label_reload }}
                </span>
            </div>
            <div v-else-if="data.value.error">
                <span style="display: block">
                    <b-icon
                        icon="exclamation-triangle-fill"
                        style="margin-right: 5px;"
                        variant="danger"
                    />
                    <span style="color: grey; font-size: small;"
                        >Error: {{ data.value.error }}</span
                    >
                </span>
            </div>
            <div v-else>
                {{ data.value.variant.price.currencyCode }}
                {{ data.value.variant.price.centAmount / 100 }}<br />
                <span style="color: grey; font-size: small;">
                    [{{ data.value.variant.attributes.designNumber }}/{{
                        data.value.variant.id
                    }}]
                </span>
            </div>
        </template>
        <template #cell(bricksAndPieces)="data">
            <div v-if="!data.value" />
            <div v-else-if="data.value.isLoading">
                <b-icon
                    icon="arrow-clockwise"
                    animation="spin"
                    font-scale="1.5"
                />
            </div>
            <div
                v-else-if="data.value.error && edit"
                style="cursor: pointer;"
                @click="reloadBricksAndPiecesPosition(data.item)"
            >
                <span style="display: block">
                    <b-icon
                        icon="exclamation-triangle-fill"
                        style="margin-right: 5px;"
                        variant="danger"
                    />
                    <span style="color: grey; font-size: small;"
                        >Error: {{ data.value.error }}</span
                    >
                </span>
                <span style="color: #007bff;">
                    {{ label_reload }}
                </span>
            </div>
            <div v-else-if="data.value.error">
                <span style="display: block">
                    <b-icon
                        icon="exclamation-triangle-fill"
                        style="margin-right: 5px;"
                        variant="danger"
                    />
                    <span style="color: grey; font-size: small;"
                        >Error: {{ data.value.error }}</span
                    >
                </span>
            </div>
            <div v-else>
                {{ data.value.price.currency }}
                {{ data.value.price.amount }}<br />
                <span style="color: grey; font-size: small;">
                    [{{ data.value.designId }}/{{ data.value.itemNumber }}]
                </span>
            </div>
        </template>
        <template #cell(brickLinkRemarks)="data">
            <div style="overflow-y: scroll; max-height: 50px">{{ data.item.brickLink.wantedList.remarks }}</div>
        </template>
        <template #cell(actions)="data">
            <div @click.stop>
                <b-icon
                    v-if="edit"
                    icon="trash"
                    aria-hidden="true"
                    @click="deletePosition(data.item)"
                    style="cursor: pointer"
                />
            </div>
        </template>
    </b-table>
</template>

<style>
.table-b-table-default {
    vertical-align: inherit !important;
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
        isBusy: {
            type: Boolean,
            default: false,
        },
        fullSize: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        sortBy: 'designId',
        sortDesc: false,
        selectAll: false,
        tableHeight: 'calc(100vh - 200px)',
        selected: [],
        fields: [
            {
                key: 'selected',
                label: '',
                sortable: false,
                width: '25px',
            },
            {
                key: 'designId',
                label: browser.i18n.getMessage('brickList_designId'),
                sortable: true,
                width: '90px',
            },
            {
                key: 'itemNumber',
                label: browser.i18n.getMessage('brickList_itemNumber'),
                sortable: true,
                width: '90px',
            },
            {
                key: 'image',
                label: browser.i18n.getMessage('brickList_brickLinkImage'),
                sortable: false,
                width: '60px',
            },
            {
                key: 'color',
                label: browser.i18n.getMessage('brickList_brickLinkColor'),
                sortable: true,
                sortBy: 'color.brickLinkName',
                width: '200px',
            },
            {
                key: 'qty',
                label: browser.i18n.getMessage('brickList_quantity'),
                sortable: true,
                sortBy: 'qty.min',
                width: '70px',
            },
            {
                key: 'brickLink',
                label: browser.i18n.getMessage('brickList_brickLinkPrice'),
                sortable: true,
                sortBy: 'brickLink.wantedList.maxprice',
                width: '90px',
            },
            {
                key: 'pickABrick',
                label: browser.i18n.getMessage('brickList_pickABrickPrice'),
                sortable: true,
                sortBy: 'pickABrick.variant.price.centAmount',
                width: '110px',
            },
            {
                key: 'bricksAndPieces',
                label: browser.i18n.getMessage(
                    'brickList_bricksAndPiecesPrice'
                ),
                sortable: true,
                sortBy: 'bricksAndPieces.price.amount',
                width: '120px',
            },
            {
                key: 'brickLinkRemarks',
                label: 'BL Remarks', //browser.i18n.getMessage('brickList_brickLinkPrice'),
                sortable: false,
                width: '200px',
            },
            {
                key: 'actions',
                label: '',
                width: '25px',
            },
        ],
        doNotSort: false,
    }),
    components: {
        Vuetable,
    },
    methods: {
        calcImage(value) {
            return `https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${value.itemId}.jpg`;
        },
        calcColor(value) {
            return `background-color: ${value.colorCode}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`;
        },
        deletePosition(item) {
            this.$emit('itemDeleted', item);
        },
        reloadPickABrickPosition(position) {
            this.$emit('reloadPickABrickPosition', position);
        },
        reloadBricksAndPiecesPosition(position) {
            this.$emit('reloadBricksAndPiecesPosition', position);
        },
        onRowSelection(selectedItems) {
            this.$emit('selectionChanged', selectedItems);
        },
        onAllSelection(selected) {
            if (selected) {
                this.$refs.selectableTable.selectAllRows();
            } else {
                this.$refs.selectableTable.clearSelected();
            }
        },
        selectRow(index, selected) {
            if (selected) this.$refs.selectableTable.selectRow(index);
            if (!selected) this.$refs.selectableTable.unselectRow(index);
        },
        sortList() {
            var key = this.fields.find((f) => f.key == this.sortBy).sortBy;
            if (!key) key = this.sortBy;
            var order = this.sortDesc ? 'desc' : 'asc';

            var keys = key.split('.');

            this.bricklist.sort(function innerSort(a, b) {
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
            });
        },
    },
    beforeMount() {
        if (
            this.bricklist.filter((p) => p.brickLink?.wantedList?.maxprice > 0)
                .length == 0
        ) {
            this.fields = this.fields.filter(
                (field) => field.key != 'brickLink'
            );
        }

        if (
            this.bricklist.filter(
                (p) => p.brickLink?.wantedList?.remarks?.length > 0
            ).length == 0
        ) {
            this.fields = this.fields.filter(
                (field) => field.key != 'brickLink.wantedList.remarks'
            );
        }

        if (this.bricklist.filter((p) => p.itemNumber).length == 0) {
            this.fields = this.fields.filter(
                (field) => field.key != 'itemNumber'
            );
        }

        if (!this.edit) {
            this.fields = this.fields.filter(
                (field) => field.key != 'selected'
            );
        }

        var i = 0;
        this.bricklist.map((pos) => {
            i++;
            pos.rowNumber = i.toString();
            pos.selected = false;

            pos.qty.min = parseInt(pos.qty.min);
            pos.qty.have = parseInt(pos.qty.have);
            pos.qty.order = parseInt(pos.qty.order);
            pos.qty.balance = pos.qty.min - pos.qty.have;

            if (pos.brickLink?.wantedList?.maxprice) {
                if (pos.brickLink.wantedList.maxprice <= 0)
                    pos.brickLink.wantedList.maxprice = 0;
                pos.brickLink.wantedList.maxprice = parseFloat(
                    pos.brickLink.wantedList.maxprice
                );
            }
        });
        this.sortList();

        if (this.fullSize) this.tableHeight = '';
    },
    watch: {
        isBusy: async function(val) {
            if (val) this.tableHeight = 'calc(100vh - 215px)';
            if (!val) {
                this.tableHeight = 'calc(100vh - 200px)';
                this.sortList();
            }
            if (this.fullSize) this.tableHeight = '';
            /*var findDesignId = this.fields.find(
                (field) => field.key === 'designId'
            );
            var findItemNumber = this.fields.find(
                (field) => field.key === 'itemNumber'
            );
            var findColor = this.fields.find((field) => field.key === 'color');
            var findQty = this.fields.find((field) => field.key === 'qty');
            var findBrickLinkPrice = this.fields.find(
                (field) => field.key === 'brickLink'
            );
            var findPickABrick = this.fields.find(
                (field) => field.key === 'pickABrick'
            );
            var findBricksAndPieces = this.fields.find(
                (field) => field.key === 'bricksAndPieces'
            );

            if (findDesignId) findDesignId.sortable = val;
            if (findItemNumber) findItemNumber.sortable = val;
            if (findColor) findColor.sortable = val;
            if (findQty) findQty.sortable = val;
            if (findBrickLinkPrice) findBrickLinkPrice.sortable = val;
            if (findPickABrick) findPickABrick.sortable = val;
            if (findBricksAndPieces) findBricksAndPieces.sortable = val;*/
        },
        sortBy: async function() {
            this.sortList();
        },
        sortDesc: async function() {
            this.sortList();
        },
        /*bricklist: {
            handler(val, oldVal) {
                console.log(val, oldVal)
            },
            deep: true,
        },*/
    },
    computed: {
        label_reload() {
            return browser.i18n.getMessage('brickList_reload');
        },
        style() {
            if (
                this.bricklist.filter(
                    (p) => p.brickLink?.wantedList?.remarks?.length > 0
                ).length > 0
            ) {
                return 'width: calc(100% + 200px); margin-left: -100px !important;';
            }
        },
    },
};
</script>
