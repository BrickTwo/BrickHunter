<template>
    <div>
        <b-form-checkbox
            id="exportPickaBrickPrices"
            v-model="exportPickaBrickPrices"
            @change="onChangedExportPickaBrickPrices"
            >
            Pick a Brick Preise verwenden
        </b-form-checkbox>
        <b-form-checkbox
            id="exportStonesAndPiecesPrices"
            v-model="exportStonesAndPiecesPrices"
            @change="onChangedExportStonesAndPiecesPrices"
            >
            Steine und Teile Preise verwenden
        </b-form-checkbox>
        <b-form-checkbox
            id="writeLegoIdInRemark"
            v-model="writeLegoIdInRemark"
            @change="onChangeWriteLegoIdInRemark"
            >
            LEGO Id in Remarks vermerken
        </b-form-checkbox>
        <b-form-checkbox
            id="writeSourceOfPriceInRemark"
            v-model="writeSourceOfPriceInRemark"
            @change="onChangeWriteSourceOfPriceInRemark"
            >
            Ursprung des Preises in Remarks vermerken
        </b-form-checkbox>

        <b-form-group label="Was soll bei gleichem Preis bevorzugt werden?" style="margin-top: 10px">
            <b-form-radio-group v-model="behaviourOnSamePrice" @change="onChangeBehaviourOnSamePrice" name="behaviourOnSamePrice">
                <b-form-radio value="pab" :disabled="!exportPickaBrickPrices">Pick a Brick</b-form-radio>
                <b-form-radio value="sap" :disabled="!exportStonesAndPiecesPrices">Steine und Teile</b-form-radio>
                <b-form-radio value="bl">BrickLink</b-form-radio>
            </b-form-radio-group>
        </b-form-group>

        <b-button variant="primary" @click="onDownload" :disabled="!wantedList || wantedList.length == 0">Download</b-button>
        <b-button variant="primary" @click="onCopy" :disabled="!wantedList || wantedList.length == 0" style="margin-left: 5px">Kopieren</b-button>

        <!-- <input type="text" value="" id="wantedList" style="position:absolute; top: 5000px"> -->
        <textarea id="wantedList" style="position:absolute; top: 5000px">
        </textarea>
    </div>
</template>

