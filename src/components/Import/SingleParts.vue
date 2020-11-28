<template>
    <b-container fluid="xl">
        <b-row>
            <b-col class="p-0" cols="3" sm="4" md="3"><Categories  @categorySelected="onCategorySelected" class="cat" /></b-col>
            <b-col class="p-0" cols="9" sm="8" md="9"><BrickFilter :categoryId="categorySelected" class="cat" /></b-col>
        </b-row>
    </b-container>
</template>

<style scoped>
.cat{
    height: calc(100vh - 130px);
    min-height: 475px;
    overflow: scroll;
    overflow-x: hidden;
}
</style>

<script>
import Categories from './singleParts/Categories';
import BrickFilter from './singleParts/Filter';

export default {
    data: () => ({
        categorySelected: 0,
    }),
    components: {
        Categories,
        BrickFilter,
    },
    mixins: [],
    methods: {
        onCategorySelected(id) {
            this.categorySelected = parseInt(id);
        }
    },
    computed: {},
};
</script>
