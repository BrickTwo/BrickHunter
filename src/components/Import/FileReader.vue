<template>
    <b-form-file
        v-model="file"
        :state="Boolean(file)"
        accept="text/xml, application/json"
        :placeholder="labelChooseFile"
        :drop-placeholder="labelDropFile"
    />
</template>

<script>
export default {
    data: () => ({ file: null, fileType: '' }),
    created() {
        eventHub.$on('clearPartList', () => (this.file = null));
    },
    methods: {
        readXml() {
            var xml2js = require('xml2js');
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                let xml = null;

                xml2js.parseString(
                    e.target.result,
                    { normalizeTags: true },
                    function(err, result) {
                        if (err) throw err;
                        xml = result;
                    }
                );

                this.$emit('load', {
                    content: xml,
                    fileName: this.file.name,
                    fileType: this.fileType,
                });
            };
            fileReader.readAsText(this.file);
        },
        readJson() {
            const fileReader = new FileReader();

            fileReader.onload = (e) =>
                this.$emit('load', {
                    content: JSON.parse(e.target.result),
                    fileName: this.file.name,
                    fileType: this.fileType,
                });
            fileReader.readAsText(this.file);
        },
    },
    watch: {
        file(val) {
            if (!val) return;

            this.fileType = this.file.name.split('.').pop();

            switch (this.fileType.toLowerCase()) {
                case 'xml':
                    this.readXml();
                    break;
                case 'json':
                    this.readJson();
                    break;
            }
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
