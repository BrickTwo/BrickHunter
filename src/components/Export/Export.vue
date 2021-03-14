<template>
    <div>
        <b-nav tabs>
            <b-nav-item
                :active="page == 'brickHunter'"
                @click="page = 'brickHunter'"
            >
                {{ labelBrickHunter }}
            </b-nav-item>
            <b-nav-item @click="page = 'brickLink'">{{
                labelBrickLink
            }}</b-nav-item>
            <b-nav-item :active="page == 'csv'" @click="page = 'csv'">
                {{ labelCsv }}
            </b-nav-item>
        </b-nav>
        <ExportBrickHunter
            v-if="page == 'brickHunter'"
            :partListId="$route.params.id"
        />
        <ExportWantedList
            v-if="page == 'brickLink'"
            :partListId="$route.params.id"
        />
        <ExportCsv v-if="page == 'csv'" :partListId="$route.params.id" />
    </div>
</template>

<script>
import ExportWantedList from './BrickLink';
import ExportCsv from './Csv';
import ExportBrickHunter from './BrickHunter';

export default {
    data: () => ({
        page: 'brickHunter',
    }),
    components: {
        ExportWantedList,
        ExportCsv,
        ExportBrickHunter,
    },
    computed: {
        labelBrickLink() {
            return browser.i18n.getMessage('brickLink');
        },
        labelCsv() {
            return browser.i18n.getMessage('menu_exportCsv');
        },
        labelBrickHunter() {
            return browser.i18n.getMessage('extName');
        },
    },
};
</script>
