<template>
    <b-container fluid="xl">
        <b-row>
            <b-col
                ><b-form-input
                    v-model="keyword"
                    placeholder="Find parts by keyword"
                ></b-form-input
            ></b-col>
            <b-col
                ><b-form-select
                    v-model="selectedSort"
                    :options="sortOptions"
                ></b-form-select
            ></b-col>
        </b-row>
        <b-row>
            <b-col
                ><b-form-select
                    v-model="selectedColor"
                    :options="colorOptions"
                ></b-form-select
            ></b-col>
            <b-col
                ><b-form-select
                    v-model="selectedNew"
                    :options="newOptions"
                ></b-form-select
            ></b-col>
        </b-row>
        <b-row>
            <b-col style="display: contents;">
                
                <b-form-checkbox v-model="group" />
                Pick a Brick
                <b-form-checkbox v-model="group" />
                Steine und Teile
                <b-form-checkbox v-model="group" />
                Nur Verfügbare
            </b-col>
            <b-col class="text-right"
                >
                <div style="display: inline-flex"><b-form-checkbox v-model="group" />
                Gruppiere DesignId</div>
                <b-button class="button" variant="primary">
                    <b-icon icon="grid" aria-hidden="true" />
                </b-button>
                <b-button class="button" variant="primary">
                    <b-icon icon="list-stars" aria-hidden="true" /> </b-button
            ></b-col>
        </b-row>
        <b-row cols="12">
            <Brick
                v-for="brick in bricks"
                :key="brick.itemNumber"
                :brick="brick"
            />
        </b-row>
    </b-container>
</template>

<script>
import { requestsMixin } from '@/mixins/requestsMixin';
import Brick from './Brick';

export default {
    data: () => ({
        group: false,
        keyword: null,
        sortOptions: [
            { value: 'default', text: 'Defaut sort' },
            { value: 'item', text: 'Item Number' },
            { value: 'design', text: 'Design Number' },
            { value: 'desc', text: 'Description' },
        ],
        selectedSort: 'default',
        colorOptions: [{ value: 'all', text: 'Alle Farben' }],
        selectedColor: 'all',
        newOptions: [{ value: 'all', text: 'Neu hinzugekommen - ' }],
        selectedNew: 'all',
        bricks: [],
    }),
    components: {
        Brick,
    },
    mixins: [requestsMixin],
    methods: {},
    async beforeMount() {
        this.bricks = await this.getBricksAsync(11);
    },
};
</script>
