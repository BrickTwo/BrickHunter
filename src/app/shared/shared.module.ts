import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrimengModule } from '../primeng.module';
import { ColorComponent } from './components/color/color.component';
import { ProgressIconComponent } from './components/progress-icon/progress-icon.component';
import { SideNavigationComponent } from './layout';

@NgModule({
  declarations: [SideNavigationComponent, ProgressIconComponent, ColorComponent],
  imports: [PrimengModule, CommonModule, FontAwesomeModule],
  exports: [SideNavigationComponent, ProgressIconComponent, ColorComponent],
})
export class SharedModule {}
