<template>
    <b-container fluid="xl">
        <b-row>
            <h2>Teilelisten</h2>
        </b-row>
        <b-row>
            <PartLists @partListSelected="onPartListSelected" />
        </b-row>
        <b-row>
            <h2>Kategorien</h2>
        </b-row>
        <b-row>
            <Categories @categorySelected="onCategorySelected" />
        </b-row>
    </b-container>
</template>

<script>
import PartLists from './PartLists';
import Categories from './Categories';

export default {
    components: {
        PartLists,
        Categories,
    },
    methods: {
        onPartListSelected(id) {
            this.$emit('partListSelected', id);
        },
        onCategorySelected(id) {
            this.$emit('categorySelected', id);
        },
    },
};
</script>
