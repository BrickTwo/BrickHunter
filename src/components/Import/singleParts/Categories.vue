<template>
    <b-container fluid="xl">
        <b-row v-for="category in categories" :key="category.id">
            <b-col>
                <b-link @click="selectCategorie(category.id)">
                    {{ category.name }}
                </b-link>
                ({{ category.quantity }})
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { requestsMixin } from '@/mixins/requestsMixin';

export default {
    data: () => ({
        categories: [],
        selectCategory: 9999999,
    }),
    mixins: [requestsMixin],
    methods: {
        selectCategorie(id) {
            this.$emit('categorySelected', id);
        },
    },
    async beforeMount() {
        this.categories = await this.getCategoriesAsync();

        var category = {
            id: 9999999,
            name: 'all',
            quantity: this.categories.reduce(
                (a, b) => a + (parseInt(b['quantity']) || 0),
                0
            ),
        };

        this.categories.unshift(category);
    },
};
</script>
