import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrimengModule } from '../primeng.module';
import { ChangelogComponent } from './components/changelog/changelog.component';
import { ColorComponent } from './components/color/color.component';
import { ProgressIconComponent } from './components/progress-icon/progress-icon.component';
import { SideNavigationComponent } from './layout';
import { LocaleComponent } from './components/locale/locale.component';
import { FormsModule } from '@angular/forms';
import { NgModelChangeDebouncedDirective } from './directoves/ng-model-change-debounced.directive';
import { ChangelogDialogComponent } from './components/changelog-dialog/changelog-dialog.component';
import { MigrationComponent } from './components/migration/migration.component';

@NgModule({
  declarations: [
    SideNavigationComponent,
    ProgressIconComponent,
    ColorComponent,
    ChangelogComponent,
    ChangelogDialogComponent,
    LocaleComponent,
    NgModelChangeDebouncedDirective,
    MigrationComponent,
  ],
  imports: [PrimengModule, CommonModule, FontAwesomeModule, FormsModule],
  exports: [
    SideNavigationComponent,
    ProgressIconComponent,
    ColorComponent,
    ChangelogComponent,
    ChangelogDialogComponent,
    LocaleComponent,
    NgModelChangeDebouncedDirective,
    MigrationComponent,
  ],
})
export class SharedModule {}
