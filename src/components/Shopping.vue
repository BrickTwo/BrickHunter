<template>
    <div>
        <b-form-checkbox
            id="usePickaBrick"
            v-model="usePickaBrick"
            >
            Pick a Brick verwenden
        </b-form-checkbox>
        <b-form-checkbox
            id="useStonesAndPieces"
            v-model="useStonesAndPieces"
            >
            Steine und Teile verwenden
        </b-form-checkbox>

        <b-form-group label="Was soll bei gleichem Preis bevorzugt werden?" style="margin-top: 10px">
            <b-form-radio-group v-model="behaviourOnSamePrice" name="behaviourOnSamePrice">
                <b-form-radio value="pab" :disabled="!usePickaBrick">Pick a Brick</b-form-radio>
                <b-form-radio value="sap" :disabled="!useStonesAndPieces">Steine und Teile</b-form-radio>
                <b-form-radio value="bl">BrickLink</b-form-radio>
            </b-form-radio-group>
        </b-form-group>

        <b-form-checkbox
            id="useHave"
            v-model="useHave"
            >
            Vorhandene Steine berücksichtigen
        </b-form-checkbox>


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
                <b-button variant="primary" @click="printSap" style="margin-left: 10px; vertical-align: bottom;" :disabled="!sapList || sapList.length == 0 || !useStonesAndPieces">
                    <b-icon icon="printer" aria-hidden="true"></b-icon>
                </b-button>
                <b-button variant="primary" @click="showInfo" style="margin-left: 10px; vertical-align: bottom;">
                    <b-icon icon="info-circle" aria-hidden="true"></b-icon>
                </b-button>
                <b-tooltip target="btn-sap-add-to-card" variant="danger">Zuvor ausgewählte Steine &amp; Teile werden aus dem Warenkorb entfernt!</b-tooltip>
            </p>
            <div id="sapList">
                <brick-list :bricklist="sapList" :limitMaxQty="200"></brick-list>
            </div>
        </div>
        <div v-if="page=='pab'">
            <p style="margin-top: 5px; margin-bottom: 5px;">
                <b-button id="btn-pab-add-to-card" variant="primary" @click="pabFillCart" :disabled="!pabList || pabList.length == 0 || !usePickaBrick">Pick a Brick füllen</b-button>
                <b-button variant="danger" @click="pabClearCart" :disabled="!pabList || pabList.length == 0 || !usePickaBrick" style="margin-left: 10px;">Pick a Brick Warenkorb leeren</b-button>
                <b-button variant="primary" @click="printPab" style="margin-left: 10px; vertical-align: bottom;" :disabled="!pabList || pabList.length == 0 || !usePickaBrick">
                    <b-icon icon="printer" aria-hidden="true"></b-icon>
                </b-button>
                <b-button variant="primary" @click="showInfo" style="margin-left: 10px; vertical-align: bottom;">
                    <b-icon icon="info-circle" aria-hidden="true"></b-icon>
                </b-button>
                <span>
                    <b-progress :value="loadPAPPercentage" :max="100" show-progress animated v-if="loadPAPPercentage < 100" style="margin-top: 10px"></b-progress>
                </span>
            </p>
            <div id="pabList">
                <brick-list :bricklist="pabList" :limitMaxQty="999"></brick-list>
            </div>
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
            useHave: null,
            wantedList: null,
            sapList: null,
            pabList: null,
            satPositions: 0,
            pabPositions: 0,
            satPrice: 0,
            pabPrice: 0,
            currency: null,
            page: 'overview',
            pabShoppingCartId: null,
            authorization: null,
            loadPAPPercentage: 100
        }
    },
    components: {
        BrickList
    },
    methods: {
        showInfo() {
            console.log("changePage")
            this.$emit('changePage', 'info')
        },
        pabClearCart(){            
            browser.runtime.sendMessage({contentScriptQuery: "PickABrickClearCart", authorization: this.authorization, PABCartId: this.pabShoppingCartId})
            .then(response => {
                //console.log("PickABrickClearCart", response);
                browser.tabs.query({'currentWindow': true, 'active': true})
                .then(tabs => {
                    var tab = tabs[0]
                    //var countrySelected = localStorage.getItem("country") || null
                    browser.tabs.update(tab.id, {url: `https://www.lego.com/page/static/pick-a-brick`})
                })
            })
            .catch(() => {
                
            })
        },
        async pabFillCart() {
            var percentageSingle = 100/this.pabList.length
            this.loadPAPPercentage = 0
            for(var i = 0; i < this.pabList.length; i++) {
                this.loadPAPPercentage += percentageSingle
                //console.log(this.pabList[i])
                await this.pabAddToCart(this.pabList[i])
            }
            this.loadPAPPercentage = 100
            browser.tabs.query({'currentWindow': true, 'active': true})
            .then(tabs => {
                var tab = tabs[0]
                //var countrySelected = localStorage.getItem("country") || null
                browser.tabs.update(tab.id, {url: `https://www.lego.com/page/static/pick-a-brick`})
            })
        },
        async pabAddToCart(item) {
            if(item.pab){
                var qty = item.qty.order
                if(qty > 999) qty = 999 // it's not possible to order more than 999 pieces per brick

                var partId = item.pab.variant.id
                
                var response = await browser.runtime.sendMessage({contentScriptQuery: "PickABrickAddToCart", authorization: this.authorization, PABCartId: this.pabShoppingCartId, qty: qty, partId: partId})
            }
        },
        sapFillCart(){
            var order = []
            //console.log("saplist", this.sapList)
            for(var i = 0; i < this.sapList.length; i++) {
                if(this.sapList[i].sat){
                    var qty = this.sapList[i].qty.order
                    if(qty > 200) qty = 200 // it's not possible to order more than 200 pieces per brick

                    var pos = {
                        id: this.sapList[i].sat.itemNumber,
                        product: this.sapList[i].sat,
                        quantity: parseInt(qty)
                    }

                    pos.product.description = pos.product.description.replace(/[\""]/g, '\\"')  // escape quotes in description
                    //console.log(pos.product.description)
                    order.push(pos)
                }
            }

            browser.runtime.sendMessage({contentScriptQuery: "sapFillCart", order: order})
            .then(response => {
                
                //console.log(response)
                this.$bvToast.toast(`Warenkorb erfolgreich befüllt`, {
                    title: 'Steine & Teile',
                    autoHideDelay: 5000,
                    variant: 'success'
                })
                
            })
        },
        sapClearCart(){
            browser.runtime.sendMessage({contentScriptQuery: "sapClearCart"})
            .then(response => {
                //console.log(response)
                this.$bvToast.toast(`Warenkorb erfolgreich geleert`, {
                    title: 'Steine & Teile',
                    autoHideDelay: 5000,
                    variant: 'success'
                })
            })            
        },
        calcTotalPrice() {
            this.satPositions = 0
            this.pabPositions = 0
            this.satPrice = 0
            this.pabPrice = 0
            this.sapList = []
            this.pabList = []

            if(this.wantedList){
                this.wantedList.forEach(element => {
                if(this.useHave){
                    element.qty.order = element.qty.balance
                }
                else {
                    element.qty.order = element.qty.min
                }
                if(element.qty.order > 0){
                    
                    var sapPrice = 0;
                    var pabPrice = 0;

                    if (element.sat && element.sat.price && element.sat.price.amount) sapPrice = element.sat.price.amount
                    if (element.pab && element.pab.variant && element.pab.variant.price && element.pab.variant.price.centAmount) pabPrice = element.pab.variant.price.centAmount / 100
                    var price = this.getPrice(pabPrice, sapPrice, element.maxprice)

                    if(price[1]) {
                        if(price[0] == 'sap'){
                            this.satPositions++
                            this.satPrice += element.minqty * price[1]
                            this.currency = element.sat.price.currency
                            this.fillSapList(element)
                        } 
                        if(price[0] == 'pab'){
                            this.pabPositions++
                            this.pabPrice += element.minqty * price[1]
                            this.currency = element.pab.variant.price.currencyCode
                            this.fillPabList(element)
                        } 
                    }
                }
            })
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
        },
        printSap(){
            console.log("print")
            this.$htmlToPaper('sapList')
        },
        printPab(){
            console.log("print")
            this.$htmlToPaper('pabList')
        }
    },
    watch:{
        usePickaBrick: function(val, oldVal){
            if(!val) {
                if(this.behaviourOnSamePrice == 'pab'){
                    if(this.useStonesAndPieces) {
                        this.behaviourOnSamePrice = 'sap'
                    } else {
                        this.behaviourOnSamePrice = 'bl'
                    }
                }
            }
            localStorage.setItem("usePickaBrick", val)
            localStorage.setItem("behaviourOnSamePriceShopping", this.behaviourOnSamePrice)
            this.calcTotalPrice()
        },
        useStonesAndPieces: function(val, oldVal){
            if(!val) {
                if(this.behaviourOnSamePrice == 'sap'){
                    if(this.usePickaBrick) {
                        this.behaviourOnSamePrice = 'pab'
                    } else {
                        this.behaviourOnSamePrice = 'bl'
                    }
                }
            }
            localStorage.setItem("useStonesAndPieces", val)
            localStorage.setItem("behaviourOnSamePriceShopping", this.behaviourOnSamePrice)
            this.calcTotalPrice()
        },
        behaviourOnSamePrice: function(val, oldVal){
            localStorage.setItem("behaviourOnSamePriceShopping", val)
            this.calcTotalPrice()
        },
        useHave: function(val, oldVal){
            localStorage.setItem('useHave', val)
            this.calcTotalPrice()
        }
    },    
    beforeMount() {
        this.usePickaBrick = ((localStorage.getItem("usePickaBrick") || 'true') === 'true')
        this.useStonesAndPieces = ((localStorage.getItem("useStonesAndPieces") || 'true') === 'true')
        this.behaviourOnSamePrice = localStorage.getItem("behaviourOnSamePriceShopping") || 'sap'
        this.useHave = ((localStorage.getItem("useHave") || 'true') === 'true')
        this.wantedList = JSON.parse(localStorage.getItem("wantedList") || null)

        this.calcTotalPrice()

        browser.runtime.sendMessage({contentScriptQuery: "readQAuth"})
        .then(response => {
            this.authorization = response;
            //console.log("authorization", this.authorization);
            browser.runtime.sendMessage({contentScriptQuery: "PickABrickReadCart", authorization: this.authorization})
            .then(response => {
                //console.log("PickABrickReadCart", response);
                this.pabShoppingCartId = response.id;
                //console.log("PickABrickReadCartId", this.pabShoppingCartId);
            })
            .catch(() => {
                
            })
        })
        .catch(() => {
            
        })
    }
}
</script>