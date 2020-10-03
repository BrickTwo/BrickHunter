<template>
    <b-dropdown right>
        <template v-slot:button-content>
            <span v-if="showFlags"
                ><img :src="getImgUrl(selectedCountry)" width="20px"
            /></span>
            <span v-if="!showFlags">{{ getCountryName(selectedCountry) }}</span>
            <span v-if="!selectedCountry">{{ country }}</span>
        </template>
        <b-dropdown-item
            href="#"
            v-for="country in options"
            :key="country.value"
            :value="country.value"
            @click="changeCountry(country.value)"
            ><img :src="getImgUrl(country.value)" width="20px" />
            {{ country.text }}
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
export default {
    props: {
        showFlags: {
            type: Boolean,
        },
    },
    data() {
        return {
            selectedCountry: null,
            options: [
                {
                    value: 'de',
                    text: this.getCountryName('de'),
                },
                {
                    value: 'at',
                    text: this.getCountryName('at'),
                },
                {
                    value: 'ch',
                    text: this.getCountryName('ch'),
                },
            ],
        };
    },
    methods: {
        getCountryName(country) {
            return browser.i18n.getMessage('country_' + country);
        },
        changeCountry(value) {
            this.selectedCountry = value;
            localStorage.setItem('country', this.selectedCountry);
            this.$emit('countrySelected', this.selectedCountry);
        },
        getImgUrl(value) {
            return 'flags/' + value + '.png';
        },
    },
    beforeMount() {
        this.selectedCountry = localStorage.getItem('country') || null;
    },
    computed: {
        country() {
            return browser.i18n.getMessage('selectCountry_country');
        },
    },
};
</script>
