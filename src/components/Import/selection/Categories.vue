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
    }),
    mixins: [requestsMixin],
    methods: {
        selectCategorie(id) {
            console.log(id);
        },
    },
    async beforeMount() {
        this.categories = await this.getCategoriesAsync(this.$store.state.country);

        var category = {
            id: 0,
            name: "all",
            quantity: this.categories.reduce((a, b) => a + (parseInt(b['quantity']) || 0), 0)
        };

        this.categories.unshift(category);
    },
};
</script>
