import { Component, Input } from '@angular/core';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-changelog-dialog',
  templateUrl: './changelog-dialog.component.html',
  styleUrls: ['./changelog-dialog.component.scss'],
})
export class ChangelogDialogComponent {
  @Input() versionCheck: true;

  visible = false;

  constructor(private readonly versionService: VersionService) {
    if (this.versionService.oldVersion != this.versionService.currentVersion) {
      this.visible = true;
    }
    if (this.versionService.oldVersion === '0.0.0') this.visible = false;
  }

  onClose() {
    this.visible = false;
  }
}
