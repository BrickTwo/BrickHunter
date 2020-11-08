<template>
    <b-container class="p-0" fluid="xl">
        <b-nav tabs>
            <b-nav-item
                :active="page == 'brickLink'"
                @click="page = 'brickLink'"
            >
                {{ labelBrickLink }}
            </b-nav-item>
            <!---<b-nav-item
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
            <b-nav-item :active="page == 'legoSet'" @click="page = 'legoSet'">
                LEGO Set
            </b-nav-item>
        </b-nav>
        <ImportBrickLink v-if="page == 'brickLink'" class="tabPage" />
        <LegoSet v-if="page == 'legoSet'" class="tabPage" />
    </b-container>
</template>

<script>
import ImportBrickLink from './BrickLink';
import LegoSet from './LegoSet';

export default {
    data: () => ({
        page: 'legoSet',
    }),
    components: {
        ImportBrickLink,
        LegoSet,
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
    },
};
</script>
