<template>
    <b-container>
        <b-row class="mt-0">
            <b-col>
                <div class="w-100 h-100 p-1">
                    <b-button
                        id="dropdown-left"
                        class="w-100 h-100"
                        style="border: 0"
                        @click="selectColor('all')"
                        >{{ labelAllColor }}</b-button
                    >
                </div>
            </b-col>
            <b-col v-if="colorTrans.length">
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 p-1"
                    :text="labelTransColor"
                    variant="white"
                    no-caret
                    style="max-height: 44px"
                >
                    <b-dropdown-item
                        v-for="option in colorTrans"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col v-if="colorBlack.length">
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="black"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorBlack"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col v-if="colorBrown.length">
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="brown"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorBrown"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col v-if="colorRed.length">
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="red"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorRed"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col v-if="colorOrange.length">
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="orange"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorOrange"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col v-if="colorYellow.length">
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="yellow"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorYellow"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col v-if="colorGreen.length">
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="green"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorGreen"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col v-if="colorBlue.length">
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="blue"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorBlue"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
            <b-col v-if="colorPurple.length">
                <b-dropdown
                    id="dropdown-left"
                    class="w-100 h-100 p-1"
                    variant="purple"
                    no-caret
                >
                    <b-dropdown-item
                        v-for="option in colorPurple"
                        :key="option.id"
                        @click="selectColor(option.id)"
                        ><div :style="backgroundColorCode(option.colorCode)" />
                        {{ option.brickLinkName }}</b-dropdown-item
                    >
                </b-dropdown>
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="scss">
@import '../../../../node_modules/bootstrap/scss/bootstrap';
.btn-grey {
    background-color: $gray-300;
}
.btn-white {
    background-color: $light;
}
.btn-black {
    background-color: $dark;
}
.btn-brown {
    background-color: #7f1e06;
}
.btn-red {
    background-color: $red;
}
.btn-orange {
    background-color: $orange;
}
.btn-yellow {
    background-color: $yellow;
}
.btn-green {
    background-color: $green;
}
.btn-blue {
    background-color: $blue;
}
.btn-purple {
    background-color: $purple;
}
</style>

<script>
import { requestsMixin } from '@/mixins/requestsMixin';

export default {
    props: {
        colorList: {
            Type: Array,
        },
    },
    data: () => ({
        colorTrans: [],
        colorBlack: [],
        colorBrown: [],
        colorRed: [],
        colorOrange: [],
        colorYellow: [],
        colorGreen: [],
        colorBlue: [],
        colorPurple: [],
    }),
    mixins: [requestsMixin],
    methods: {
        selectColor(value) {
            this.$emit('selectColor', value);
        },
        async fillColors() {
            //var colors = await this.getColorsAsync();
            var colors = this.colorList;

            this.colorTrans = colors.filter((color) =>
                color.group.find((group) => group === 'Trans')
            );
            this.colorBlack = colors.filter((color) =>
                color.group.find((group) => group === 'Black')
            );
            this.colorBrown = colors.filter((color) =>
                color.group.find((group) => group === 'Brown')
            );
            this.colorRed = colors.filter((color) =>
                color.group.find((group) => group === 'Red')
            );
            this.colorOrange = colors.filter((color) =>
                color.group.find((group) => group === 'Orange')
            );
            this.colorYellow = colors.filter((color) =>
                color.group.find((group) => group === 'Yellow')
            );
            this.colorGreen = colors.filter((color) =>
                color.group.find((group) => group === 'Green')
            );
            this.colorBlue = colors.filter((color) =>
                color.group.find((group) => group === 'Blue')
            );
            this.colorPurple = colors.filter((color) =>
                color.group.find((group) => group === 'Purple')
            );
        },
        backgroundColorCode(value) {
            return `background-color: ${value}; border: 1px solid black; width: 13px; height: 13px; margin-right: 5px; display: inline-block`;
        },
    },
    beforeMount() {
        this.fillColors();
    },
    computed: {
        labelAllColor() {
            return browser.i18n.getMessage('import_sp_allColor');
        },
        labelTransColor() {
            return browser.i18n.getMessage('import_sp_transColor');
        },
    },
    watch: {
        colorList() {
            this.fillColors();
        }
    }
};
</script>
