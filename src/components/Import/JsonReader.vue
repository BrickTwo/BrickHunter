<template>
    <b-form-file
        v-model="file"
        :state="Boolean(file)"
        accept="application/json"
        :placeholder="labelChooseFile"
        :drop-placeholder="labelDropFile"
    />
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

            const fileReader = new FileReader();

            fileReader.onload = (e) =>
                this.$emit('load', JSON.parse(e.target.result));
            fileReader.readAsText(this.file);
        },
    },
    computed: {
        labelChooseFile() {
            return browser.i18n.getMessage('xmlReader_chooseFile');
        },
        labelDropFile() {
            return browser.i18n.getMessage('xmlReader_dropFile');
        },
    },
    beforeDestroy() {
        eventHub.$off('clearWantedList');
    },
};
</script>
