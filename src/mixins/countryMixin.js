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
                countryCode: 'au',
                text: this.getCountryName('au'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'be',
                text: this.getCountryName('be'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'dk',
                text: this.getCountryName('dk'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'de',
                text: this.getCountryName('de'),
                languages: [this.languageDE, this.languageEN],
            },
            {
                countryCode: 'fi',
                text: this.getCountryName('fi'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'fr',
                text: this.getCountryName('fr'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'gb',
                text: this.getCountryName('gb'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'ie',
                text: this.getCountryName('ie'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'it',
                text: this.getCountryName('it'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'ca',
                text: this.getCountryName('ca'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'lu',
                text: this.getCountryName('lu'),
                languages: [this.languageFR, this.languageDE, this.languageEN],
            },
            {
                countryCode: 'nz',
                text: this.getCountryName('nz'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'nl',
                text: this.getCountryName('nl'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'no',
                text: this.getCountryName('no'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'at',
                text: this.getCountryName('at'),
                languages: [this.languageDE, this.languageEN],
            },
            {
                countryCode: 'pl',
                text: this.getCountryName('pl'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'pt',
                text: this.getCountryName('pt'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'se',
                text: this.getCountryName('se'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'ch',
                text: this.getCountryName('ch'),
                languages: [this.languageDE, this.languageFR, this.languageEN],
            },
            {
                countryCode: 'es',
                text: this.getCountryName('es'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'cz',
                text: this.getCountryName('cz'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'hu',
                text: this.getCountryName('hu'),
                languages: [this.languageEN],
            },
            {
                countryCode: 'us',
                text: this.getCountryName('us'),
                languages: [this.languageEN],
            },
        ];
    },
};
