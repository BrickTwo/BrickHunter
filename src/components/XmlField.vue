<template>
    <span>
        <b-form-textarea
            id="textarea"
            v-model="text"
            :placeholder="copyWantedList"
            rows="6"
            max-rows="6"
            @blur.native="loadXml"
            :state="state"
        ></b-form-textarea>
        <!-- <p style="margin-top: 10px">
            <b-button variant="primary" @click="loadXml">{{
                buttonLoadWantedList
            }}</b-button>
            <b-button
                variant="danger"
                @click="cancelXml"
                style="margin-left: 10px"
                >{{ buttonCancel }}</b-button
            >
        </p> -->
    </span>
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
        copyWantedList() {
            return browser.i18n.getMessage('xmlField_copyWantedList');
        },
        buttonLoadWantedList() {
            return browser.i18n.getMessage('xmlField_buttonLoadWantedList');
        },
        buttonCancel() {
            return browser.i18n.getMessage('xmlField_buttonCancel');
        },
    },
};
</script>