<script>
export default {
    data() {
        return {
            exportPickaBrickPrices: null,
            exportStonesAndPiecesPrices: null,
            writeLegoIdInRemark: null,
            writeSourceOfPriceInRemark: null,
            behaviourOnSamePrice: null,
            wantedList: null
        }
    },
    methods: {
        onChangedExportPickaBrickPrices(checked){
            if(!checked) {
                if(this.behaviourOnSamePrice == 'pab'){
                    if(this.exportStonesAndPiecesPrices) {
                        this.behaviourOnSamePrice = 'sap'
                    } else {
                        this.behaviourOnSamePrice = 'bl'
                    }
                }
            }
            localStorage.setItem("exportPickaBrickPrices", checked)
            localStorage.setItem("behaviourOnSamePrice", this.behaviourOnSamePrice)
        },
        onChangedExportStonesAndPiecesPrices(checked){
            if(!checked) {
                if(this.behaviourOnSamePrice == 'sap'){
                    if(this.exportPickaBrickPrices) {
                        this.behaviourOnSamePrice = 'pab'
                    } else {
                        this.behaviourOnSamePrice = 'bl'
                    }
                }
            }
            localStorage.setItem("exportStonesAndPiecesPrices", checked)
            localStorage.setItem("behaviourOnSamePrice", this.behaviourOnSamePrice)
        },
        onChangeWriteLegoIdInRemark(checked) {
            localStorage.setItem("writeLegoIdInRemark", checked)
        },
        onChangeWriteSourceOfPriceInRemark(checked) {
            localStorage.setItem("writeSourceOfPriceInRemark", checked)
        },
        onChangeBehaviourOnSamePrice(checked) {
            localStorage.setItem("behaviourOnSamePrice", checked)
        },
        onDownload() {
            let xmlContent = "data:text/xml;charset=utf-8,"
            xmlContent += this.creatXml()

            const data = encodeURI(xmlContent)
            const link = document.createElement("a")
            link.setAttribute("href", data)
            link.setAttribute("download", "WantedList.xml")
            link.click();
        },
        onCopy() {
            var copyText = document.getElementById("wantedList")
            copyText.value = this.creatXml(false)
            copyText.select()
            copyText.setSelectionRange(0, 99999)
            document.execCommand("copy")
        },
        creatXml(withHeader = true) {
            var xml2js = require('xml2js')

            var wantedList = this.createBrickLinkObject()

            var builder = new xml2js.Builder()
            var xml = builder.buildObject(wantedList)

            if(withHeader) return xml

            var startpos = xml.substr(xml).indexOf('>') + 2
            return xml.substr(startpos,xml.length)
        },
        createBrickLinkObject() {
            var wantedList = JSON.parse(localStorage.getItem("wantedList") || null)
            var brickLink = { INVENTORY: Array() }

            for(var i = 0; i < wantedList.length; i++ ){
                var sapPrice = 0;
                var pabPrice = 0;

                if (wantedList[i].sat && wantedList[i].sat.price && wantedList[i].sat.price.amount) sapPrice = wantedList[i].sat.price.amount
                if (wantedList[i].pab && wantedList[i].pab.variant && wantedList[i].pab.variant.price && wantedList[i].pab.variant.price.centAmount) pabPrice = wantedList[i].pab.variant.price.centAmount / 100
                var price = this.calculatePrice(pabPrice, sapPrice, wantedList[i].maxprice);

                var remarks = "";
                if(this.writeLegoIdInRemark && (price[0] === "pab" || price[0] === "sap")) {
                    remarks = "LEGO Id: "
                    if(price[0] === "pab") remarks += wantedList[i].pab.variant.attributes.designNumber
                    if(price[0] === "sap") remarks += wantedList[i].sat.designId
                }

                if(this.writeSourceOfPriceInRemark) {
                    if(this.writeLegoIdInRemark) remarks += "\n"
                    remarks += "Source: "
                    if(price[0] === "pab") remarks += "Pick a Brick"
                    if(price[0] === "sap") remarks += "Steine und Teile"
                    if(price[0] === "bl") remarks += "BrickLink"
                }

                var item = {
                    ITEM: {
                        ITEMTYPE: wantedList[i].itemtype,
                        ITEMID: wantedList[i].itemid,
                        COLOR: wantedList[i].color.brickLinkId,
                        MAXPRICE: price[1],
                        MINQTY: wantedList[i].minqty,
                        CONDITION: wantedList[i].condition,
                        NOTIFY: wantedList[i].notify,
                        REMARKS: remarks
                    }
                }

                brickLink.INVENTORY.push(item);
            }
            
            return brickLink;
        },
        calculatePrice(pabPrice, sapPrice, blPrice) {
            if (!pabPrice) pabPrice = 0
            if (!sapPrice) sapPrice = 0
            if (!blPrice) blPrice = 0

            var prices = Array()

            if(this.exportPickaBrickPrices && pabPrice > 0) prices.push(["pab", pabPrice])
            if(this.exportStonesAndPiecesPrices && sapPrice > 0) prices.push(["sap", sapPrice])
            if(blPrice > 0) prices.push(["bl", blPrice])

            if(prices.length == 0) return ["bl", '-1.0000']
            prices = prices.sort(function(a, b){return a[1]-b[1]})
            console.log(prices)
            return prices[0]
        }
    },
    beforeMount() {
        this.exportPickaBrickPrices = localStorage.getItem("exportPickaBrickPrices") || true
        this.exportStonesAndPiecesPrices = localStorage.getItem("exportStonesAndPiecesPrices") || true
        this.writeLegoIdInRemark = localStorage.getItem("writeLegoIdInRemark") || true
        this.writeSourceOfPriceInRemark = localStorage.getItem("writeSourceOfPriceInRemark") || true
        this.behaviourOnSamePrice = localStorage.getItem("behaviourOnSamePrice") || 'sap'
        this.wantedList = JSON.parse(localStorage.getItem("wantedList") || null)
    }
}
</script>