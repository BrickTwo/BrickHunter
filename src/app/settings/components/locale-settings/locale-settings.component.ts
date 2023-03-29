import { Component, OnInit } from '@angular/core';
import { LocaleService } from 'src/app/core/services/locale.service';
import { ICountry, ILanguage } from 'src/app/models/global';

@Component({
  selector: 'app-locale-settings',
  templateUrl: './locale-settings.component.html',
  styleUrls: ['./locale-settings.component.scss'],
})
export class LocaleSettingsComponent implements OnInit {
  countries: ICountry[];

  selectedCountry: ICountry;
  selectedLanguage: ILanguage;

  constructor(private readonly localeService: LocaleService) {}

  ngOnInit(): void {
    this.countries = this.localeService.countries;
    this.selectedCountry = this.localeService.country;
    this.selectedLanguage = this.localeService.language;
  }

  onCountrySelect() {
    this.localeService.setCountry(this.selectedCountry.code);
    this.selectedLanguage = this.localeService.language;
    this.localeService.store();
  }

  onLanguageSelect() {
    this.localeService.setLanguage(this.selectedLanguage.code);
    this.localeService.store();
  }
}
