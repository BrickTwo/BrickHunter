<template>
    <b-container class="bv-example-row" fluid="xl">
        <b-row>
            <b-col>
                <b-button
                    variant="primary"
                    @click="onDownload"
                    :disabled="!wantedList || wantedList.length == 0"
                    >{{ downloadButton }}</b-button
                >
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group :label="generalGroupTitle" label-for="checkbox-group-1" label-class="label">
                    <b-form-checkbox-group
                        id="checkbox-group-1"
                        v-model="selectedOptions"
                        :options="options"
                        name="general"
                        stacked
                    ></b-form-checkbox-group>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group :label="colorGroupTitle" label-for="checkbox-group-2" label-class="label">
                    <b-form-checkbox-group
                        id="checkbox-group-2"
                        v-model="selectedColorOptions"
                        :options="optionsColor"
                        name="color"
                        stacked
                    ></b-form-checkbox-group>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group :label="pickABrickGroupTitle" label-for="checkbox-group-3" label-class="label">
                    <b-form-checkbox-group
                        id="checkbox-group-3"
                        v-model="selectedPickABrickOptions"
                        :options="optionsPickABrick"
                        name="pickABrick"
                        stacked
                    ></b-form-checkbox-group>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group :label="bricksAndPiecesGroupTitle" label-for="checkbox-group-4" label-class="label">
                    <b-form-checkbox-group
                        id="checkbox-group-4"
                        v-model="selectedBricksAndPiecesOptions"
                        :options="optionsBricksAndPieces"
                        name="stonesAndPieces"
                        stacked
                    ></b-form-checkbox-group>
                </b-form-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<style>
.row {
    margin-top: 5px;
}
.label {
    font-weight: bold;
}
</style>

<script>
export default {
    props: {
        partListId: {
            type: String,
        },
    },
    data() {
        return {
            wantedList: null,
            partList: null,
            selectedOptions: [],
            selectedColorOptions: [],
            selectedPickABrickOptions: [],
            selectedBricksAndPiecesOptions: [],
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
            optionsPickABrick: [
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
            optionsBricksAndPieces: [
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
                    if (element.bricksAndPieces) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            '"' + element.bricksAndPieces.description + '"'
                        );
                    } else if (element.pickABrick) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            '"' + element.pickABrick.name + '"'
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedOptions.includes('blMaxPrice')) {
                    csvLine = this.addToCSVLine(csvLine, element.brickLink?.wantedList?.maxprice);
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
                if (this.selectedPickABrickOptions.includes('id')) {
                    if (element.pickABrick && element.pickABrick.variant.id) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.pickABrick.variant.id
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedPickABrickOptions.includes('designNumber')) {
                    if (
                        element.pickABrick &&
                        element.pickABrick.variant.attributes.designNumber
                    ) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.pickABrick.variant.attributes.designNumber
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedPickABrickOptions.includes('price')) {
                    if (
                        element.pickABrick &&
                        element.pickABrick.variant.price.centAmount
                    ) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.pickABrick.variant.price.centAmount / 100
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedPickABrickOptions.includes('currency')) {
                    if (
                        element.pickABrick &&
                        element.pickABrick.variant.price.currencyCode
                    ) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.pickABrick.variant.price.currencyCode
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }

                // Bricks and Pieces options
                if (this.selectedBricksAndPiecesOptions.includes('id')) {
                    if (
                        element.bricksAndPieces &&
                        element.bricksAndPieces.itemNumber
                    ) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.bricksAndPieces.itemNumber
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (
                    this.selectedBricksAndPiecesOptions.includes('designNumber')
                ) {
                    if (
                        element.bricksAndPieces &&
                        element.bricksAndPieces.designId
                    ) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.bricksAndPieces.designId
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedBricksAndPiecesOptions.includes('price')) {
                    if (
                        element.bricksAndPieces &&
                        element.bricksAndPieces.price.amount
                    ) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.bricksAndPieces.price.amount
                        );
                    } else {
                        csvLine = this.addToCSVLine(csvLine, '');
                    }
                }
                if (this.selectedBricksAndPiecesOptions.includes('currency')) {
                    if (
                        element.bricksAndPieces &&
                        element.bricksAndPieces.price.currency
                    ) {
                        csvLine = this.addToCSVLine(
                            csvLine,
                            element.bricksAndPieces.price.currency
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
            if (this.selectedPickABrickOptions.includes('id')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage('exportCsv_csvHeaderPickABrickId')
                );
            }
            if (this.selectedPickABrickOptions.includes('designNumber')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderPickABrickDesignNumber'
                    )
                );
            }
            if (this.selectedPickABrickOptions.includes('price')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderPickABrickPrice'
                    )
                );
            }
            if (this.selectedPickABrickOptions.includes('currency')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderPickABrickCurrency'
                    )
                );
            }

            // Bricks and Pieces options
            if (this.selectedBricksAndPiecesOptions.includes('id')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderBricksAndPiecesId'
                    )
                );
            }
            if (this.selectedBricksAndPiecesOptions.includes('designNumber')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderBricksAndPiecesDesignNumber'
                    )
                );
            }
            if (this.selectedBricksAndPiecesOptions.includes('price')) {
                csvLine = this.addToCSVLine(
                    csvLine,
                    browser.i18n.getMessage(
                        'exportCsv_csvHeaderBricksAndPiecesPrice'
                    )
                );
            }
            if (this.selectedBricksAndPiecesOptions.includes('currency')) {
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
        selectedPickABrickOptions: function(val, oldVal) {
            localStorage.setItem('selectedPickABrickOptions', val);
        },
        selectedBricksAndPiecesOptions: function(val, oldVal) {
            localStorage.setItem('selectedBricksAndPiecesOptions', val);
        },
    },
    beforeMount() {
        this.partList = this.$store.getters['partList/getPartListsById'](this.partListId);
        this.wantedList = this.partList.positions;

        var selection =
            localStorage.getItem('selectedOptions') ||
            'bricklinkId,balance,legoDescription';
        this.selectedOptions = selection.split(',');

        selection =
            localStorage.getItem('selectedColorOptions') || 'brickLinkName';
        this.selectedColorOptions = selection.split(',');

        selection =
            localStorage.getItem('selectedPickABrickOptions') ||
            'designNumber,price,currency';
        this.selectedPickABrickOptions = selection.split(',');

        selection =
            localStorage.getItem('selectedBricksAndPiecesOptions') ||
            'designNumber,price,currency';
        this.selectedBricksAndPiecesOptions = selection.split(',');
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
