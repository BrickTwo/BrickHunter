import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrimengModule } from '../primeng.module';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './page/settings/settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    PrimengModule,
    RouterModule.forChild([{ path: '', component: SettingsComponent }]),
    CommonModule,
    SharedModule,
    FormsModule,
    FontAwesomeModule,
  ],
})
export class SettingsModule {}
