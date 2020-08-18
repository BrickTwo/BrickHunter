<template>
    <span>
        <b-form-textarea
        id="textarea"
        v-model="text"
        placeholder="Kopiere den Inhalt einer WantedList hier rein"
        rows="6"
        max-rows="6"
        ></b-form-textarea>
        <p style="margin-top: 10px">
            <b-button variant="primary" @click="loadXml">Lade WantedList</b-button>
            <b-button variant="danger" @click="cancelXml" style="margin-left: 10px">Abbrechen</b-button>
        </p>
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