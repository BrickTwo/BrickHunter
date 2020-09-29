<template>
    <div style="width: 500px">
        <b-form @submit.prevent="onSubmit">
            <b-form-group :label="whereDoYouLive" label-for="country">
                <SelectCountryDropDown @countrySelected="onCountrySelected" />
                <span v-if="!isValid" style="color: red">
                    {{ noCountrySelected }}
                </span>
            </b-form-group>
            <b-button type="submit" variant="primary">
                {{ saveButton }}
            </b-button>
        </b-form>
    </div>
</template>

<script>
import SelectCountryDropDown from '@/components/SelectCountryDropDown.vue'
export default {
    components: {
        SelectCountryDropDown,
    },
    data() {
        return {
            form_country: null,
            isValid: true
        }
    },
    methods: {
        async onSubmit() {
            if (!this.form_country) {
                this.isValid = false
                return
            }
            this.isValid = true
            this.$emit('countrySelected', this.form_country)
        },
        onCountrySelected(country) {
            this.form_country = country
        },
    },
    computed: {
        whereDoYouLive() {
            return browser.i18n.getMessage('selectCountry_whereDoYouLive')
        },
        noCountrySelected() {
            return browser.i18n.getMessage('selectCountry_noCountrySelected')
        },
        saveButton() {
            return browser.i18n.getMessage('selectCountry_saveButton')
        },
    },
}
</script>
