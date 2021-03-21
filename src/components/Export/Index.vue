<template>
    <div>
        <span v-if="!partLists.length">
            {{ itsEmptyHere }}
            <b-button
                variant="primary"
                @click="$router.push('/import').catch(() => {})"
            >
                {{ buttonImport }}
            </b-button>
            {{ aPartList }}
        </span>
        <b-list-group>
            <b-list-group-item
                v-for="partList in partLists"
                :key="partList.id"
                href="#"
                @click="selectPartList(partList.id)"
                style="display: inline"
            >
                <b-row>
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
                </b-row>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
export default {
    data: () => ({
        partLists: null,
    }),
    methods: {
        selectPartList(id) {
            this.$router.push('/export/' + id).catch(() => {});
            //this.$emit('changePage', 'wantedList+' + id);
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
    beforeMount() {
        this.loadPartLists();
    },
    computed: {
        itsEmptyHere() {
            return browser.i18n.getMessage('itsEmptyHere');
        },
        buttonImport() {
            return browser.i18n.getMessage('import');
        },
        aPartList() {
            return browser.i18n.getMessage('aPartList');
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
