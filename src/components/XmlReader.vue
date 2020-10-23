<template>
    <b-form-file
        v-model="file"
        :state="Boolean(file)"
        accept="text/xml"
        :placeholder="chooseFile"
        :drop-placeholder="dropFile"
    ></b-form-file>
</template>

<script>
export default {
    data: () => ({ file: null }),
    created() {
        eventHub.$on('clearWantedList', () => (this.file = null));
    },
    watch: {
        file(val) {
            if (!val) return;

            this.$emit('fileName', this.file.name);

            var xml2js = require('xml2js');
            const fileReader = new FileReader();

            fileReader.onload = (e) =>
                this.$emit(
                    'load',
                    xml2js
                        .parseStringPromise(e.target.result, {
                            normalizeTags: true,
                        })
                        .then(function(result) {
                            return result.inventory.item;
                        })
                        .then((items) => {
                            return [items];
                        })
                );
            fileReader.readAsText(this.file);
        },
    },
    computed: {
        chooseFile() {
            return browser.i18n.getMessage('xmlReader_chooseFile');
        },
        dropFile() {
            return browser.i18n.getMessage('xmlReader_dropFile');
        },
    },
    beforeDestroy() {
        eventHub.$off('clearWantedList');
    },
};
</script>
