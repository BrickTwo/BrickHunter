<template>
    <div>
        <b-form-checkbox
            id="usePickaBrick"
            v-model="usePickaBrick"
            @change="onChangedUsePickaBrick"
            >
            Pick a Brick verwenden
        </b-form-checkbox>
        <b-form-checkbox
            id="useStonesAndPieces"
            v-model="useStonesAndPieces"
            @change="onChangedUseStonesAndPieces"
            >
            Steine und Teile verwenden
        </b-form-checkbox>

        <b-form-group label="Was soll bei gleichem Preis bevorzugt werden?" style="margin-top: 10px">
            <b-form-radio-group v-model="behaviourOnSamePrice" @change="onChangeBehaviourOnSamePrice" name="behaviourOnSamePrice">
                <b-form-radio value="pab" :disabled="!usePickaBrick">Pick a Brick</b-form-radio>
                <b-form-radio value="sap" :disabled="!useStonesAndPieces">Steine und Teile</b-form-radio>
                <b-form-radio value="bl">BrickLink</b-form-radio>
            </b-form-radio-group>
        </b-form-group>


        <b-nav tabs>
            <b-nav-item :active="page=='overview'" @click="page='overview'">Übersicht</b-nav-item>
            <b-nav-item :active="page=='sap'" @click="page='sap'">Steine & Teile</b-nav-item>
            <b-nav-item :active="page=='pab'" @click="page='pab'">Pick a Brick</b-nav-item>
        </b-nav>
        
        <div v-if="page=='overview'">
            <h2>Anzahl Positionen</h2>
            Wanted List: {{wantedList.length}}<br />
            Pick a Brick: {{pabPositions}}<br />
            Steine und Teile: {{satPositions}}<br />        
            Total bei LEGO: {{satPositions + pabPositions}}

            <h2>Preis</h2>
            Pick a Brick: {{currency}} {{pabPrice}}<br />
            Steine und Teile: {{currency}} {{satPrice}}<br />
            Total: {{currency}} {{Math.round((satPrice + pabPrice)*100)/100}}
        </div>
        <div v-if="page=='sap'">
            <p style="margin-top: 5px; margin-bottom: 5px;">
                <b-button id="btn-sap-add-to-card" variant="primary" @click="sapFillCart" :disabled="!sapList || sapList.length == 0 || !useStonesAndPieces">Steine & Teile Warenkorb füllen</b-button>
                <b-button variant="danger" @click="sapClearCart" :disabled="!sapList || sapList.length == 0 || !useStonesAndPieces" style="margin-left: 10px;">Steine & Teile Warenkorb leeren</b-button>
                <b-tooltip target="btn-sap-add-to-card" variant="danger">Zuvor ausgewählte Steine &amp; Teile werden aus dem Warenkorb entfernt!</b-tooltip>
            </p>
            <brick-list :bricklist="sapList" :limitMaxQty="true"></brick-list>
        </div>
        <div v-if="page=='pab'">
            <brick-list :bricklist="pabList"></brick-list>
        </div>
    </div>
</template>

<script>

