import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrimengModule } from '../primeng.module';
import { SharedModule } from '../shared/shared.module';
import { StudioComponent } from './pages/studio/studio.component';
import { GeneratePaletteComponent } from './components/generate-palette/generate-palette.component';

@NgModule({
  declarations: [StudioComponent, GeneratePaletteComponent],
  imports: [
    PrimengModule,
    RouterModule.forChild([{ path: '', component: StudioComponent }]),
    CommonModule,
    SharedModule,
    FormsModule,
    FontAwesomeModule,
  ],
})
export class StudioModule {}
