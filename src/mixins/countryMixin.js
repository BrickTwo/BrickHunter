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
                countryCode: 'de',
                text: this.getCountryName('de'),
                languages: [this.languageDE, this.languageEN],
            },
            {
                countryCode: 'at',
                text: this.getCountryName('at'),
                languages: [this.languageDE, this.languageEN],
            },
            {
                countryCode: 'ch',
                text: this.getCountryName('ch'),
                languages: [this.languageDE, this.languageFR, this.languageEN],
            },
            {
                countryCode: 'lu',
                text: this.getCountryName('lu'),
                languages: [this.languageFR, this.languageDE, this.languageEN],
            },
        ];
    },
};
