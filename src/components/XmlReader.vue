<template>
<b-form-file
        v-model="file"
        :state="Boolean(file)"
        accept="text/xml" 
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
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
  }
};
</script>