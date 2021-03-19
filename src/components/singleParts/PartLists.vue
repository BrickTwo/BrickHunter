<template>
    <b-container fluid="xl">
        <b-row>
            <b-col>
                <b-button
                    class="button"
                    variant="primary"
                    @click="createNewPartList()"
                >
                    {{ labelNewPartLists }}
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <label class="custom-favorite-label">
                <b-icon icon="heart-fill" aria-hidden="true" variant="danger" />
                <span style="margin-left: 3px">
                    {{ labelFavorites }} ({{ favorites.length }})
                </span>
                <b-link @click="showFavorites()" v-if="!favoriteSelected">
                    <b-icon
                        icon="eye-slash"
                        variant="secondary"
                        aria-hidden="true"
                    />
                </b-link>
                <b-link @click="hideFavorite()" v-else>
                    <b-icon icon="eye" aria-hidden="true" />
                </b-link>
            </label>
        </b-row>
        <b-row class="mt-0">
            <label class="custom-favorite-label">
                <b-icon
                    icon="check-circle-fill"
                    aria-hidden="true"
                    variant="success"
                />
                <span style="margin-left: 3px">
                    {{ labelHaveIts }} ({{ haveIts.length }})
                </span>
                <b-link @click="showHaveIts()" v-if="!haveItSelected">
                    <b-icon
                        icon="eye-slash"
                        variant="secondary"
                        aria-hidden="true"
                    />
                </b-link>
                <b-link @click="hideHaveIt()" v-else>
                    <b-icon icon="eye" aria-hidden="true" />
                </b-link>
            </label>
        </b-row>
        <b-row class="mt-0">
            <b-form-group>
                <b-form-radio
                    v-for="partList in partLists"
                    :key="partList.id"
                    v-model="selectedPartListId"
                    name="some-radios"
                    :value="partList.id"
                >
                    {{ partList.name }} ({{ partList.positions.length }})
                    <b-link
                        @click="showPartList(partList.id)"
                        v-if="showPartListId != partList.id"
                    >
                        <b-icon
                            icon="eye-slash"
                            variant="secondary"
                            aria-hidden="true"
                        />
                    </b-link>
                    <b-link @click="hidePartList(partList.id)" v-else>
                        <b-icon icon="eye" aria-hidden="true" />
                    </b-link>
                </b-form-radio>
            </b-form-group>
        </b-row>
    </b-container>
</template>

<style scoped>
.custom-favorite-label {
    margin-bottom: 0;
}
</style>

<script>
import { bus } from '@/utility/bus';

export default {
    data: () => ({
        partLists: null,
        selectedPartListId: null,
        showPartListId: null,
        favorites: null,
        favoriteSelected: false,
        haveIts: null,
        haveItSelected: false,
    }),
    methods: {
        createNewPartList() {
            /*var name = 'Einzelteilliste';
            var count = this.partLists.filter((list) => list.name == name)
                .length;
                
            if (count > 0) {
                name = name + ' ' + (count + 1);
            }*/

            var newPartList = {
                id: this.generateUUID(),
                name: this.labelSinglePartList,
                cart: true,
                date: new Date(0, 0, 0, 0, 0, 0, 0),
                source: 'singleParts',
                positions: [],
            };

            this.partLists.push(newPartList);
            this.$store.commit('partList/setPartList', newPartList);
            this.sortPartList();
        },
        generateUUID() {
            // Public Domain/MIT
            var d = new Date().getTime();
            if (
                typeof performance !== 'undefined' &&
                typeof performance.now === 'function'
            ) {
                d += performance.now(); //use high-precision timer if available
            }
            var newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                /[xy]/g,
                function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
                }
            );

            return newGuid;
        },
        sortPartList() {
            this.partLists.sort((a, b) => {
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1;
                } else {
                    return -1;
                }
            });
        },
        showPartList(id) {
            this.favoriteSelected = false;
            this.haveItSelected = false;
            this.showPartListId = id;
            //this.$emit('partListSelected', id);
            bus.$emit(
                'showPartList',
                this.showPartListId,
                this.favoriteSelected,
                this.haveItSelected
            );
        },
        hidePartList(id) {
            this.showPartListId = null;
            //this.$emit('partListSelected', null);
            bus.$emit(
                'showPartList',
                this.showPartListId,
                this.favoriteSelected,
                this.haveItSelected
            );
        },
        showFavorites() {
            this.showPartListId = null;
            this.haveItSelected = false;
            this.favoriteSelected = true;
            //this.$emit('favoriteSelected', true);
            bus.$emit(
                'showPartList',
                this.showPartListId,
                this.favoriteSelected,
                this.haveItSelected
            );
        },
        hideFavorite() {
            this.favoriteSelected = false;
            //this.$emit('favoriteSelected', false);
            bus.$emit(
                'showPartList',
                this.showPartListId,
                this.favoriteSelected,
                this.haveItSelected
            );
        },
        showHaveIts() {
            this.favoriteSelected = false;
            this.showPartListId = null;
            this.haveItSelected = true;
            //this.$emit('favoriteSelected', true);
            bus.$emit(
                'showPartList',
                this.showPartListId,
                this.favoriteSelected,
                this.haveItSelected
            );
        },
        hideHaveIt() {
            this.haveItSelected = false;
            //this.$emit('haveItSelected', false);
            bus.$emit(
                'showPartList',
                this.showPartListId,
                this.favoriteSelected,
                this.haveItSelected
            );
        },
    },
    beforeMount() {
        this.partLists = this.$store.getters['partList/getPartListsBySource'](
            'singleParts'
        );
        this.favorites = this.$store.state.singleParts.favorites;
        this.haveIts = this.$store.state.singleParts.haveIts;
        let filter = this.$store.state.singleParts.filter;

        this.showPartListId = filter.showPartListId;
        this.favoriteSelected = filter.showFavorites;
        this.haveItSelected = filter.showHaveIts;

        if (!this.partLists.find((f) => f.id == this.showPartListId))
            this.showPartListId = null;

        this.sortPartList();

        if (this.partLists.length) {
            this.selectedPartListId = this.partLists[0].id;
        }
    },
    created() {
        bus.$on('newSinglePartList', (data) => {
            this.partLists = this.$store.getters[
                'partList/getPartListsBySource'
            ]('singleParts');
            this.selectedPartListId = this.partLists[0].id;
            this.sortPartList();
        });
    },
    watch: {
        selectedPartListId: function() {
            //this.$emit('partListActive', this.selectedPartListId);
            bus.$emit('selectedPartList', this.selectedPartListId);
        },
    },
    computed: {
        labelNewPartLists() {
            return browser.i18n.getMessage('import_sp_newPartList');
        },
        labelSinglePartList() {
            return browser.i18n.getMessage('import_sp_singlePartList');
        },
        labelFavorites() {
            return browser.i18n.getMessage('import_sp_favorites');
        },
        labelHaveIts() {
            return browser.i18n.getMessage('import_sp_haveIt');
        },
    },
};
</script>
