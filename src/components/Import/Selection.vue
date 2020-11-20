<template>
    <b-container fluid="xl">
        <b-row>
            <b-col cols="3" sm="4" md="3"><Categories /></b-col>
            <b-col cols="9" sm="8" md="9">2 of 3</b-col>
        </b-row>
    </b-container>
</template>

<script>
import Categories from './selection/Categories';

export default {
    data: () => ({}),
    components: {
        Categories,
    },
    mixins: [],
    methods: {},
    computed: {},
};
</script>
