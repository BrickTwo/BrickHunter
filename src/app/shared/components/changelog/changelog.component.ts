import { Component } from '@angular/core';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss'],
})
export class ChangelogComponent {
  visible = false;

  constructor(private readonly versionService: VersionService) {
    if (this.versionService.oldVersion != this.versionService.currentVersion) {
      this.visible = true;
    }
  }

  onClose() {
    this.visible = false;
  }

  isVersionGreater(version: string) {
    return this.versionService.isVersionGreater(version, this.versionService.oldVersion);
  }
}
