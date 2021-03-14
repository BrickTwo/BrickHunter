<template>
    <b-container class="p-0" fluid="xl">
        <b-nav tabs>
            <b-nav-item
                :active="page == 'brickHunter'"
                @click="changePage('brickHunter')"
            >
                {{ labelBrickHunter }}
            </b-nav-item>
            <b-nav-item
                :active="page == 'brickLink'"
                @click="changePage('brickLink')"
            >
                {{ labelBrickLink }}
            </b-nav-item>
            <b-nav-item
                :active="page == 'legoSet'"
                @click="changePage('legoSet')"
            >
                {{ labelLegoSet }}
            </b-nav-item>
        </b-nav>
        <ImportBrickHunter v-if="page == 'brickHunter'" class="tabPage" />
        <ImportBrickLink v-if="page == 'brickLink'" class="tabPage" />
        <ImportLegoSet v-if="page == 'legoSet'" class="tabPage" />
    </b-container>
</template>

<script>
import ImportBrickHunter from './BrickHunter';
import ImportBrickLink from './BrickLink';
import ImportLegoSet from './LegoSet';

export default {
    data: () => ({
        page: 'brickHunter',
    }),
    components: {
        ImportBrickHunter,
        ImportBrickLink,
        ImportLegoSet,
    },
    methods: {
        changePage(value) {
            this.page = value;
        },
    },
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
        labelBrickHunter() {
            return browser.i18n.getMessage('extName');
        },
    },
};
</script>
