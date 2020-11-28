<template>
    <b-container fluid="xl">
        <b-row>
            <b-col cols="6"
                ><b-form-input
                    v-model="keyword"
                    @keyup.enter="loadBricks(true)"
                    placeholder="Find parts by keyword"
                ></b-form-input
            ></b-col>
            <b-col cols="1" class="text-right">
                <b-button class="button" variant="primary" @click="sort()">
                    <b-icon :icon="sortIcon" aria-hidden="true" />
                </b-button>
            </b-col>
            <b-col cols="5">
                <b-form-select v-model="selectedSort" :options="sortOptions" />
            </b-col>
        </b-row>
        <b-row>
            <b-col offset="7" cols="5"
                ><b-form-select
                    v-model="selectedColor"
                    :options="colorOptions"
                ></b-form-select
            ></b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-select
                    style="width:75px"
                    v-model="perPage"
                    :options="perPageOptions"
                />
            </b-col>
            <b-col class="center">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    aria-controls="my-table"
                />
            </b-col>
            <b-col class="text-right">
                <b-button
                    class="button"
                    variant="primary"
                    @click="showAs = 'grid'"
                >
                    <b-icon icon="grid" aria-hidden="true" />
                </b-button>
                <b-button
                    class="button"
                    variant="primary"
                    @click="showAs = 'list'"
                >
                    <b-icon icon="list-stars" aria-hidden="true" />
                </b-button>
            </b-col>
        </b-row>
        <b-row v-if="showAs == 'grid'" cols="12">
            <BrickGrid
                v-for="brick in search.bricks"
                :key="brick.itemNumber"
                :brick="brick"
            />
        </b-row>
        <b-row v-if="showAs == 'list'" cols="12">
            <BrickList
                v-for="brick in search.bricks"
                :key="brick.itemNumber"
                :brick="brick"
            />
        </b-row>
        <b-row>
            <b-col>
                <b-form-select
                    style="width:75px"
                    v-model="perPage"
                    :options="perPageOptions"
                />
            </b-col>
            <b-col class="center">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    aria-controls="my-table"
                />
            </b-col>
            <b-col class="text-right">
                <b-button class="button" variant="primary">
                    <b-icon icon="grid" aria-hidden="true" />
                </b-button>
                <b-button class="button" variant="primary">
                    <b-icon icon="list-stars" aria-hidden="true" />
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { requestsMixin } from '@/mixins/requestsMixin';
import BrickGrid from './BrickGrid';
import BrickList from './BrickList';

export default {
    props: {
        categoryId: {
            type: Number,
        },
    },
    data: () => ({
        perPage: 25,
        perPageOptions: [
            { value: 25, text: '25' },
            { value: 50, text: '50' },
            { value: 100, text: '100' },
        ],
        currentPage: 1,
        totalRows: 5000,
        group: false,
        keyword: null,
        sortOptions: [
            { value: 'DESCRIPTION', text: 'Beschreibung' },
            { value: 'ITEMNUMBER', text: 'Element' },
            { value: 'DESIGNID', text: 'Designnummer' },
            { value: 'PRICEAMOUNT', text: 'Preis' },
            { value: 'MAXAMOUNT', text: 'Max Bestellmenge' },
            { value: 'FIRSTSEEN', text: 'Zuerst Verfügbar' },
            { value: 'LASTSEEN', text: 'Zuletzt Verfügbar' },
            { value: 'LASTUPDATE', text: 'Letzte Aktualisierung' },
        ],
        selectedSort: 'DESCRIPTION',
        sortDirection: 'ASC',
        sortIcon: 'sort-alpha-down',
        colorOptions: [{ value: 'all', text: 'Alle Farben' }],
        selectedColor: 'all',
        newOptions: [{ value: 'all', text: 'Neu hinzugekommen - ' }],
        selectedNew: 'all',
        search: [],
        showAs: 'grid',
    }),
    components: {
        BrickGrid,
        BrickList,
    },
    mixins: [requestsMixin],
    methods: {
        async loadBricks(resetPage) {
            if (resetPage) {
                this.currentPage = 1;
            }

            this.search = await this.getBricksAsync(
                this.currentPage,
                this.perPage,
                this.categoryId,
                this.selectedColor,
                this.keyword,
                this.selectedSort,
                this.sortDirection
            );

            this.totalRows = this.search.page.total;
            console.log(this.totalRows);
        },
        async fillColors() {
            var colors = await this.getColorsAsync();

            colors.forEach((item) => {
                var color = {
                    value: item.id,
                    text: item.brickLinkName,
                };

                this.colorOptions.push(color);
            });
        },
        sort() {
            if(this.sortDirection == 'ASC') {
                this.sortDirection = 'DESC';
                this.sortIcon = 'sort-alpha-up';
            } else {
                this.sortDirection = 'ASC';
                this.sortIcon = 'sort-alpha-down';
            }

            this.loadBricks(false);
        }
    },
    watch: {
        categoryId: function() {
            this.loadBricks(true);
        },
        selectedColor: function() {
            this.loadBricks(true);
        },
        currentPage: function() {
            this.loadBricks(false);
        },
        perPage: function() {
            this.loadBricks(true);
        },
        selectedSort: function() {
            this.loadBricks(false);
        },
    },
    async beforeMount() {
        this.loadBricks(true);
        this.fillColors();

        if (this.$store.state.mode == 'standalone') {
            this.perPageOptions.unshift({ value: 8, text: '8' });
        }
    },
};
</script>
