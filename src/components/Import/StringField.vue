<template>
    <b-form-textarea
        v-model="text"
        :placeholder="labelCopyWantedList"
        rows="6"
        max-rows="6"
        @blur.native="loadString"
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
    created() {
        eventHub.$on('clearPartList', () => (this.text = ''));
    },
    methods: {
        loadString() {
            try {
                let json = JSON.parse(this.text);
                this.$emit('load', {
                    content: json,
                    fileName: '',
                    fileType: 'json',
                });
                return;
            } catch (d) {}

            try {
                var xml2js = require('xml2js');

                let xml = null;

                xml2js.parseString(this.text, { normalizeTags: true }, function(
                    err,
                    result
                ) {
                    if (err) throw err;
                    xml = result;
                });

                this.$emit('load', {
                    content: xml,
                    fileName: '',
                    fileType: 'xml',
                });
                return;
            } catch (d) {}

            this.$emit('load', {
                content: null,
                fileName: '',
                fileType: '',
            });
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
