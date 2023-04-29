import { Component, Input } from '@angular/core';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss'],
})
export class ChangelogComponent {
  @Input() versionCheck = true;

  constructor(private readonly versionService: VersionService) {}

  isVersionGreater(version: string) {
    if (!this.versionCheck) return true;
    if (this.versionService.oldVersion === '0.0.0') return false;
    return this.versionService.isVersionGreater(this.versionService.oldVersion, version);
  }
}