import BrickList from "./BrickList"
export default {
    data() {
        return {
            usePickaBrick: null,
            useStonesAndPieces: null,
            behaviourOnSamePrice: null,
            wantedList: null,
            sapList: null,
            pabList: null,
            satPositions: 0,
            pabPositions: 0,
            satPrice: 0,
            pabPrice: 0,
            currency: null,
            page: 'overview'
        }
    },
    components: {
        BrickList
    },
    methods: {
        sapFillCart(){
            var order = []

            for(var i = 0; i < this.wantedList.length; i++) {
                if(this.wantedList[i].sat){
                    var qty = this.wantedList[i].minqty
                    if(qty > 200) qty = 200 // it's not possible to order more than 200 pieces per brick

                    var pos = {
                        id: this.wantedList[i].sat.designId,
                        product: this.wantedList[i].sat,
                        quantity: parseInt(qty)
                    }

                    pos.product.description = pos.product.description.replace(/[\""]/g, '\\"')  // escape quotes in description
                    //console.log(pos.product.description)
                    order.push(pos)
                }
            }

            browser.runtime.sendMessage({contentScriptQuery: "sapFillCart", order: order})
            .then(response => {
                
                console.log(response)
                this.$bvToast.toast(`Warenkorb erfolgreich befüllt`, {
                    title: 'Steine & Teile',
                    autoHideDelay: 5000,
                    variant: 'success'
                })
                
            })

            //browser.runtime.sendMessage("placeOrder")

            /*browser.tabs.query({'currentWindow': true, 'active': true})
            .then(tabs => {
                var tab = tabs[0]
                browser.tabs.update(tab.id, {url: 'https://www.lego.com/de-ch/service/replacementparts/sale'})
            }).then(() => {
                browser.runtime.sendMessage("selectCountry")
            })*/
            
        },
        sapClearCart(){
            browser.runtime.sendMessage({contentScriptQuery: "sapFillCart", order: ""})
            .then(response => {
                
                console.log(response)
                this.$bvToast.toast(`Warenkorb erfolgreich geleert`, {
                    title: 'Steine & Teile',
                    autoHideDelay: 5000,
                    variant: 'success'
                })
                
            })

            //browser.runtime.sendMessage("placeOrder")

            /*browser.tabs.query({'currentWindow': true, 'active': true})
            .then(tabs => {
                var tab = tabs[0]
                browser.tabs.update(tab.id, {url: 'https://www.lego.com/de-ch/service/replacementparts/sale'})
            }).then(() => {
                browser.runtime.sendMessage("selectCountry")
            })*/
            
        },
        onChangedUsePickaBrick(checked){
            this.usePickaBrick = checked
            if(!checked) {
                if(this.behaviourOnSamePrice == 'pab'){
                    if(this.useStonesAndPieces) {
                        this.behaviourOnSamePrice = 'sap'
                    } else {
                        this.behaviourOnSamePrice = 'bl'
                    }
                }
            }
            localStorage.setItem("usePickaBrick", checked)
            localStorage.setItem("behaviourOnSamePriceShopping", this.behaviourOnSamePrice)
            this.calcTotalPrice()
        },
        onChangedUseStonesAndPieces(checked){
            this.useStonesAndPieces = checked
            if(!checked) {
                if(this.behaviourOnSamePrice == 'sap'){
                    if(this.usePickaBrick) {
                        this.behaviourOnSamePrice = 'pab'
                    } else {
                        this.behaviourOnSamePrice = 'bl'
                    }
                }
            }
            localStorage.setItem("useStonesAndPieces", checked)
            localStorage.setItem("behaviourOnSamePriceShopping", this.behaviourOnSamePrice)
            this.calcTotalPrice()
        },
        onChangeBehaviourOnSamePrice(checked) {
            this.behaviourOnSamePrice = checked
            localStorage.setItem("behaviourOnSamePriceShopping", checked)
            this.calcTotalPrice()
        },
        /*calculatePrice(pabPrice, sapPrice, blPrice) {
            if (!pabPrice) pabPrice = 0;
            if (!sapPrice) sapPrice = 0
            if (!blPrice) blPrice = 0

            var prices = Array()

            if(this.usePickaBrick && pabPrice > 0) prices.push(["pab", pabPrice])
            if(this.useStonesAndPieces && sapPrice > 0) prices.push(["sap", sapPrice])
            if(blPrice > 0) prices.push(["bl", blPrice])

            if(prices.length == 0) return ["bl", '-1.0000']
            prices = prices.sort(function(a, b){return a[1]-b[1]})
            
            return prices[0]
        },*/
        calcTotalPrice() {
            this.satPositions = 0
            this.pabPositions = 0
            this.satPrice = 0
            this.pabPrice = 0
            this.sapList = []
            this.pabList = []

            for(var i = 0; i < this.wantedList.length; i++) {
                var sapPrice = 0;
                var pabPrice = 0;

                if (this.wantedList[i].sat && this.wantedList[i].sat.price && this.wantedList[i].sat.price.amount) sapPrice = this.wantedList[i].sat.price.amount
                if (this.wantedList[i].pab && this.wantedList[i].pab.variant && this.wantedList[i].pab.variant.price && this.wantedList[i].pab.variant.price.centAmount) pabPrice = this.wantedList[i].pab.variant.price.centAmount / 100
                var price = this.getPrice(pabPrice, sapPrice, this.wantedList[i].maxprice)

                if(price[1]) {
                    if(price[0] == 'sap'){
                        this.satPositions++
                        this.satPrice += this.wantedList[i].minqty * price[1]
                        this.currency = this.wantedList[i].sat.price.currency
                        this.fillSapList(this.wantedList[i])
                    } 
                    if(price[0] == 'pab'){
                        this.pabPositions++
                        this.pabPrice += this.wantedList[i].minqty * price[1]
                        this.currency = this.wantedList[i].pab.variant.price.currencyCode
                        this.fillPabList(this.wantedList[i])
                    } 
                }
            }

            this.satPrice = Math.round(this.satPrice * 100) / 100
            this.pabPrice = Math.round(this.pabPrice * 100) / 100
        },
        getPrice(pabPrice, sapPrice, blPrice) {
            if (!pabPrice) pabPrice = 0
            if (!sapPrice) sapPrice = 0

            var prices = Array()

            if(pabPrice == sapPrice && pabPrice > 0) {
                if(this.behaviourOnSamePrice == 'sap') {
                    prices.push(['sap', sapPrice])
                } else {
                    prices.push(['pab', pabPrice])
                }
            } else {
                if(this.usePickaBrick && pabPrice > 0) prices.push(['pab', pabPrice])
                if(this.useStonesAndPieces && sapPrice > 0) prices.push(['sap', sapPrice])
            }

            if(prices.length == 0) return 0
            prices = prices.sort(function(a, b){return a[1]-b[1]})

            if(this.behaviourOnSamePrice == 'bl' && prices[0] == blPrice) return ['bl', 0]

            return prices[0]
        },
        fillSapList(pos){
            this.sapList.push(pos)
        },
        fillPabList(pos){
            this.pabList.push(pos)
        }
    },
    beforeMount() {
        this.usePickaBrick = ((localStorage.getItem("usePickaBrick") || 'true') === 'true')
        this.useStonesAndPieces = ((localStorage.getItem("useStonesAndPieces") || 'true') === 'true')
        this.behaviourOnSamePrice = localStorage.getItem("behaviourOnSamePriceShopping") || 'sap'
        this.wantedList = JSON.parse(localStorage.getItem("wantedList") || null)

        this.calcTotalPrice()
    }
}
</script>