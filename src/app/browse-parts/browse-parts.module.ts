import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrimengModule } from '../primeng.module';
import { SharedModule } from '../shared/shared.module';
import { BrowsePartsComponent } from '../browse-parts/pages/browse-parts/browse-parts.component';
import { BrowsePartsPartsListsComponent } from './components/browse-parts-parts-lists/browse-parts-parts-lists.component';
import { BrowsePartsCategorySelectionComponent } from './components/browse-parts-category-selection/browse-parts-category-selection.component';
import { BrowsePartsColorFilterComponent } from './components/browse-parts-color-filter/browse-parts-color-filter.component';
import { BrowsePartsDataViewComponent } from './components/browse-parts-data-view/browse-parts-data-view.component';

@NgModule({
  declarations: [BrowsePartsComponent, BrowsePartsPartsListsComponent, BrowsePartsCategorySelectionComponent, BrowsePartsColorFilterComponent, BrowsePartsDataViewComponent],
  imports: [
    PrimengModule,
    RouterModule.forChild([{ path: '', component: BrowsePartsComponent }]),
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  providers: [],
})
export class BrowsePartsModule {}
