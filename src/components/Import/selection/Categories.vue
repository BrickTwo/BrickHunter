<template>
    <b-container fluid="xl" class="categories">
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

<style scoped>
.categories {
    max-height: 100%;
    overflow: scroll;
}
</style>

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
    },
};
</script>
