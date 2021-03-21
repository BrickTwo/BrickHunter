<template>
    <div>
        <b-alert show v-if="newVersionAvailable" variant="warning" dismissible>
            {{ labelVersionAvailableBefore }} {{ newVersionAvailable }}
            {{ labelNewVersionAvailableAfter }}
        </b-alert>
        <b-modal
            id="notificationMessage"
            :title="labelNotificationHeader"
            :header-bg-variant="headerBgVariant"
            :header-text-variant="headerTextVariant"
            centered
            hide-footer
        >
            <p class="my-4" v-html="notification" />
        </b-modal>
    </div>
</template>

<script>
import apiBrickTwo from '@/utility/api/bricktwo.js';

export default {
    data() {
        return {
            newVersionAvailable: null,
            headerBgVariant: 'dark',
            headerTextVariant: 'light',
            notification: null,
        };
    },
    methods: {
        async cloudSync() {
            var checkDate = new Date(this.$store.state.syncDate);
            checkDate.setHours(checkDate.getHours() + 1);
            if (checkDate < new Date(Date.now())) {
                var cloudData = await apiBrickTwo.getSyncAsync();
                this.$store.commit('setSyncDate', new Date(Date.now()));

                if (cloudData.version) {
                    var currentVersion = this.$store.state.version.current
                        .split('.')
                        .map(Number);
                    var cloudVersion = cloudData.version.split('.').map(Number);

                    if (
                        currentVersion[0] <= cloudVersion[0] &&
                        currentVersion[1] <= cloudVersion[1] &&
                        currentVersion[2] < cloudVersion[2]
                    ) {
                        this.newVersionAvailable = cloudData.version;
                    }
                }

                if (cloudData.notification) {
                    var language = await browser.i18n.getUILanguage();
                    if (language.startsWith('de')) {
                        this.notification = cloudData.notification.messageDe;
                    } else {
                        this.notification = cloudData.notification.messageEn;
                    }

                    this.$bvModal.show('notificationMessage');
                }
            }
        },
    },
    beforeMount() {
        this.cloudSync();
    },
    computed: {
        labelNotificationHeader() {
            return browser.i18n.getMessage('notification_header');
        },
        labelVersionAvailableBefore() {
            return browser.i18n.getMessage('newVersionAvailableBefore');
        },
        labelNewVersionAvailableAfter() {
            return browser.i18n.getMessage('newVersionAvailableAfter');
        },
    },
};
</script>
