import { Injectable } from '@angular/core';
import { Country, Language } from 'src/app/models/global';

@Injectable()
export class LocaleService {
  countries = initializeCountries;
  country?: Country = initializeCountries[0];
  language: Language = this.country.languages[0];
  languageCountryCode = `${this.language.code.toLowerCase()}-${this.country.code.toUpperCase()}`;
  localeNotSet = false;

  constructor() {
    const countryCode = localStorage.getItem('country') || null;
    const languageCode = localStorage.getItem('language') || null;
    if (!countryCode || !languageCode) {
      this.localeNotSet = true;
    }

    this.setCountry(countryCode);
    this.setLanguage(languageCode);
  }

  setCountry(code: string) {
    const country = this.countries.find(c => c.code === code);
    if (country) {
      this.country = country;
    } else {
      this.country = this.countries[0];
    }

    if (this.country.languages.find(l => l.code === this.language.code)) {
      this.language = this.country.languages.find(l => l.code === this.language.code);
    } else {
      this.language = this.country.languages[0];
    }

    this.setLanguageCountryCode();
  }

  setLanguage(code: string) {
    const language = this.country.languages.find(l => l.code === code);
    if (language) {
      this.language = language;
    } else {
      this.language = this.country.languages[0];
    }

    this.setLanguageCountryCode();
  }

  private setLanguageCountryCode() {
    this.languageCountryCode = `${this.language.code.toLowerCase()}-${this.country.code.toUpperCase()}`;
  }

  store() {
    localStorage.setItem('country', this.country.code);
    localStorage.setItem('language', this.language.code);
  }
}
const languageDE: Language = {
  code: 'de',
  text: 'German',
  flag: 'de',
};
const languageEN: Language = {
  code: 'en',
  text: 'English',
  flag: 'uk',
};
const languageFR: Language = {
  code: 'fr',
  text: 'French',
  flag: 'fr',
};
const languageNL: Language = {
  code: 'nl',
  text: 'Dutch',
  flag: 'nl',
};
const languageDA: Language = {
  code: 'da',
  text: 'Danish',
  flag: 'dk',
};
const languageFI: Language = {
  code: 'fi',
  text: 'Finnish',
  flag: 'fi',
};
const languageIT: Language = {
  code: 'it',
  text: 'Italian',
  flag: 'it',
};
const languageNO: Language = {
  code: 'no',
  text: 'Norwegian',
  flag: 'no',
};
const languagePL: Language = {
  code: 'pl',
  text: 'Polish',
  flag: 'pl',
};
const languagePT: Language = {
  code: 'pt',
  text: 'Portugese',
  flag: 'pt',
};
const languageSK: Language = {
  code: 'sk',
  text: 'Slovak',
  flag: 'sk',
};
const languageSV: Language = {
  code: 'sv',
  text: 'Swedish',
  flag: 'se',
};
const languageES: Language = {
  code: 'es',
  text: 'Spanish',
  flag: 'es',
};
const languageCS: Language = {
  code: 'cs',
  text: 'Czech',
  flag: 'cz',
};
const languageHU: Language = {
  code: 'hu',
  text: 'Hungarian',
  flag: 'hu',
};

const initializeCountries: Country[] = [
  {
    code: 'at',
    text: 'Austria',
    languages: [languageDE, languageEN],
    currency: 'EUR',
  },
  {
    code: 'au',
    text: 'Australia',
    languages: [languageEN],
    currency: 'AUD',
  },
  {
    code: 'be',
    text: 'Belgium',
    languages: [languageFR, languageNL, languageEN],
    currency: 'EUR',
  },
  {
    code: 'ca',
    text: 'Canada',
    languages: [languageEN, languageFR],
    currency: 'CAD',
  },
  {
    code: 'ch',
    text: 'Switzerland',
    languages: [languageDE, languageFR, languageEN],
    currency: 'CHF',
  },
  {
    code: 'cz',
    text: 'Czech Republic',
    languages: [languageCS, languageEN],
    currency: 'CZK',
  },
  {
    code: 'de',
    text: 'Germany',
    languages: [languageDE, languageEN],
    currency: 'EUR',
  },
  {
    code: 'dk',
    text: 'Denmark',
    languages: [languageDA, languageEN],
    currency: 'DKK',
  },
  {
    code: 'es',
    text: 'Spain',
    languages: [languageES, languageEN],
    currency: 'EUR',
  },
  {
    code: 'fi',
    text: 'Finland',
    languages: [languageEN, languageFI],
    currency: 'EUR',
  },
  {
    code: 'fr',
    text: 'France',
    languages: [languageFR, languageEN],
    currency: 'EUR',
  },
  {
    code: 'gb',
    text: 'Great Britain',
    languages: [languageEN],
    currency: 'GBP',
  },
  {
    code: 'hu',
    text: 'Hungary',
    languages: [languageEN, languageHU],
    currency: 'HUF',
  },
  {
    code: 'ie',
    text: 'Ireland',
    languages: [languageEN],
    currency: 'EUR',
  },
  {
    code: 'it',
    text: 'Italy',
    languages: [languageIT, languageEN],
    currency: 'EUR',
  },
  {
    code: 'lu',
    text: 'Luxembourg',
    languages: [languageFR, languageDE, languageEN],
    currency: 'EUR',
  },
  {
    code: 'nl',
    text: 'Netherlands',
    languages: [languageNL, languageEN],
    currency: 'EUR',
  },
  {
    code: 'no',
    text: 'Norway',
    languages: [languageEN, languageNO],
    currency: 'NOK',
  },
  {
    code: 'nz',
    text: 'New Zealand',
    languages: [languageEN],
    currency: 'EUR',
  },
  {
    code: 'pl',
    text: 'Poland',
    languages: [languagePL, languageEN],
    currency: 'PLN',
  },
  {
    code: 'pt',
    text: 'Portugal',
    languages: [languagePT, languageEN],
    currency: 'EUR',
  },
  {
    code: 'se',
    text: 'Sweden',
    languages: [languageSV, languageEN],
    currency: 'EUR',
  },
  {
    code: 'sk',
    text: 'Slovakia',
    languages: [languageSK, languageEN],
    currency: 'EUR',
  },
  {
    code: 'si',
    text: 'Slovenia',
    languages: [languageEN],
    currency: 'EUR',
  },
  {
    code: 'us',
    text: 'United States',
    languages: [languageEN],
    currency: 'EUR',
  },
];
