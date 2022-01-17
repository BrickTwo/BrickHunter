<template>
    <b-form-textarea
        v-model="text"
        :placeholder="labelCopyWantedList"
        rows="6"
        max-rows="6"
        @blur.native="loadXml"
        :state="state"
    />
</template>

<script>
export default {
    props: {
        state: {
            type: Boolean,
        },
    },
    data: () => ({ text: '' }),
    methods: {
        loadXml() {
            var xml2js = require('xml2js');

            this.$emit(
                'load',
                xml2js
                    .parseStringPromise(this.text, { normalizeTags: true })
                    .then(function(result) {
                        return result.inventory.item;
                    })
                    .then((items) => {
                        return [items];
                    })
            );
        },
        cancelXml() {
            this.$emit('cancel');
        },
    },
    computed: {
        labelCopyWantedList() {
            return browser.i18n.getMessage('xmlField_copyWantedList');
        },
    },
};
</script>
