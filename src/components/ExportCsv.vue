<template>
    <div>
        <b-form-group label="Allgemein">
            <b-form-checkbox-group
                id="checkbox-group-1"
                v-model="selectedOptions"
                :options="options"
                name="general"
                stacked
            ></b-form-checkbox-group>
        </b-form-group>
        <b-form-group label="Farbe">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="selectedColorOptions"
                :options="optionsColor"
                name="color"
                stacked
            ></b-form-checkbox-group>
        </b-form-group>
        <b-form-group label="Pick a Brick">
            <b-form-checkbox-group
                id="checkbox-group-3"
                v-model="selectedPabOptions"
                :options="optionsPab"
                name="pickABrick"
                stacked
            ></b-form-checkbox-group>
        </b-form-group>
        <b-form-group label="Steine & Teile">
            <b-form-checkbox-group
                id="checkbox-group-4"
                v-model="selectedSapOptions"
                :options="optionsSap"
                name="stonesAndPieces"
                stacked
            ></b-form-checkbox-group>
        </b-form-group>

        <b-button variant="primary" @click="onDownload" :disabled="!wantedList || wantedList.length == 0">Download</b-button>

    </div>
</template>

<script>
export default {
    data() {
        return {
            wantedList: null,
            selectedOptions: [],
            selectedColorOptions: [],
            selectedPabOptions: [],
            selectedSapOptions: [],
            options: [
                { text: 'Id', value: 'bricklinkId' },
                { text: 'Anzahl Want', value: 'want' },
                { text: 'Anzahl Have', value: 'have' },
                { text: 'Anzahl Differenz', value: 'balance' },
                { text: 'LEGO Bezeichnung', value: 'legoDescription' },
                { text: 'BrickLink Max Price', value: 'blMaxPrice' }
            ],
            optionsColor: [
                { text: 'BrickLink Id', value: 'brickLinkId' },
                { text: 'BrickLink Name', value: 'brickLinkName' },
                { text: 'RGB Farbcode', value: 'colorCode' },
                { text: 'Lego Id', value: 'legoId' },
                { text: 'Lego Name', value: 'legoName' }
            ],
            optionsPab: [
                { text: 'Id', value: 'id' },
                { text: 'Designnummer', value: 'designNumber' },
                { text: 'Preis', value: 'price' },
                { text: 'Währung', value: 'currency' }
            ],
            optionsSap: [
                { text: 'Id', value: 'id' },
                { text: 'Designnummer', value: 'designNumber' },
                { text: 'Preis', value: 'price' },
                { text: 'Währung', value: 'currency' }
            ]            
        }
    },
    methods: {
        onDownload() {
            let csvContent = "data:text/csv;charset=utf-8,"

            csvContent += this.createHeaderLineToCSV()
            csvContent += '\n'

            this.wantedList.forEach(element => {
                var csvLine = ''

                // general options
                if(this.selectedOptions.includes('bricklinkId')){
                    console.log('bricklinkId', true)
                    csvLine = this.addToCSVLine(csvLine, element.itemid)
                }
                if(this.selectedOptions.includes('want')){
                    csvLine = this.addToCSVLine(csvLine, element.qty.min)
                }
                if(this.selectedOptions.includes('have')){
                    csvLine = this.addToCSVLine(csvLine, element.qty.have)
                }
                if(this.selectedOptions.includes('balance')){
                    csvLine = this.addToCSVLine(csvLine, element.qty.balance)
                }
                if(this.selectedOptions.includes('legoDescription')){
                    if(element.sat){
                        csvLine = this.addToCSVLine(csvLine, '"' + element.sat.description + '"')
                    }
                    else if (element.pab){
                        csvLine = this.addToCSVLine(csvLine, '"' + element.pab.name + '"')
                    }
                    else{
                        csvLine = this.addToCSVLine(csvLine, '')
                    }                    
                }
                if(this.selectedOptions.includes('blMaxPrice')){
                    csvLine = this.addToCSVLine(csvLine, element.maxprice)                   
                }

                // color options
                if(this.selectedColorOptions.includes('brickLinkId')){
                    csvLine = this.addToCSVLine(csvLine, element.color.brickLinkId)
                }
                if(this.selectedColorOptions.includes('brickLinkName')){
                    csvLine = this.addToCSVLine(csvLine, element.color.brickLinkName)
                }
                if(this.selectedColorOptions.includes('colorCode')){
                    csvLine = this.addToCSVLine(csvLine, element.color.colorCode.substr(1,6))
                }
                if(this.selectedColorOptions.includes('legoId')){
                    csvLine = this.addToCSVLine(csvLine, element.color.legoId)
                }
                if(this.selectedColorOptions.includes('legoName')){
                    csvLine = this.addToCSVLine(csvLine, element.color.legoName)
                }

                // Pick a Brick options
                if(this.selectedPabOptions.includes('id')){
                    if(element.pab && element.pab.variant.id){
                        csvLine = this.addToCSVLine(csvLine, element.pab.variant.id)
                    }
                    else{
                        csvLine = this.addToCSVLine(csvLine, '')
                    }
                }
                if(this.selectedPabOptions.includes('designNumber')){
                    if(element.pab && element.pab.variant.attributes.designNumber){
                        csvLine = this.addToCSVLine(csvLine, element.pab.variant.attributes.designNumber)
                    }
                    else{
                        csvLine = this.addToCSVLine(csvLine, '')
                    }
                }
                if(this.selectedPabOptions.includes('price')){
                    if(element.pab && element.pab.variant.price.centAmount){
                        csvLine = this.addToCSVLine(csvLine, element.pab.variant.price.centAmount / 100)
                    }
                    else{
                        csvLine = this.addToCSVLine(csvLine, '')
                    }
                }
                if(this.selectedPabOptions.includes('currency')){
                    if(element.pab && element.pab.variant.price.currencyCode){
                        csvLine = this.addToCSVLine(csvLine, element.pab.variant.price.currencyCode)
                    }
                    else{
                        csvLine = this.addToCSVLine(csvLine, '')
                    }
                }

                // Stones and Pieces options
                if(this.selectedSapOptions.includes('id')){
                    if(element.sat && element.sat.itemNumber){
                        csvLine = this.addToCSVLine(csvLine, element.sat.itemNumber)
                    }
                    else{
                        csvLine = this.addToCSVLine(csvLine, '')
                    }
                }
                if(this.selectedSapOptions.includes('designNumber')){
                    if(element.sat && element.sat.designId){
                        csvLine = this.addToCSVLine(csvLine, element.sat.designId)
                    }
                    else{
                        csvLine = this.addToCSVLine(csvLine, '')
                    }
                }
                if(this.selectedSapOptions.includes('price')){
                    if(element.sat && element.sat.price.amount){
                        csvLine = this.addToCSVLine(csvLine, element.sat.price.amount)
                    }
                    else{
                        csvLine = this.addToCSVLine(csvLine, '')
                    }
                }
                if(this.selectedSapOptions.includes('currency')){
                    if(element.sat && element.sat.price.currency){
                        csvLine = this.addToCSVLine(csvLine, element.sat.price.currency)
                    }
                    else{
                        csvLine = this.addToCSVLine(csvLine, '')
                    }
                }

                csvContent += csvLine
                csvContent += '\n'
            })

            const data = encodeURI(csvContent)
            const link = document.createElement("a")
            link.setAttribute("href", data)
            link.setAttribute("download", "BrickHunter.csv")
            link.click()
        },
        createHeaderLineToCSV(){
            var csvLine = ''

            // general options
            if(this.selectedOptions.includes('bricklinkId')){
                csvLine = this.addToCSVLine(csvLine, 'Id')
            }
            if(this.selectedOptions.includes('want')){
                csvLine = this.addToCSVLine(csvLine, 'Anzahl Want')
            }
            if(this.selectedOptions.includes('have')){
                csvLine = this.addToCSVLine(csvLine, 'Anzahl Have')
            }
            if(this.selectedOptions.includes('balance')){
                csvLine = this.addToCSVLine(csvLine, 'Anzahl Differenz')
            }
            if(this.selectedOptions.includes('legoDescription')){
                csvLine = this.addToCSVLine(csvLine, 'LEGO Bezeichnung')                   
            }
            if(this.selectedOptions.includes('blMaxPrice')){
                csvLine = this.addToCSVLine(csvLine, 'BrickLink Max Price')                   
            }            

            // color options
            if(this.selectedColorOptions.includes('brickLinkId')){
                csvLine = this.addToCSVLine(csvLine, 'BrickLink Farbe Id')
            }
            if(this.selectedColorOptions.includes('brickLinkName')){
                csvLine = this.addToCSVLine(csvLine, 'BrickLink Farb Name')
            }
            if(this.selectedColorOptions.includes('colorCode')){
                csvLine = this.addToCSVLine(csvLine, 'RGB Farbcode')
            }
            if(this.selectedColorOptions.includes('legoId')){
                csvLine = this.addToCSVLine(csvLine, 'LEGO Farb Id')
            }
            if(this.selectedColorOptions.includes('legoName')){
                csvLine = this.addToCSVLine(csvLine, 'LEGO Farb Name')
            }

            // Pick a Brick options
            if(this.selectedPabOptions.includes('id')){
                csvLine = this.addToCSVLine(csvLine, 'PaB Id')
            }
            if(this.selectedPabOptions.includes('designNumber')){
                csvLine = this.addToCSVLine(csvLine, 'PaB Designnummer')
            }
            if(this.selectedPabOptions.includes('price')){
                csvLine = this.addToCSVLine(csvLine, 'PaB Preis')
            }
            if(this.selectedPabOptions.includes('currency')){
                csvLine = this.addToCSVLine(csvLine, 'PaB Währung')
            }

            // Stones and Pieces options
            if(this.selectedSapOptions.includes('id')){
                csvLine = this.addToCSVLine(csvLine, 'SuT Id')
            }
            if(this.selectedSapOptions.includes('designNumber')){
                csvLine = this.addToCSVLine(csvLine, 'Sut Designnummer')
            }
            if(this.selectedSapOptions.includes('price')){
                csvLine = this.addToCSVLine(csvLine, 'Sut Preis')
            }
            if(this.selectedSapOptions.includes('currency')){
                csvLine = this.addToCSVLine(csvLine, 'Sut Währung')
            }
            return csvLine
        },
        addToCSVLine(line, value) {
            line += value
            line += ','
            return line
        }
    },
    watch:{
        selectedOptions: function(val, oldVal){
            localStorage.setItem('selectedOptions', val)
        },
        selectedColorOptions: function(val, oldVal){
            localStorage.setItem('selectedColorOptions', val)
        },
        selectedPabOptions: function(val, oldVal){
            localStorage.setItem('selectedPabOptions', val)
        },
        selectedSapOptions: function(val, oldVal){
            localStorage.setItem('selectedSapOptions', val)
        }
    },
    beforeMount() {
        this.wantedList = JSON.parse(localStorage.getItem('wantedList') || null)

        var selection = localStorage.getItem('selectedOptions') || 'bricklinkId,balance,legoDescription'
        this.selectedOptions = selection.split(',')

        selection = localStorage.getItem('selectedColorOptions') || 'brickLinkName'
        this.selectedColorOptions = selection.split(',')

        selection = localStorage.getItem('selectedPabOptions') || 'designNumber,price,currency'
        this.selectedPabOptions = selection.split(',')

        selection = localStorage.getItem('selectedSapOptions') || 'designNumber,price,currency'
        this.selectedSapOptions = selection.split(',')
    }
}
</script>