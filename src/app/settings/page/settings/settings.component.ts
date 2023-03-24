import { Component, OnInit } from '@angular/core';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { LocaleService } from 'src/app/core/services/locale.service';
import { ICountry, ILanguage } from 'src/app/models/global';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  faGear = faGear;
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
  }

  onLanguageSelect() {
    this.localeService.setLanguage(this.selectedLanguage.code);
  }
}
