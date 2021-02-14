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

export default {
    components: {
        BrickHunter,
    },
    beforeMount() {
        browser.tabs.create({
            url: chrome.runtime.getURL('index.html#/partLists'),
        });
        window.close();
    },
};
</script>
