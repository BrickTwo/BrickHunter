<template>
    <b-container class="p-0" fluid="xl">
        <b-nav tabs>
            <b-nav-item
                :active="page == 'brickLink'"
                @click="changePage('brickLink')"
            >
                {{ labelBrickLink }}
            </b-nav-item>
            <!--<b-nav-item
                :active="page == 'bricksAndPieces'"
                @click="page = 'bricksAndPieces'"
            >
                {{ labelBricksAndPieces }}
            </b-nav-item>
            <b-nav-item
                :active="page == 'pickABrick'"
                @click="page = 'pickABrick'"
            >
                {{ labelPickABrick }}
            </b-nav-item>-->
            <b-nav-item
                :active="page == 'legoSet'"
                @click="changePage('legoSet')"
            >
                {{ labelLegoSet }}
            </b-nav-item>
            <b-nav-item
                :active="page == 'singleParts'"
                @click="changePage('singleParts')"
            >
                {{ labelSinglePart }} <span style="color: red">*beta*</span>
            </b-nav-item>
        </b-nav>
        <ImportBrickLink v-if="page == 'brickLink'" class="tabPage" />
        <LegoSet v-if="page == 'legoSet'" class="tabPage" />
        <SingleParts v-if="page == 'singleParts'" class="tabPage" />
    </b-container>
</template>

<script>
import ImportBrickLink from './BrickLink';
import LegoSet from './LegoSet';
import SingleParts from './SingleParts';

export default {
    data: () => ({
        page: 'brickLink',
    }),
    components: {
        ImportBrickLink,
        LegoSet,
        SingleParts,
    },
    methods: {
        changePage(value) {
            this.page = value;
            //this.$router.push(`/import/${value}`).catch(() => {});
        },
    },
    /*beforeMount() {
        this.$router.push(`/import/${this.page}`).catch(() => {});
    },*/
    computed: {
        labelPickABrick() {
            return browser.i18n.getMessage('pickABrick');
        },
        labelBricksAndPieces() {
            return browser.i18n.getMessage('bricksAndPieces');
        },
        labelBrickLink() {
            return browser.i18n.getMessage('brickLink');
        },
        labelLegoSet() {
            return browser.i18n.getMessage('import_legoSet');
        },
        labelSinglePart() {
            return browser.i18n.getMessage('import_singleParts');
        },
    },
};
</script>
