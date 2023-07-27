import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrimengModule } from '../primeng.module';
import { SharedModule } from '../shared/shared.module';
import { PartsListImportComponent, PartsListSettingsComponent, PartsTableComponent } from './components';
import { PartsListTransferComponent } from './components/parts-list-transfer/parts-list-transfer.component';
import { PartsListDetailComponent, PartsListListComponent } from './pages';
import { PabPriceComponent } from './components/pab-price/pab-price.component';
import { ImportService } from './services/import.service';
import { PickABrickService } from './services/pickabrick.service';
import { PartsListSplitComponent } from './components/parts-list-split/parts-list-split.component';
import { TransferWarningComponent } from './components/transfer-warning/transfer-warning.component';
import { PartsListPdfComponent } from './components/parts-list-pdf/parts-list-pdf.component';
import { PartsListExportComponent } from './components/parts-list-export/parts-list-export.component';
import { PartsListCopyOrMoveToComponent } from './components/parts-list-copy-or-move-to/parts-list-copy-or-move-to.component';
import { PartsProductSuggestionsTableComponent } from './components/parts-product-suggestions-table/parts-product-suggestions-table.component';
import { PartsProductSuggestionsDetailComponent } from './components/parts-product-suggestions-detail/parts-product-suggestions-detail.component';

@NgModule({
  declarations: [
    PartsListListComponent,
    PartsListDetailComponent,
    PartsListSettingsComponent,
    PartsListImportComponent,
    PartsTableComponent,
    PartsListTransferComponent,
    PabPriceComponent,
    PartsListSplitComponent,
    TransferWarningComponent,
    PartsListPdfComponent,
    PartsListExportComponent,
    PartsListCopyOrMoveToComponent,
    PartsProductSuggestionsTableComponent,
    PartsProductSuggestionsDetailComponent,
  ],
  imports: [
    PrimengModule,
    RouterModule.forChild([
      { path: '', component: PartsListListComponent },
      { path: ':id', component: PartsListDetailComponent },
    ]),
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  providers: [ImportService, PickABrickService],
})
export class PartsListsModule {}
