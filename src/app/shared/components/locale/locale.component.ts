import { Component } from '@angular/core';
import { LocaleService } from 'src/app/core/services/locale.service';
import { Country, Language } from 'src/app/models/global';

@Component({
    selector: 'app-locale',
    templateUrl: './locale.component.html',
    styleUrls: ['./locale.component.scss'],
    standalone: false
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

  onCountryShow() {
    // Keep the legacy list opening at the beginning; subsequent keyboard
    // navigation retains Select's normal focus and scrolling behavior.
    const listboxId = document.getElementById('country')?.getAttribute('aria-controls');
    const listbox = listboxId ? document.getElementById(listboxId) : null;
    const container = listbox?.closest<HTMLElement>('.p-select-list-container');
    if (container) container.scrollTop = 0;
  }

  onLanguageSelect() {
    this.localeService.setLanguage(this.selectedLanguage.code);
  }
}
