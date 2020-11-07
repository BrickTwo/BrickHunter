<template>
    <BrickHunter />
</template>

<style>
.page {
    width: 780px !important; /* max pop with 800px - scrollbar */
}
</style>

<script>
import BrickHunter from '@/components/BrickHunter.vue';
import SelectCountryDropDown from '@/components/SelectCountryDropDown.vue';

export default {
    components: {
        BrickHunter,
    },
};
</script>