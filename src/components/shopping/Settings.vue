<template>
    <b-container class="p-0" fluid="xl">
        <b-row>
            <b-col cols="2">
                <label>{{ labelPriorityOne }}:</label>
            </b-col>
            <b-col cols="10">
                <b-form-select
                    v-model="selectedPrio1"
                    :options="optionsPrio1"
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="2">
                <label>{{ labelPriorityTwo }}:</label>
            </b-col>
            <b-col cols="10">
                <b-form-select
                    v-model="selectedPrio2"
                    :options="optionsPrio2"
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="2">
                <label>{{ labelPriorityThree }}:</label>
            </b-col>
            <b-col cols="10">
                <b-form-select
                    v-model="selectedPrio3"
                    :options="optionsPrio3"
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col offset="2" cols="10">
                <b-form-checkbox id="useHave" v-model="useHave">{{
                    labelUseHaveText
                }}</b-form-checkbox>
            </b-col>
        </b-row>
        <b-row>
            <b-col offset="2" cols="10">
                <b-form-checkbox
                    id="ignoreBrickLinkPrice"
                    v-model="ignoreBrickLinkPrice"
                    >{{ labelIgnoreBrickLinkPrice }}
                </b-form-checkbox>
            </b-col>
        </b-row>
        <b-row>
            <b-col offset="2" cols="10" style="display: flex">
                <b-form-checkbox
                    id="subtractBrickLinkPrice"
                    v-model="subtractBrickLinkPrice"
                />
                <span>{{ labelSubtractBrickLinkPirceBefore }}</span>
                <b-form-input
                    type="number"
                    v-model="subtractBrickLinkPriceAmount"
                    style="width: 85px; margin: 0 5px; height: 25px"
                />
                <b-form-select
                    v-model="subtractBrickLinkPriceUnit"
                    :options="optionsSubtractBrickLinkPriceUnit"
                    style="width: 85px; margin-right: 5px; height: 25px; padding: 0 5px"
                />
                <span>{{ labelSubtractBrickLinkPirceAfter }}</span>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { shoppingMixin } from '@/mixins/shoppingMixin';
import { countryMixin } from '@/mixins/countryMixin';

export default {
    data() {
        return {
            optionsPrio1: [
                {
                    value: 'none',
                    text: browser.i18n.getMessage('shopping_optionsNone'),
                },
                {
                    value: 'bricksAndPieces',
                    text: browser.i18n.getMessage('bricksAndPieces'),
                },
                {
                    value: 'pickABrick',
                    text: browser.i18n.getMessage('pickABrick'),
                },
                {
                    value: 'brickLink',
                    text: browser.i18n.getMessage('brickLink'),
                },
            ],
            optionsPrio2: [
                {
                    value: 'none',
                    text: browser.i18n.getMessage('shopping_optionsNone'),
                },
                {
                    value: 'bricksAndPieces',
                    text: browser.i18n.getMessage('bricksAndPieces'),
                },
                {
                    value: 'pickABrick',
                    text: browser.i18n.getMessage('pickABrick'),
                },
                {
                    value: 'brickLink',
                    text: browser.i18n.getMessage('brickLink'),
                },
            ],
            optionsPrio3: [
                {
                    value: 'none',
                    text: browser.i18n.getMessage('shopping_optionsNone'),
                },
                {
                    value: 'bricksAndPieces',
                    text: browser.i18n.getMessage('bricksAndPieces'),
                },
                {
                    value: 'pickABrick',
                    text: browser.i18n.getMessage('pickABrick'),
                },
                {
                    value: 'brickLink',
                    text: browser.i18n.getMessage('brickLink'),
                },
            ],
            optionsSubtractBrickLinkPriceUnit: [
                {
                    value: 'absolute',
                    text: 'Currency',
                },
                {
                    value: 'percentage',
                    text: '%',
                },
            ],
            selectedPrio1: this.$store.state.shopping.settings.selectedPrio1,
            selectedPrio2: this.$store.state.shopping.settings.selectedPrio2,
            selectedPrio3: this.$store.state.shopping.settings.selectedPrio3,
            useHave: this.$store.state.shopping.settings.useHave,
            ignoreBrickLinkPrice: this.$store.state.shopping.settings
                .ignoreBrickLinkPrice,
            subtractBrickLinkPrice: this.$store.state.shopping.settings
                .subtractBrickLinkPrice,
            subtractBrickLinkPriceAmount: this.$store.state.shopping.settings
                .subtractBrickLinkPriceAmount,
            subtractBrickLinkPriceUnit: this.$store.state.shopping.settings
                .subtractBrickLinkPriceUnit,
        };
    },
    mixins: [shoppingMixin, countryMixin],
    beforeMount() {
        var country = this.COUNTRIES.find(
            (country) => country.countryCode == this.$store.state.country
        );

        this.optionsSubtractBrickLinkPriceUnit.find(
            (option) => (option.value = 'absolute')
        ).text = country.currency;
    },
    watch: {
        selectedPrio1: function(val) {
            this.$store.commit('shopping/setSelectedPrio1', val);
            this.calcTotalPrice();
        },
        selectedPrio2: function(val) {
            this.$store.commit('shopping/setSelectedPrio2', val);
            this.calcTotalPrice();
        },
        selectedPrio3: function(val) {
            this.$store.commit('shopping/setSelectedPrio3', val);
            this.calcTotalPrice();
        },
        useHave: function(val) {
            this.$store.commit('shopping/setUseHave', val);
            this.calcTotalPrice();
        },
        ignoreBrickLinkPrice: function(val) {
            this.$store.commit('shopping/setIgnoreBrickLinkPrice', val);
            this.calcTotalPrice();
        },
        subtractBrickLinkPrice: function(val) {
            this.$store.commit('shopping/setSubtractBrickLinkPrice', val);
            this.calcTotalPrice();
        },
        subtractBrickLinkPriceAmount: function(val) {
            if (this.subtractBrickLinkPriceUnit === 'percentage' && val < 0)
                this.subtractBrickLinkPriceAmount = 0;
            val = this.subtractBrickLinkPriceAmount;
            this.$store.commit('shopping/setSubtractBrickLinkPriceAmount', val);
            this.calcTotalPrice();
        },
        subtractBrickLinkPriceUnit: function(val) {
            if (val === 'percentage' && this.subtractBrickLinkPriceAmount < 0)
                this.subtractBrickLinkPriceAmount = 0;
            this.$store.commit('shopping/setSubtractBrickLinkPriceUnit', val);
            this.calcTotalPrice();
        },
    },
    computed: {
        labelPriorityOne() {
            return browser.i18n.getMessage('shopping_priorityOne');
        },
        labelPriorityTwo() {
            return browser.i18n.getMessage('shopping_priorityTwo');
        },
        labelPriorityThree() {
            return browser.i18n.getMessage('shopping_priorityThree');
        },
        labelUseHaveText() {
            return browser.i18n.getMessage('shopping_useHave');
        },
        labelIgnoreBrickLinkPrice() {
            return browser.i18n.getMessage('shopping_ignoreBrickLinkPrice');
        },
        labelSubtractBrickLinkPirceBefore() {
            return browser.i18n.getMessage(
                'shopping_subtractBrickLinkPirceBefore'
            );
        },
        labelSubtractBrickLinkPirceAfter() {
            return browser.i18n.getMessage(
                'shopping_subtractBrickLinkPirceAfter'
            );
        },
    },
};
</script>
