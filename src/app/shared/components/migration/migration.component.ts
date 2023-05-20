import { Component, OnInit } from '@angular/core';
import { VersionService } from 'src/app/core/services/version.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.scss'],
})
export class MigrationComponent implements OnInit {
  showDialog = false;
  counter: number = 0;
  migrated: number = 0;
  warning: Message[] = [
    {
      severity: 'warn',
      summary: 'Warning',
      detail:
        'In case the migration fails: Please do not uninstall BrickHunter and reach out to me, otherwise your old lists can not be recovered anymore. Please open an Issue on GitHub or send me an e-mail.',
    },
  ];

  constructor(private readonly versionService: VersionService) {}

  ngOnInit(): void {
    const migrationSubscription = this.versionService.migration$.subscribe(migration => {
      if (migration.version2_0_0.migrationStarted && !migration.version2_0_0.migrationEnd) {
        this.showDialog = true;
      }
      if (migration.version2_0_0.migrationEnd) {
        this.showDialog = false;
        migrationSubscription.unsubscribe();
      }
      this.counter = migration.version2_0_0.partsListCount;
      this.migrated = migration.version2_0_0.partsListMigrated;
    });
  }
}
