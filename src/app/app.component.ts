import { Component } from '@angular/core';
import { GlobalSettingsService } from './core/services/global-settings.service';
import { VersionService } from './core/services/version.service';
import { LocaleService } from './core/services/locale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly versionService: VersionService,
    private readonly gloabSettingsService: GlobalSettingsService,
    private readonly localeService: LocaleService
  ) {}
}
