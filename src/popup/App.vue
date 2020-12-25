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
    beforeMount() {
        browser.tabs
            .query({
                url: '*://*.lego.com/*',
                currentWindow: true,
                active: true,
            })
            .then(async (logTabs) => {
                if (!logTabs.length) {
                    browser.tabs.create({
                        url: chrome.runtime.getURL('index.html#/partLists'),
                    });
                    window.close();
                }
            });
    },
};
</script>
