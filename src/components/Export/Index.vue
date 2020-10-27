<template>
    <div>
        <span v-if="!partLists.length"
            >{{ itsEmptyHere
            }}<b-button
                variant="primary"
                @click="$router.push('/import').catch(() => {})"
                >{{ buttonImport }}</b-button
            >{{ aPartList }}</span
        >
        <b-list-group>
            <b-list-group-item
                v-for="partList in partLists"
                :key="partList.id"
                href="#"
                @click="selectPartList(partList.id)"
                style="display: inline"
            >
                <span
                    style="max-width:640px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: bottom"
                    >{{ partList.name }}</span
                ><span style="float: right;">
                    <b-badge variant="primary" pill>{{
                        partList.positions.length
                    }}</b-badge></span
                ></b-list-group-item
            >
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
            this.partLists = this.$store.state.partLists.sort((a, b) => {
                if (a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1;
                } else {
                    return -1;
                }
            });
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
    },
};
</script>
