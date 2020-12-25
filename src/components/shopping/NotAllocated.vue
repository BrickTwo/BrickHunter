<template>
    <b-container class="bv-example-row" fluid="xl">
        <b-row>
            <b-col>
                <b-button
                    class="button"
                    variant="primary"
                    @click="printBrickLink"
                    :disabled="!brickList || brickList.length == 0"
                >
                    <b-icon icon="printer" aria-hidden="true" />
                </b-button>
                <b-button class="button" variant="primary" @click="showInfo">
                    <b-icon icon="info-circle" aria-hidden="true" />
                </b-button>
                <textarea id="tempFieldForCopy" />
            </b-col>
        </b-row>
        <b-row>
            <b-col id="brickList">
                <brick-list :bricklist="brickList" />
            </b-col>
        </b-row>
    </b-container>
</template>

<style scoped>
#tempFieldForCopy {
    position: absolute;
    top: -500px;
    height: 0;
    width: 0;
    z-index: -5;
}
</style>

<script>
import BrickList from '../BrickList';
export default {
    data() {
        return {
            brickList: null,
        };
    },
    components: {
        BrickList,
    },
    methods: {
        showInfo() {
            this.$router.push('/info').catch(() => {});
        },
        printBrickLink() {
            this.$htmlToPaper('brickList');
        },
    },
    beforeMount() {
        this.brickList = this.$store.state.shopping.notAllocatedList;
    },
};
</script>
