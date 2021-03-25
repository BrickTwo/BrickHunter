<template>
    <b-container fluid="xl">
        <b-row>
            <h2>{{ labelPartLists }}</h2>
        </b-row>
        <b-row>
            <PartLists />
        </b-row>
        <b-row>
            <h2>{{ labelCategories }}</h2>
        </b-row>
        <b-row>
            <Categories />
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
