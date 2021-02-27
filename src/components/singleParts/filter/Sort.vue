<template>
    <b-input-group>
        <b-input-group-prepend is-text>
            <b-icon :icon="sortIcon" @click="selectSortDirection()" />
        </b-input-group-prepend>
        <b-form-select v-model="selectedSort" :options="sortOptions" />
    </b-input-group>
</template>

<script>
export default {
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
        selectedSort: 'DESCRIPTION',
        sortDirection: 'ASC',
        sortIcon: 'sort-alpha-down',
    }),
    methods: {
        selectSortDirection() {
            if (this.sortDirection == 'ASC') {
                this.sortDirection = 'DESC';
                this.sortIcon = 'sort-alpha-up';
            } else {
                this.sortDirection = 'ASC';
                this.sortIcon = 'sort-alpha-down';
            }

            this.$emit('selectSortDirection');
        },
    },
    watch: {
        selectedSort: function() {
            this.$emit('selectSortBy', this.selectedSort);
        },
    },
};
</script>
