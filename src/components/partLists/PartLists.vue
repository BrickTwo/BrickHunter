<template>
    <b-container class="px-2" fluid="xl">
        <b-row>
            <b-col>
                <b-alert show variant="warning">{{ labelInfo }}</b-alert> 
            </b-col>
        </b-row>
        <b-row>
            <!--<b-col class="text-right">
                {{ $store.state.partList.totalPositions }} / 2000
                {{ labelPositions }}
            </b-col>-->
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
                            <b-col cols="auto" @click.stop>
                                <b-form-checkbox
                                    :id="'cart-' + partList.id"
                                    v-model="partList.cart"
                                    @click="cart(partList.id, partList.cart)"
                                >
                                    <b-icon icon="cart4" aria-hidden="true" />
                                </b-form-checkbox>
                            </b-col>
                            <b-col cols="2" class="text-left">
                                <span v-if="partList.source == 'brickLink'">
                                    {{ labelBrickLink }}
                                </span>
                                <span v-if="partList.source == 'lego'">
                                    {{ labelLegoSet }}
                                </span>
                                <span v-if="partList.source == 'singleParts'">
                                    {{ labelSinglePart }}
                                </span>
                            </b-col>
                            <b-col class="text-overflow-elipsis">
                                {{ partList.name }}
                            </b-col>
                            <b-col cols="auto" class="text-right">
                                <b-badge variant="primary" pill>
                                    {{ partList.positions.length }}
                                </b-badge>
                            </b-col>
                            <b-col cols="2" class="px-0 text-right">
                                {{ partList.date | formatDate }}
                            </b-col>
                            <b-col cols="auto" class="text-right" @click.stop>
                                <b-icon
                                    icon="trash"
                                    aria-hidden="true"
                                    @click="onDeleteList(partList.id, partList.name)"
                                />
                            </b-col>
                        </b-row>
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
        <b-modal
            id="askDeletePartList"
            :title="labelAskDeletePartListHeader"
            :header-bg-variant="headerBgVariant"
            :header-text-variant="headerTextVariant"
            centered
            @ok="deleteList()"
        >
            <p class="my-4">
                {{ labelAskDeletePartListBody }}
            </p>
            <p class="my-4">
                <b>{{ deleteListName }}</b>
            </p>
            <template #modal-footer="{ cancel, ok }">
                <b-button @click="cancel()">
                    {{ labelAskNo }}
                </b-button>
                <!-- Button with custom close trigger value -->
                <b-button @click="ok()">
                    {{ labelAskYes }}
                </b-button>
            </template>
        </b-modal>
    </b-container>
</template>

<script>
export default {
    data: () => ({
        partLists: null,
        deleteListId: null,
        deleteListName: null,
        headerBgVariant: 'dark',
        headerTextVariant: 'light',
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
        onDeleteList(id, name) {
            this.deleteListId = id;
            this.deleteListName = name;
            this.$bvModal.show('askDeletePartList');
        },
        deleteList() {
            this.$store.commit('partList/deletePartList', this.deleteListId);
            this.deleteListId = null;
            this.loadPartLists();
        },
        loadPartLists() {
            this.partLists = this.$store.state.partList.partLists.sort(
                (a, b) => {
                    if (a.name.toUpperCase() > b.name.toUpperCase()) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            );
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
        labelAskYes() {
            return browser.i18n.getMessage('wantedList_askYes');
        },
        labelAskNo() {
            return browser.i18n.getMessage('wantedList_askNo');
        },
        labelAskDeletePartListHeader() {
            return browser.i18n.getMessage(
                'wantedList_askDeletePartListHeader'
            );
        },
        labelAskDeletePartListBody() {
            return browser.i18n.getMessage('wantedList_askDeletePartListBody');
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
        labelInfo() {
            return browser.i18n.getMessage('info');
        },
    },
};
</script>
