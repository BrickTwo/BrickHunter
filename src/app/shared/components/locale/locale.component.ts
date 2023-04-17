import { Component } from '@angular/core';
import { LocaleService } from 'src/app/core/services/locale.service';
import { Country, Language } from 'src/app/models/global';

@Component({
  selector: 'app-locale',
  templateUrl: './locale.component.html',
  styleUrls: ['./locale.component.scss'],
})
export class LocaleComponent {
  visible = false;
  countries: Country[];

  selectedCountry: Country;
  selectedLanguage: Language;

  constructor(private readonly localeService: LocaleService) {
    this.countries = this.localeService.countries;
    this.selectedCountry = this.localeService.country;
    this.selectedLanguage = this.localeService.language;
    if (this.localeService.localeNotSet) {
      this.visible = true;
    }
  }

  onSave() {
    this.localeService.store();
    this.visible = false;
  }

  onCountrySelect() {
    this.localeService.setCountry(this.selectedCountry.code);
    this.selectedLanguage = this.localeService.language;
  }

  onLanguageSelect() {
    this.localeService.setLanguage(this.selectedLanguage.code);
  }
}
