<template>
    <div>
        <b-form-group :label="generalGroupTitle">
            <b-form-checkbox-group
                id="checkbox-group-1"
                v-model="selectedOptions"
                :options="options"
                name="general"
                stacked
            ></b-form-checkbox-group>
        </b-form-group>
        <b-form-group :label="colorGroupTitle">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="selectedColorOptions"
                :options="optionsColor"
                name="color"
                stacked
            ></b-form-checkbox-group>
        </b-form-group>
        <b-form-group :label="pickABrickGroupTitle">
            <b-form-checkbox-group
                id="checkbox-group-3"
                v-model="selectedPabOptions"
                :options="optionsPab"
                name="pickABrick"
                stacked
            ></b-form-checkbox-group>
        </b-form-group>
        <b-form-group :label="bricksAndPiecesGroupTitle">
            <b-form-checkbox-group
                id="checkbox-group-4"
                v-model="selectedSapOptions"
                :options="optionsSap"
                name="stonesAndPieces"
                stacked
            ></b-form-checkbox-group>
        </b-form-group>

        <b-button
            variant="primary"
            @click="onDownload"
            :disabled="!wantedList || wantedList.length == 0"
            >{{ downloadButton }}</b-button
        >
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
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_generalOptionBrickLinkId'
                    ),
                    value: 'bricklinkId',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_generalOptionWant'
                    ),
                    value: 'want',
                },
                {
                    text: browser.i18n.getMessage('exportCsv_generalOptionAve'),
                    value: 'have',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_generalOptionBalance'
                    ),
                    value: 'balance',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_generalOptionLegoDescription'
                    ),
                    value: 'legoDescription',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_generalOptionBrickLinkMaxPrice'
                    ),
                    value: 'blMaxPrice',
                },
            ],
            optionsColor: [
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_colorOptionBrickLinkId'
                    ),
                    value: 'brickLinkId',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_colorOptionBrickLinkName'
                    ),
                    value: 'brickLinkName',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_colorOptionColorCode'
                    ),
                    value: 'colorCode',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_colorOptionLegoId'
                    ),
                    value: 'legoId',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_colorOptionLegoName'
                    ),
                    value: 'legoName',
                },
            ],
            optionsPab: [
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_pickABrickOptionId'
                    ),
                    value: 'id',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_pickABrickOptionDesignNumber'
                    ),
                    value: 'designNumber',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_pickABrickOptionPrice'
                    ),
                    value: 'price',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_pickABrickOptionCurrency'
                    ),
                    value: 'currency',
                },
            ],
            optionsSap: [
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_bricksAndPiecesOptionId'
                    ),
                    value: 'id',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_bricksAndPiecesOptionDesignNumber'
                    ),
                    value: 'designNumber',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_bricksAndPiecesOptionPrice'
                    ),
                    value: 'price',
                },
                {
                    text: browser.i18n.getMessage(
                        'exportCsv_bricksAndPiecesOptionCurrency'
                    ),
                    value: 'currency',
                },
            ],
        };
    },
    methods: {
        onDownload() {
            let csvContent = 'data:text/csv;charset=utf-8,';

            csvContent += this.createHeaderLineToCSV();
            csvContent += '\n';

            this.wantedList.forEach((element) => {
                var csvLine = '';

                // general options
                if (this.selectedOptions.includes('bricklinkId')) {
                    console.log('bricklinkId', true);
                    csvLine = this.addToCSVLine(csvLine, element.itemid);
                }
                if (this.selectedOptions.includes('want')) {
                    csvLine = this.addToCSVLine(csvLine, element.qty.min);
                }
                if (this.selectedOptions.includes('have')) {
                    csvLine = this.addToCSVLine(csvLine, element.qty.have);
                }
                if (this.selectedOptions.includes('balance')) {
                    csvLine = this.addToCSVLine(csvLine, element.qty.balance);
                }
                if (this.selectedOptions.includes('legoDescription')) {
                    if (element.sat) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            '"' + element.sat.description + '"'
                        );
                    } else if (element.pab) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            '"' + element.pab.name + '"'
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedOptions.includes('blMaxPrice')) {
                    csvLine = this.addToCSVLine(csvLine, element.maxprice);
                }

                // color options
                if (this.selectedColorOptions.includes('brickLinkId')) {
                    csvLine = this.addToCSVLine(
                        csvLine,
                        element.color.brickLinkId
                    );
                }
                if (this.selectedColorOptions.includes('brickLinkName')) {
                    csvLine = this.addToCSVLine(
                        csvLine,
                        element.color.brickLinkName
                    );
                }
                if (this.selectedColorOptions.includes('colorCode')) {
                    csvLine = this.addToCSVLine(
                        csvLine,
                        element.color.colorCode.substr(1, 6)
                    );
                }
                if (this.selectedColorOptions.includes('legoId')) {
                    csvLine = this.addToCSVLine(csvLine, element.color.legoId);
                }
                if (this.selectedColorOptions.includes('legoName')) {
                    csvLine = this.addToCSVLine(
                        csvLine,
                        element.color.legoName
                    );
                }

                // Pick a Brick options
                if (this.selectedPabOptions.includes('id')) {
                    if (element.pab && element.pab.variant.id) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.pab.variant.id
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedPabOptions.includes('designNumber')) {
                    if (
                        element.pab &&
                        element.pab.variant.attributes.designNumber
                    ) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.pab.variant.attributes.designNumber
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedPabOptions.includes('price')) {
                    if (element.pab && element.pab.variant.price.centAmount) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.pab.variant.price.centAmount / 100
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedPabOptions.includes('currency')) {
                    if (element.pab && element.pab.variant.price.currencyCode) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.pab.variant.price.currencyCode
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }

                // Bricks and Pieces options
                if (this.selectedSapOptions.includes('id')) {
                    if (element.sat && element.sat.itemNumber) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.sat.itemNumber
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedSapOptions.includes('designNumber')) {
                    if (element.sat && element.sat.designId) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.sat.designId
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedSapOptions.includes('price')) {
                    if (element.sat && element.sat.price.amount) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.sat.price.amount
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedSapOptions.includes('currency')) {
                    if (element.sat && element.sat.price.currency) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.sat.price.currency
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }

                csvContent += csvLine;
                csvContent += '\n';
            });

            const data = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', 'BrickHunter.csv');
            link.click();
        },
        createHeaderLineToCSV() {
            var csvLine = '';

            // general options
            if (this.selectedOptions.includes('bricklinkId')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage('exportCsv_csvHeaderBricklinkId')
                );
            }
            if (this.selectedOptions.includes('want')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage('exportCsv_csvHeaderGeneralWant')
                );
            }
            if (this.selectedOptions.includes('have')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage('exportCsv_csvHeaderGeneralHave')
                );
            }
            if (this.selectedOptions.includes('balance')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage('exportCsv_csvHeaderGeneralBalance')
                );
            }
            if (this.selectedOptions.includes('legoDescription')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderGeneralLegoDescription'
                    )
                );
            }
            if (this.selectedOptions.includes('blMaxPrice')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderGeneralBrickLinkMaxPrice'
                    )
                );
            }

            // color options
            if (this.selectedColorOptions.includes('brickLinkId')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderColorBrickLinkId'
                    )
                );
            }
            if (this.selectedColorOptions.includes('brickLinkName')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderColorBrickLinkName'
                    )
                );
            }
            if (this.selectedColorOptions.includes('colorCode')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage('exportCsv_csvHeaderColorColorCode')
                );
            }
            if (this.selectedColorOptions.includes('legoId')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage('exportCsv_csvHeaderColorLegoId')
                );
            }
            if (this.selectedColorOptions.includes('legoName')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage('exportCsv_csvHeaderColorLegoName')
                );
            }

            // Pick a Brick options
            if (this.selectedPabOptions.includes('id')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage('exportCsv_csvHeaderPickABrickId')
                );
            }
            if (this.selectedPabOptions.includes('designNumber')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderPickABrickDesignNumber'
                    )
                );
            }
            if (this.selectedPabOptions.includes('price')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderPickABrickPrice'
                    )
                );
            }
            if (this.selectedPabOptions.includes('currency')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderPickABrickCurrency'
                    )
                );
            }

            // Bricks and Pieces options
            if (this.selectedSapOptions.includes('id')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderBricksAndPiecesId'
                    )
                );
            }
            if (this.selectedSapOptions.includes('designNumber')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderBricksAndPiecesDesignNumber'
                    )
                );
            }
            if (this.selectedSapOptions.includes('price')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderBricksAndPiecesPrice'
                    )
                );
            }
            if (this.selectedSapOptions.includes('currency')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderBricksAndPiecesCurrency'
                    )
                );
            }
            return csvLine;
        },
        addToCSVLine(line, value) {
            line += value;
            line += ',';
            return line;
        },
    },
    watch: {
        selectedOptions: function(val, oldVal) {
            localStorage.setItem('selectedOptions', val);
        },
        selectedColorOptions: function(val, oldVal) {
            localStorage.setItem('selectedColorOptions', val);
        },
        selectedPabOptions: function(val, oldVal) {
            localStorage.setItem('selectedPabOptions', val);
        },
        selectedSapOptions: function(val, oldVal) {
            localStorage.setItem('selectedSapOptions', val);
        },
    },
    beforeMount() {
        this.wantedList = JSON.parse(
            localStorage.getItem('wantedList') || null
        );

        var selection =
            localStorage.getItem('selectedOptions') ||
            'bricklinkId,balance,legoDescription';
        this.selectedOptions = selection.split(',');

        selection =
            localStorage.getItem('selectedColorOptions') || 'brickLinkName';
        this.selectedColorOptions = selection.split(',');

        selection =
            localStorage.getItem('selectedPabOptions') ||
            'designNumber,price,currency';
        this.selectedPabOptions = selection.split(',');

        selection =
            localStorage.getItem('selectedSapOptions') ||
            'designNumber,price,currency';
        this.selectedSapOptions = selection.split(',');
    },
    computed: {
        generalGroupTitle() {
            return browser.i18n.getMessage('exportCsv_generalGroupTitle');
        },
        colorGroupTitle() {
            return browser.i18n.getMessage('exportCsv_colorGroupTitle');
        },
        pickABrickGroupTitle() {
            return browser.i18n.getMessage('exportCsv_pickABrickGroupTitle');
        },
        bricksAndPiecesGroupTitle() {
            return browser.i18n.getMessage(
                'exportCsv_bricksAndPiecesGroupTitle'
            );
        },
        downloadButton() {
            return browser.i18n.getMessage('exportCsv_downloadButton');
        },
    },
};
</script>
