import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Part, Product } from 'src/app/models/parts-list';
import { PartsProductSuggestionsDetailComponent } from '../parts-product-suggestions-detail/parts-product-suggestions-detail.component';
import { BlukAction } from 'src/app/models/shared';

@Component({
  selector: 'app-parts-product-suggestions-table',
  templateUrl: './parts-product-suggestions-table.component.html',
  styleUrls: ['./parts-product-suggestions-table.component.scss'],
})
export class PartsProductSuggestionsTableComponent {
  @Input()
  products!: Product[];

  @Input()
  partsListUuid!: string;

  @Output()
  bulkAction = new EventEmitter<BlukAction>();

  parts: Part[];

  @ViewChild(PartsProductSuggestionsDetailComponent, { static: false })
  private partsProductSuggestionsDetailComponent?: PartsProductSuggestionsDetailComponent;

  showParts(product: Product) {
    this.parts = product.partsUsed;
  }

  onOpenDetail(product: Product) {
    this.partsProductSuggestionsDetailComponent.open(this.partsListUuid, product);
  }

  onBulkAction(value: BlukAction) {
    this.bulkAction.emit({ action: value.action, parts: value.parts });
  }
}
