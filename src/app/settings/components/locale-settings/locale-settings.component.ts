import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { LocaleService } from 'src/app/core/services/locale.service';
import { Country, Language } from 'src/app/models/global';

@Component({
  selector: 'app-locale-settings',
  templateUrl: './locale-settings.component.html',
  styleUrls: ['./locale-settings.component.scss'],
})
export class LocaleSettingsComponent implements OnInit, AfterViewChecked {
  countries: Country[];
  languages: Language[];

  selectedCountry: Country;
  selectedLanguage: Language;

  constructor(private readonly localeService: LocaleService) {}

  ngOnInit(): void {
    this.countries = this.localeService.countries;
    this.selectedCountry = this.localeService.country;
    this.languages = this.selectedCountry.languages;
    this.selectedLanguage = this.localeService.language;
  }

  ngAfterViewChecked(): void {
    if (!this.selectedLanguage) this.selectedLanguage = this.localeService.language;
  }

  onCountrySelect() {
    this.localeService.setCountry(this.selectedCountry.code);
    this.languages = this.selectedCountry.languages;
    this.selectedLanguage = this.localeService.language;
    this.localeService.store();
  }

  onLanguageSelect() {
    this.localeService.setLanguage(this.selectedLanguage.code);
    this.localeService.store();
  }
}
