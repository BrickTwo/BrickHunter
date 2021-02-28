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
            <b-form-group>
                <b-form-radio
                    v-for="partList in partLists"
                    :key="partList.id"
                    v-model="activeId"
                    name="some-radios"
                    :value="partList.id"
                >
                    {{ partList.name }} ({{ partList.positions.length }})
                    <b-link @click="selectPartList(partList.id)" v-if="selectedId!=partList.id">
                        <b-icon
                            icon="eye-slash"
                            variant="secondary"
                            aria-hidden="true"
                        />
                    </b-link>
                    <b-link @click="deselectPartList(partList.id)" v-else>
                        <b-icon
                            icon="eye"
                            aria-hidden="true"
                        />
                    </b-link>
                </b-form-radio>
            </b-form-group>
        </b-row>
    </b-container>
</template>

<script>
import { bus } from '@/components/BrickHunter';

export default {
    data: () => ({
        partLists: null,
        activeId: null,
        selectedId: null,
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
        selectPartList(id) {
            this.selectedId = id;
            this.$emit('partListSelected', id);
        },
        deselectPartList(id) {
            this.selectedId = null;
            this.$emit('partListSelected', null);
        }
    },
    beforeMount() {
        this.partLists = this.$store.getters['partList/getPartListsBySource'](
            'singleParts'
        );
        this.sortPartList();

        if (this.partLists.length) {
            this.activeId = this.partLists[0].id;
        }
    },
    created() {
        bus.$on('newSinglePartList', (data) => {
            this.partLists = this.$store.getters[
                'partList/getPartListsBySource'
            ]('singleParts');
            this.activeId = this.partLists[0].id;
            this.sortPartList();
        });
    },
    watch: {
        activeId: function() {
            this.$emit('partListActive', this.activeId);
        },
    },
    computed: {
        labelNewPartLists() {
            return browser.i18n.getMessage('import_sp_newPartList');
        },
        labelSinglePartList() {
            return browser.i18n.getMessage('import_sp_singlePartList');
        },
    },
};
</script>
