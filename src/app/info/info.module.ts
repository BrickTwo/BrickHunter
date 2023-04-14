import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrimengModule } from '../primeng.module';
import { SharedModule } from '../shared/shared.module';
import { InfoComponent } from './pages/info/info.component';

@NgModule({
  declarations: [InfoComponent],
  imports: [
    PrimengModule,
    RouterModule.forChild([{ path: '', component: InfoComponent }]),
    CommonModule,
    SharedModule,
    FontAwesomeModule,
  ],
  providers: [],
})
export class InfoModule {}
