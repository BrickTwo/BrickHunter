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
import { countryMixin } from '@/mixins/countryMixin';

export default {
    props: {
        showFlags: {
            type: Boolean,
        },
    },
    mixins: [countryMixin],
    data() {
        return {
            selectedCountry: null,
            options: [],
        };
    },
    methods: {
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

        this.COUNTRIES.forEach((country) => {
            this.options.push({
                value: country.countryCode,
                text: country.text,
            });
        });
    },
    computed: {
        country() {
            return browser.i18n.getMessage('selectCountry_country');
        },
    },
};
</script>
