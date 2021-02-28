<template>
    <b-container fluid="xl">
        <b-row>
            <h2>{{ labelPartLists }}</h2>
        </b-row>
        <b-row>
            <PartLists @partListActive="onPartListActive" @partListSelected="onPartListSelected" @favoriteSelected="onFavoriteSelected" />
        </b-row>
        <b-row>
            <h2>{{ labelCategories }}</h2>
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
        onPartListActive(id) {
            this.$emit('partListActive', id);
        },
        onPartListSelected(id) {
            this.$emit('partListSelected', id);
        },
        onFavoriteSelected(selected) {
            this.$emit('favoriteSelected', selected);
        },
        onCategorySelected(id) {
            this.$emit('categorySelected', id);
        },
    },
    computed: {
        labelPartLists() {
            return browser.i18n.getMessage('import_sp_partLists');
        },
        labelCategories() {
            return browser.i18n.getMessage('import_sp_categories');
        },
    },
};
</script>
