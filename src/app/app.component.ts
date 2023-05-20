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
  ) {
    //this.setPermission();
  }

  async setPermission() {
    const permissionsToRequest = {
      permissions: ['host_permission'],
      origins: ['https://*.lego.com/*'],
    };

    function onResponse(response) {
      if (response) {
        console.log('Permission was granted');
      } else {
        console.log('Permission was refused');
      }
      return chrome.permissions.getAll();
    }

    const response = await chrome.permissions.request(permissionsToRequest);
    const currentPermissions = await onResponse(response);

    console.log(`Current permissions:`, currentPermissions);
  }
}
