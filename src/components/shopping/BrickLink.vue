<template>
    <b-container class="bv-example-row" fluid="xl">
        <b-row>
            <b-col>
                <b-button
                    class="button"
                    variant="primary"
                    @click="onDownload"
                    :disabled="!brickList || brickList.length == 0"
                >
                    {{ buttonBrickLinkDownload }}
                </b-button>
                <b-button
                    class="button"
                    variant="primary"
                    @click="onCopy"
                    :disabled="!brickList || brickList.length == 0"
                >
                    {{ buttonBrickLinkCopy }}
                </b-button>
                <b-button
                    class="button"
                    variant="primary"
                    @click="printBrickLink"
                    :disabled="!brickList || brickList.length == 0"
                >
                    <b-icon icon="printer" aria-hidden="true" />
                </b-button>
                <b-button class="button" variant="primary" @click="showInfo">
                    <b-icon icon="info-circle" aria-hidden="true" />
                </b-button>
                <img
                    alt=""
                    border="0"
                    src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
                    @click="donate()"
                    style="cursor: pointer"
                />
                <textarea id="tempFieldForCopy" />
            </b-col>
        </b-row>
        <b-row>
            <b-col id="brickLinkList">
                <brick-list :bricklist="brickList" />
            </b-col>
        </b-row>
    </b-container>
</template>

<style scoped>
#tempFieldForCopy {
    position: absolute;
    top: -500px;
    height: 0;
    width: 0;
    z-index: -5;
}
</style>

<script>
import BrickList from '../BrickList';
export default {
    data() {
        return {
            brickList: null,
        };
    },
    components: {
        BrickList,
    },
    methods: {
        showInfo() {
            //console.log('changePage');
            this.$router.push('/info').catch(() => {});
        },
        onDownload() {
            let xmlContent = 'data:text/xml;charset=utf-8,';
            xmlContent += this.creatXml();

            const data = encodeURI(xmlContent);
            const link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', 'WantedList.xml');
            link.click();
        },
        onCopy() {
            var copyText = document.getElementById('tempFieldForCopy');
            copyText.value = this.creatXml(false);
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand('copy');
        },
        creatXml(withHeader = true) {
            var xml2js = require('xml2js');

            var wantedList = this.createBrickLinkObject();

            var builder = new xml2js.Builder();
            var xml = builder.buildObject(wantedList);

            if (withHeader) return xml;

            var startpos = xml.substr(xml).indexOf('>') + 2;
            return xml.substr(startpos, xml.length);
        },
        createBrickLinkObject() {
            if (!this.brickList) return;

            var brickLink = { INVENTORY: Array() };

            for (var i = 0; i < this.brickList.length; i++) {
                var bricksAndPiecesPrice = 0;
                var pickABrickPrice = 0;

                var have = parseInt();

                var item = {
                    ITEM: {
                        ITEMTYPE: this.brickList[i].brickLink?.wantedList?.itemtype,
                        ITEMID: this.brickList[i].itemid,
                        COLOR: this.brickList[i].color.brickLinkId,
                        MAXPRICE: this.brickList[i].brickLink?.wantedList?.maxprice,
                        MINQTY: this.brickList[i].qty.min,
                        QTYFILLED: this.brickList[i].qty.have,
                        CONDITION: this.brickList[i].brickLink?.wantedList?.condition,
                        NOTIFY: this.brickList[i].brickLink?.wantedList?.notify,
                    },
                };

                brickLink.INVENTORY.push(item);
            }

            return brickLink;
        },
        printBrickLink() {
            //console.log('print');
            this.$htmlToPaper('brickLinkList');
        },
        donate() {
            browser.runtime.sendMessage({
                contentScriptQuery: 'donate',
            });
        },
    },
    beforeMount() {
        this.brickList = this.$store.state.shopping.brickLinkList;
    },
    computed: {
        buttonBrickLinkDownload() {
            return browser.i18n.getMessage('shopping_buttonBrickLinkDownload');
        },
        buttonBrickLinkCopy() {
            return browser.i18n.getMessage('shopping_buttonBrickLinkCopy');
        },
    },
};
</script>
