export const countryMixin = {
    data: function() {
        return {
            languageDE: {
                languageCode: 'de',
                text: this.getLanguageName('de'),
            },
            languageEN: {
                languageCode: 'en',
                text: this.getLanguageName('en'),
            },
            languageFR: {
                languageCode: 'fr',
                text: this.getLanguageName('fr'),
            },
            languageNL: {
                languageCode: 'nl',
                text: this.getLanguageName('nl'),
            },
            languageDA: {
                languageCode: 'da',
                text: this.getLanguageName('da'),
            },
            languageFI: {
                languageCode: 'fi',
                text: this.getLanguageName('fi'),
            },
            languageIT: {
                languageCode: 'it',
                text: this.getLanguageName('it'),
            },
            languageNO: {
                languageCode: 'no',
                text: this.getLanguageName('no'),
            },
            languagePL: {
                languageCode: 'pl',
                text: this.getLanguageName('pl'),
            },
            languageSV: {
                languageCode: 'sv',
                text: this.getLanguageName('sv'),
            },
            languageES: {
                languageCode: 'es',
                text: this.getLanguageName('es'),
            },
            languageCS: {
                languageCode: 'cs',
                text: this.getLanguageName('cs'),
            },
            languageHU: {
                languageCode: 'hu',
                text: this.getLanguageName('hu'),
            },
            COUNTRIES: null,
        };
    },
    methods: {
        getCountryName(code) {
            if (!code) return;
            return browser.i18n.getMessage('country' + code.toUpperCase());
        },
        getLanguageName(code) {
            if (!code) return;
            return browser.i18n.getMessage('language' + code.toUpperCase());
        },
    },
    beforeMount() {
        this.COUNTRIES = [
            {
                countryCode: 'at',
                text: this.getCountryName('at'),
                languages: [this.languageDE, this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'au',
                text: this.getCountryName('au'),
                languages: [this.languageEN],
                currency: 'AUD',
            },
            {
                countryCode: 'be',
                text: this.getCountryName('be'),
                languages: [this.languageFR, this.languageNL, this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'ca',
                text: this.getCountryName('ca'),
                languages: [this.languageEN, this.languageFR],
                currency: 'CAD',
            },
            {
                countryCode: 'ch',
                text: this.getCountryName('ch'),
                languages: [this.languageDE, this.languageFR, this.languageEN],
                currency: 'CHF',
            },
            {
                countryCode: 'cz',
                text: this.getCountryName('cz'),
                languages: [this.languageCS, this.languageEN],
                currency: 'CZK',
            },
            {
                countryCode: 'de',
                text: this.getCountryName('de'),
                languages: [this.languageDE, this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'dk',
                text: this.getCountryName('dk'),
                languages: [this.languageDA, this.languageEN],
                currency: 'DKK',
            },
            {
                countryCode: 'es',
                text: this.getCountryName('es'),
                languages: [this.languageES, this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'fi',
                text: this.getCountryName('fi'),
                languages: [this.languageEN, this.languageFI],
                currency: 'EUR',
            },
            {
                countryCode: 'fr',
                text: this.getCountryName('fr'),
                languages: [this.languageFR, this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'gb',
                text: this.getCountryName('gb'),
                languages: [this.languageEN],
                currency: 'GBP',
            },
            {
                countryCode: 'hu',
                text: this.getCountryName('hu'),
                languages: [this.languageEN, this.languageHU],
                currency: 'HUF',
            },
            {
                countryCode: 'ie',
                text: this.getCountryName('ie'),
                languages: [this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'it',
                text: this.getCountryName('it'),
                languages: [this.languageIT, this.languageEN],
                currency: 'EUR',
            },            
            {
                countryCode: 'lu',
                text: this.getCountryName('lu'),
                languages: [this.languageFR, this.languageDE, this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'nl',
                text: this.getCountryName('nl'),
                languages: [this.languageNL, this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'no',
                text: this.getCountryName('no'),
                languages: [this.languageEN, this.languageNO],
                currency: 'NOK',
            },
            {
                countryCode: 'nz',
                text: this.getCountryName('nz'),
                languages: [this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'pl',
                text: this.getCountryName('pl'),
                languages: [this.languagePL, this.languageEN],
                currency: 'PLN',
            },
            {
                countryCode: 'pt',
                text: this.getCountryName('pt'),
                languages: [this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'se',
                text: this.getCountryName('se'),
                languages: [this.languageSV, this.languageEN],
                currency: 'EUR',
            },
            {
                countryCode: 'us',
                text: this.getCountryName('us'),
                languages: [this.languageEN],
                currency: 'EUR',
            },
        ];
    },
};
