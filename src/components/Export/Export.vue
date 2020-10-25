<template>
    <div>
        <b-nav tabs>
            <b-nav-item
                :active="page == 'brickLink'"
                @click="page = 'brickLink'"
                >{{ brickLink }}</b-nav-item
            >
            <b-nav-item :active="page == 'csv'" @click="page = 'csv'" >{{
                menuExportCsv
            }}</b-nav-item>
        </b-nav>
            <ExportWantedList v-if="page == 'brickLink'" :partListId="$route.params.id"/>
            <ExportCsv v-if="page == 'csv'" :partListId="$route.params.id"/>
    </div>
</template>

<script>
import ExportWantedList from '@/components/Export/BrickLink.vue';
import ExportCsv from '@/components/Export/Csv.vue';

export default {
    data: () => ({
        page: 'brickLink',
    }),
    components: {
        ExportWantedList,
        ExportCsv,
    },
    computed: {
        brickLink() {
            return browser.i18n.getMessage('brickLink');
        },
        menuExportCsv() {
            return browser.i18n.getMessage('menu_exportCsv');
        },
    },
};
</script>
