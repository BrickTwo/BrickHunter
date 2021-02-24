<template>
    <b-container fluid="xl">
        <b-row v-for="category in categories" :key="category.id">
            <b-col
                v-if="category.id == selectCategory"
                style="font-weight: bold"
            >
                <b-link @click="selectCategorie(category.id)">
                    {{ category.name }}
                </b-link>
                ({{ category.quantity }})
            </b-col>
            <b-col v-else>
                <b-link @click="selectCategorie(category.id)">
                    {{ category.name }}
                </b-link>
                ({{ category.quantity }})
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { bus } from '@/components/BrickHunter';
import apiBrickTwo from '@/utility/api/bricktwo.js';

export default {
    data: () => ({
        categories: [],
        selectCategory: 9999999,
    }),
    methods: {
        selectCategorie(id) {
            this.selectCategory = id;
            this.$emit('categorySelected', id);
        },
        async loadCategories() {
            this.$store.commit(
                'singleParts/setCategories',
                await apiBrickTwo.getCategoriesAsync(this.$store.state.country)
            );
        },
    },
    beforeMount() {
        this.loadCategories();
        this.categories = this.$store.state.singleParts.categoriesFiltered;
    },
    created() {
        bus.$on('CategoriesFiltered', (data) => {
            this.categories = data;
        });
    },
};
</script>
