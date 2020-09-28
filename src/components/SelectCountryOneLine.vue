<template>
    <b-form-select
        v-model="form_country"
        :options="options"
        @change="changeCountry"
    ></b-form-select>
</template>
<script>
export default {
    data() {
        return {
            form_country: null,
            options: [
                {
                    value: 'de',
                    text: browser.i18n.getMessage('country_germany'),
                },
                {
                    value: 'at',
                    text: browser.i18n.getMessage('country_austria'),
                },
                {
                    value: 'ch',
                    text: browser.i18n.getMessage('country_switzerland'),
                },
            ],
        };
    },
    methods: {
        changeCountry() {
            localStorage.setItem('country', this.form_country);
            this.$emit('countrySelected', this.form_country);
            //this.$store.commit("setKeyword", this.form.keyword);
        },
    },
    beforeMount() {
        this.form_country = localStorage.getItem('country') || null;
    },
};
</script>
