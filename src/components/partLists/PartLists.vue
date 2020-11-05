<template>
    <b-container class="px-2" fluid="lg">
        <b-row>
            <b-col class="text-right">
                {{ $store.state.partList.totalPositions }} / 2000 {{ labelPositions }}
            </b-col>
            <div class="w-100" />
            <b-col v-if="!partLists.length">
                {{ labelItsEmptyHere }}
                <b-button
                    variant="primary"
                    @click="$router.push('/import').catch(() => {})"
                    >{{ labelImport }}
                </b-button>
                {{ labelAPartList }}
            </b-col>
            <b-col v-if="partLists.length">
                <b-list-group>
                    <b-list-group-item
                        v-for="partList in partLists"
                        :key="partList.id"
                        href="#"
                        @click="selectPartList(partList.id)"
                        style="display: inline"
                        :variant="variant(partList.date)"
                    >
                    <b-row>
                        <b-col md="auto" @click.stop>
                            <b-form-checkbox
                                    :id="'cart-' + partList.id"
                                    v-model="partList.cart"
                                    @click="cart(partList.id, partList.cart)"
                                >
                                    <b-icon icon="cart4" aria-hidden="true" />
                                </b-form-checkbox>
                        </b-col>
                        <b-col class="text-overflow-elipsis">
                            {{ partList.name }}
                        </b-col>
                        <b-col md="auto" class="text-right">
                            <b-badge variant="primary" pill>
                                {{ partList.positions.length }}
                            </b-badge>
                        </b-col>
                        <b-col md="auto" class="px-0 text-right">
                            {{ partList.date | formatDate }}
                        </b-col>
                        <b-col md="auto" class="text-right" @click.stop>
                            <b-icon
                                icon="trash"
                                aria-hidden="true"
                                @click="deleteList(partList.id)"
                            />
                        </b-col>
                    </b-row>
                        
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    data: () => ({
        partLists: null,
    }),
    methods: {
        selectPartList(id) {
            this.$router.push('/partLists/' + id).catch(() => {});
        },
        variant(date) {
            var d = Date.now() - new Date(date).getTime();
            if (d > 1000 * 60 * 60 * 48) {
                return 'danger';
            } else if (d > 1000 * 60 * 60 * 24) {
                return 'warning';
            }
        },
        deleteList(id) {
            this.$store.commit('deletePartList', id);
            this.loadPartLists();
        },
        loadPartLists() {
            this.partLists = this.$store.state.partList.partLists.sort((a, b) => {
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1;
                } else {
                    return -1;
                }
            });
        },
    },
    watch: {
        partLists: {
            handler(val, oldVal) {
                val.forEach((item) => {
                    this.$store.commit('partList/setPartList', item);
                });
            },
            deep: true,
        },
    },
    beforeMount() {
        this.loadPartLists();
    },
    computed: {
        labelPositions() {
            return browser.i18n.getMessage('partList_Positions');
        },
        labelItsEmptyHere() {
            return browser.i18n.getMessage('itsEmptyHere');
        },
        labelImport() {
            return browser.i18n.getMessage('import');
        },
        labelAPartList() {
            return browser.i18n.getMessage('aPartList');
        },
    },
};
</script>
