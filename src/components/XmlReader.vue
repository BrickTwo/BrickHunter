<template>
<b-form-file
        v-model="file"
        :state="Boolean(file)"
        accept="text/xml" 
        :placeholder="chooseFile"
        :drop-placeholder="dropFile"
        @change="loadTextFromFile"
        ></b-form-file>
</template>

<script>
export default {
  data: () => ({ file: null }),
  methods: {
    loadTextFromFile(ev) {
        var xml2js = require('xml2js');

        const file = ev.target.files[0];
        const reader = new FileReader();

        reader.onload = e => this.$emit("load", xml2js.parseStringPromise(e.target.result, {normalizeTags: true}).then(function (result) {
            return result.inventory.item;
        }).then(items => {
            return [items];
        }));

        reader.readAsText(file);
    }
  },
  computed: {
    chooseFile() {
      return browser.i18n.getMessage('xmlReader_chooseFile')
    },
    dropFile() {
      return browser.i18n.getMessage('xmlReader_dropFile')
    }
  }
};
</script>