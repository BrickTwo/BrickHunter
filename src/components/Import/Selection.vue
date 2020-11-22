<template>
    <b-container fluid="xl">
        <b-row>
            <b-col cols="3" sm="4" md="3"><Categories  class="cat" /></b-col>
            <b-col cols="9" sm="8" md="9"><BrickFilter  class="cat" /></b-col>
        </b-row>
    </b-container>
</template>

<style scoped>
.cat{
    height: calc(100vh - 130px);
    overflow: scroll;
    overflow-x: hidden;
}
</style>

<script>
import Categories from './selection/Categories';
import BrickFilter from './selection/Filter';

export default {
    data: () => ({}),
    components: {
        Categories,
        BrickFilter,
    },
    mixins: [],
    methods: {},
    computed: {},
};
</script>
