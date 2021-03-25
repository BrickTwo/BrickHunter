<template>
    <b-input-group>
        <b-input-group-prepend is-text>
            <b-icon :icon="sortIcon" @click="selectSortDirection()" />
        </b-input-group-prepend>
        <b-form-select v-model="selectedSortData" :options="sortOptions" @change="onSelectedSortChange" />
    </b-input-group>
</template>

<script>
export default {
    props: {
        selectedSort: {
            type: String,
            default: 'DESCRIPTION',
        },
        sortDirection: {
            type: String,
            default: 'ASC',
        },
    },
    data: () => ({
        sortOptions: [
            {
                value: 'DESCRIPTION',
                text: browser.i18n.getMessage('import_sp_description'),
            },
            {
                value: 'ITEMNUMBER',
                text: browser.i18n.getMessage('import_sp_element'),
            },
            {
                value: 'DESIGNID',
                text: browser.i18n.getMessage('import_sp_designNumber'),
            },
            {
                value: 'PRICEAMOUNT',
                text: browser.i18n.getMessage('import_sp_price'),
            },
            {
                value: 'MAXAMOUNT',
                text: browser.i18n.getMessage('import_sp_maxAmount'),
            },
            {
                value: 'FIRSTSEEN',
                text: browser.i18n.getMessage('import_sp_firstAvailability'),
            },
            {
                value: 'CREATEDATEBRICK',
                text: browser.i18n.getMessage('import_sp_indexing'),
            },
            //{ value: 'LASTSEEN', text: 'Zuletzt Verfügbar' },
            //{ value: 'LASTUPDATECOUNTRY', text: 'Letzte Aktualisierung' },
        ],
        selectedSortData: '',
        sortDirectionData: '',
        sortIcon: 'sort-alpha-down',
    }),
    methods: {
        selectSortDirection(initial = false) {
            if (this.sortDirectionData == 'ASC') {
                this.sortDirectionData = 'DESC';
                this.sortIcon = 'sort-alpha-up';
            } else {
                this.sortDirectionData = 'ASC';
                this.sortIcon = 'sort-alpha-down';
            }

            if (!initial) this.$emit('selectSortDirection');
        },
        onSelectedSortChange(event) {
            this.selectedSortData = event;
            this.$emit('selectSortBy', this.selectedSortData);
        },
    },
    beforeMount() {
        this.selectedSortData = this.selectedSort;
        this.sortDirectionData = this.sortDirection;
        this.selectSortDirection(true);
    },
};
</script>
