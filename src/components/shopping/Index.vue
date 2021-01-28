<template>
    <b-container class="p-0" fluid="xl">
        <b-nav tabs>
            <b-nav-item
                :active="page == 'settings'"
                @click="page = 'settings'"
            >
                {{ tabSettings }}
            </b-nav-item>
            <b-nav-item
                class="p-0"
                :active="page == 'overview'"
                @click="page = 'overview'"
            >
                {{ tabOverview }}
            </b-nav-item>
            <b-nav-item
                class="p-0"
                :active="page == 'bricksAndPieces'"
                @click="page = 'bricksAndPieces'"
                v-if="
                    $store.state.shopping.settings.selectedPrio1 == 'bricksAndPieces' ||
                        $store.state.shopping.settings.selectedPrio2 ==
                            'bricksAndPieces' ||
                        $store.state.shopping.settings.selectedPrio3 == 'bricksAndPieces'
                "
            >
                {{ bricksAndPieces }} ({{
                    $store.state.shopping.bricksAndPiecesPositions
                }})
            </b-nav-item>
            <b-nav-item
                class="p-0"
                :active="page == 'pickABrick'"
                @click="page = 'pickABrick'"
                v-if="
                    $store.state.shopping.settings.selectedPrio1 == 'pickABrick' ||
                        $store.state.shopping.settings.selectedPrio2 == 'pickABrick' ||
                        $store.state.shopping.settings.selectedPrio3 == 'pickABrick'
                "
            >
                {{ pickABrick }} ({{
                    $store.state.shopping.pickABrickPositions
                }})
            </b-nav-item>
            <b-nav-item
                class="p-0"
                :active="page == 'brickLink'"
                @click="page = 'brickLink'"
                v-if="
                    $store.state.shopping.settings.selectedPrio1 == 'brickLink' ||
                        $store.state.shopping.settings.selectedPrio2 == 'brickLink' ||
                        $store.state.shopping.settings.selectedPrio3 == 'brickLink'
                "
            >
                {{ brickLink }} ({{ $store.state.shopping.brickLinkPositions }})
            </b-nav-item>
            <b-nav-item
                class="p-0"
                :active="page == 'notAllocated'"
                @click="page = 'notAllocated'"
                v-if="$store.state.shopping.notAllocatedPositions > 0"
            >
                {{ notAllocated }} ({{
                    $store.state.shopping.notAllocatedPositions
                }})
            </b-nav-item>
        </b-nav>
        <Settings v-if="page == 'settings'" class="tabPage" />
        <Overview v-if="page == 'overview'" class="tabPage" />
        <BricksAndPieces v-if="page == 'bricksAndPieces'" class="tabPage" />
        <PickABrick v-if="page == 'pickABrick'" class="tabPage" />
        <BrickLink v-if="page == 'brickLink'" class="tabPage" />
        <NotAllocated v-if="page == 'notAllocated'" class="tabPage" />
        <b-toast id="partListsToOldWarning" variant="danger" solid>
            <template #toast-title>
                <div class="d-flex flex-grow-1 align-items-baseline">
                    <b-img
                        blank
                        blank-color="#ff5555"
                        class="mr-2"
                        width="12"
                        height="12"
                    ></b-img>
                    <strong class="mr-auto">Notice!</strong>
                </div>
            </template>
            {{ partListToOldText }}
            <ul
                v-for="name in oldPartLists"
                :key="name"
                style="margin-top: 10px"
            >
                <li>{{ name }}</li>
            </ul>
        </b-toast>
    </b-container>
</template>

<style scoped>
.nav-link{
    padding: 0.5rem 0.5rem;
}
</style>

<script>
import Settings from './Settings';
import Overview from './Overview';
import BricksAndPieces from './BricksAndPieces';
import PickABrick from './PickABrick';
import BrickLink from './BrickLink';
import NotAllocated from './NotAllocated';
import { shoppingMixin } from '@/mixins/shoppingMixin';

export default {
    data() {
        return {
            page: 'overview',
            oldPartLists: [],
        };
    },
    mixins: [shoppingMixin],
    components: {
        Settings,
        Overview,
        BricksAndPieces,
        PickABrick,
        BrickLink,
        NotAllocated,
    },
    methods: {
        loadPartLists() {
            var wantedList = [];

            this.$store.state.partList.partLists.map((partList) => {
                
                if (!partList.positions) return;
                if (!partList.cart) return;

                if (
                    Date.now() - new Date(partList.date).getTime() >
                    1000 * 60 * 60 * 48
                ) {
                    this.oldPartLists.push(partList.name);
                    return;
                }
                wantedList = [].concat(wantedList, ...partList.positions);
            });
            /*var partListMerged = [];

            wantedList.map((part) => {
                var found = partListMerged.find(
                    (f) =>
                        f.designId == part.designId &&
                        f.color.brickLinkId == part.color.brickLinkId
                );

                if (found) {
                    found.qty = { ...found.qty };
                    found.qty.min = parseInt(found.qty.min);
                    found.qty.have = parseInt(found.qty.have);
                    found.qty.min += parseInt(part.qty.min);
                    found.qty.have += parseInt(part.qty.have);
                    found.qty.balance = found.qty.min - found.qty.have;
                } else {
                    partListMerged.push({ ...part });
                }
            });

            this.$store.commit('shopping/setWantedList', partListMerged);

            if (this.$store.state.shopping.wantedList.length)
                this.$store.commit(
                    'shopping/setwantedListPositionsMerged',
                    this.$store.state.shopping.wantedList.length
                );*/

            this.$store.commit('shopping/setWantedList', wantedList);
        },
    },
    beforeMount() {
        this.loadPartLists();
        this.calcTotalPrice();
    },
    mounted() {
        if (this.oldPartLists.length)
            this.$bvToast.show('partListsToOldWarning');
    },
    computed: {
        pickABrick() {
            return browser.i18n.getMessage('pickABrick');
        },
        bricksAndPieces() {
            return browser.i18n.getMessage('bricksAndPieces');
        },
        brickLink() {
            return browser.i18n.getMessage('brickLink');
        },
        tabSettings() {
            return browser.i18n.getMessage('shopping_tabSettings');
        },
        tabOverview() {
            return browser.i18n.getMessage('shopping_tabOverview');
        },
        notAllocated() {
            return browser.i18n.getMessage('shopping_notAllocated');
        },
        partListToOldText() {
            return browser.i18n.getMessage('shopping_partListToOldText');
        },
    },
};
</script>
