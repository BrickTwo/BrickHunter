<template>
    <div>
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
            </b-nav-item>
            <b-nav-item :active="page == 'legoSet'" @click="page = 'legoSet'">
                LEGO Set
            </b-nav-item>-->
        </b-nav>
        <ImportBrickLink v-if="page == 'brickLink'" class="tabPage" />
    </div>
</template>

<script>
import ImportBrickLink from './BrickLink';

export default {
    data: () => ({
        page: 'brickLink',
    }),
    components: {
        ImportBrickLink,
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
