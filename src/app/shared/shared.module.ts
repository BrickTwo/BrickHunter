import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrimengModule } from '../primeng.module';
import { ProgressIconComponent } from './components/progress-icon/progress-icon.component';
import { SideNavigationComponent } from './layout';

@NgModule({
  declarations: [SideNavigationComponent, ProgressIconComponent],
  imports: [PrimengModule, CommonModule, FontAwesomeModule],
  exports: [SideNavigationComponent, ProgressIconComponent],
})
export class SharedModule {}
