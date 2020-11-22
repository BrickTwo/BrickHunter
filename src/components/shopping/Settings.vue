<template>
    <b-container class="p-0" fluid="xl">
        <b-row>
            <b-col cols="2">
                <label>{{ priorityOne }}:</label>
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
                <label>{{ priorityTwo }}:</label>
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
                <label>{{ priorityThree }}:</label>
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
                    useHaveText
                }}</b-form-checkbox>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { shoppingMixin } from '@/mixins/shoppingMixin';

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
            selectedPrio1: this.$store.state.shopping.selectedPrio1,
            selectedPrio2: this.$store.state.shopping.selectedPrio2,
            selectedPrio3: this.$store.state.shopping.selectedPrio3,
            useHave: this.$store.state.shopping.useHave,
        };
    },
    mixins: [shoppingMixin],
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
    },
    computed: {
        priorityOne() {
            return browser.i18n.getMessage('shopping_priorityOne');
        },
        priorityTwo() {
            return browser.i18n.getMessage('shopping_priorityTwo');
        },
        priorityThree() {
            return browser.i18n.getMessage('shopping_priorityThree');
        },
        useHaveText() {
            return browser.i18n.getMessage('shopping_useHave');
        },
    },
};
</script>
