<template>
    <b-container fluid="xl">
        <b-row>
            <b-col class="p-0" cols="3" sm="4" md="3">
                <Sidemenu
                    @partListSelected="onPartListSelected"
                    @categorySelected="onCategorySelected"
                    class="cat"
                />
            </b-col>
            <b-col class="p-0" cols="9" sm="8" md="9">
                <BrickFilter
                    :partListId="partListSeleted"
                    :categoryId="categorySelected"
                    class="cat"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<style scoped>
.cat {
    height: calc(100vh - 130px);
    min-height: 475px;
    overflow: scroll;
    overflow-x: hidden;
}
</style>

<script>
import Sidemenu from './singleParts/Sidemenu';
import BrickFilter from './singleParts/Filter';

export default {
    data: () => ({
        partListSeleted: null,
        categorySelected: 9999999,
    }),
    components: {
        Sidemenu,
        BrickFilter,
    },
    mixins: [],
    methods: {
        onPartListSelected(id) {
            this.partListSeleted = id;
        },
        onCategorySelected(id) {
            this.categorySelected = parseInt(id);
        },
    },
    computed: {},
};
</script>
