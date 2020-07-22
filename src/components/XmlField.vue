<template>
    <span>
        <b-form-textarea
        id="textarea"
        v-model="text"
        placeholder="Kopiere den Inhalt einer WantedList hier rein"
        rows="6"
        max-rows="6"
        ></b-form-textarea>
        <b-button variant="secondary" @click="cancelXml">Abbrechen</b-button>
        <b-button variant="primary" @click="loadXml">Lade WantedList</b-button>
    </span>
</template>

<script>

export default {
    data: () => ({ text: '' }),
    methods: {
        loadXml () {
            var xml2js = require('xml2js');

            this.$emit("load", xml2js.parseStringPromise(this.text, {normalizeTags: true}).then(function (result) {
                return result.inventory.item;
            }).then(items => {
                return [items];
            }));
        },
        cancelXml () {
            this.$emit("cancel");
        }
    }
}

</script>