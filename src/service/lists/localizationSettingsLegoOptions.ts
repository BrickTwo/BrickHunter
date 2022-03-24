import i18n from "@/i18n";
import { ICountry, ILanguage } from "@/types/types";

const { t } = i18n.global;

export class LocalizationSettingsLegoOptions {
  public getCountries(): ICountry[] {
    return [
      {
        value: "at",
        label: this.getCountryName("at"),
        languages: [
          this.getLanguages().find((l) => l.value === "de"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "EUR",
      },
      {
        value: "au",
        label: this.getCountryName("au"),
        languages: [this.getLanguages().find((l) => l.value === "en")],
        currency: "AUD",
      },
      {
        value: "be",
        label: this.getCountryName("be"),
        languages: [
          this.getLanguages().find((l) => l.value === "fr"),
          this.getLanguages().find((l) => l.value === "nl"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "EUR",
      },
      {
        value: "ca",
        label: this.getCountryName("ca"),
        languages: [
          this.getLanguages().find((l) => l.value === "en"),
          this.getLanguages().find((l) => l.value === "fr"),
        ],
        currency: "CAD",
      },
      {
        value: "ch",
        label: this.getCountryName("ch"),
        languages: [
          this.getLanguages().find((l) => l.value === "de"),
          this.getLanguages().find((l) => l.value === "fr"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "CHF",
      },
      {
        value: "cz",
        label: this.getCountryName("cz"),
        languages: [
          this.getLanguages().find((l) => l.value === "cs"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "CZK",
      },
      {
        value: "de",
        label: this.getCountryName("de"),
        languages: [
          this.getLanguages().find((l) => l.value === "de"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "EUR",
      },
      {
        value: "dk",
        label: this.getCountryName("dk"),
        languages: [
          this.getLanguages().find((l) => l.value === "da"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "DKK",
      },
      {
        value: "es",
        label: this.getCountryName("es"),
        languages: [
          this.getLanguages().find((l) => l.value === "es"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "EUR",
      },
      {
        value: "fi",
        label: this.getCountryName("fi"),
        languages: [
          this.getLanguages().find((l) => l.value === "en"),
          this.getLanguages().find((l) => l.value === "fi"),
        ],
        currency: "EUR",
      },
      {
        value: "fr",
        label: this.getCountryName("fr"),
        languages: [
          this.getLanguages().find((l) => l.value === "fr"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "EUR",
      },
      {
        value: "gb",
        label: this.getCountryName("gb"),
        languages: [this.getLanguages().find((l) => l.value === "en")],
        currency: "GBP",
      },
      {
        value: "hu",
        label: this.getCountryName("hu"),
        languages: [
          this.getLanguages().find((l) => l.value === "en"),
          this.getLanguages().find((l) => l.value === "hu"),
        ],
        currency: "HUF",
      },
      {
        value: "ie",
        label: this.getCountryName("ie"),
        languages: [this.getLanguages().find((l) => l.value === "en")],
        currency: "EUR",
      },
      {
        value: "it",
        label: this.getCountryName("it"),
        languages: [
          this.getLanguages().find((l) => l.value === "it"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "EUR",
      },
      {
        value: "lu",
        label: this.getCountryName("lu"),
        languages: [
          this.getLanguages().find((l) => l.value === "fr"),
          this.getLanguages().find((l) => l.value === "de"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "EUR",
      },
      {
        value: "nl",
        label: this.getCountryName("nl"),
        languages: [
          this.getLanguages().find((l) => l.value === "nl"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "EUR",
      },
      {
        value: "no",
        label: this.getCountryName("no"),
        languages: [
          this.getLanguages().find((l) => l.value === "en"),
          this.getLanguages().find((l) => l.value === "no"),
        ],
        currency: "NOK",
      },
      {
        value: "nz",
        label: this.getCountryName("nz"),
        languages: [this.getLanguages().find((l) => l.value === "en")],
        currency: "EUR",
      },
      {
        value: "pl",
        label: this.getCountryName("pl"),
        languages: [
          this.getLanguages().find((l) => l.value === "pl"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "PLN",
      },
      {
        value: "pt",
        label: this.getCountryName("pt"),
        languages: [this.getLanguages().find((l) => l.value === "en")],
        currency: "EUR",
      },
      {
        value: "se",
        label: this.getCountryName("se"),
        languages: [
          this.getLanguages().find((l) => l.value === "sv"),
          this.getLanguages().find((l) => l.value === "en"),
        ],
        currency: "EUR",
      },
      {
        value: "us",
        label: this.getCountryName("us"),
        languages: [this.getLanguages().find((l) => l.value === "en")],
        currency: "EUR",
      },
    ];
  }

  public getLanguages(): ILanguage[] {
    return [
      {
        value: "de",
        label: this.getLanguageName("de"),
      },
      {
        value: "en",
        label: this.getLanguageName("en"),
      },
      {
        value: "fr",
        label: this.getLanguageName("fr"),
      },
      {
        value: "nl",
        label: this.getLanguageName("nl"),
      },
      {
        value: "da",
        label: this.getLanguageName("da"),
      },
      {
        value: "fi",
        label: this.getLanguageName("fi"),
      },
      {
        value: "it",
        label: this.getLanguageName("it"),
      },
      {
        value: "no",
        label: this.getLanguageName("no"),
      },
      {
        value: "pl",
        label: this.getLanguageName("pl"),
      },
      {
        value: "sv",
        label: this.getLanguageName("sv"),
      },
      {
        value: "es",
        label: this.getLanguageName("es"),
      },
      {
        value: "cs",
        label: this.getLanguageName("cs"),
      },
      {
        value: "hu",
        label: this.getLanguageName("hu"),
      },
    ];
  }

  public getCountryName(code: string): string | undefined {
    if (!code) return;
    return t(`countries.${code.toUpperCase()}`);
  }

  public getLanguageName(code: string): string | undefined {
    if (!code) return;
    return t(`languages.${code.toUpperCase()}`);
  }
}
