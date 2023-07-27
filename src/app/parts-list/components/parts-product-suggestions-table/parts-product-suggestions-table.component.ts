import { Component, Input, ViewChild } from '@angular/core';
import { Part, Product } from 'src/app/models/parts-list';
import { PartsProductSuggestionsDetailComponent } from '../parts-product-suggestions-detail/parts-product-suggestions-detail.component';

@Component({
  selector: 'app-parts-product-suggestions-table',
  templateUrl: './parts-product-suggestions-table.component.html',
  styleUrls: ['./parts-product-suggestions-table.component.scss'],
})
export class PartsProductSuggestionsTableComponent {
  @Input()
  products!: Product[];

  parts: Part[];

  @ViewChild(PartsProductSuggestionsDetailComponent, { static: false })
  private partsProductSuggestionsDetailComponent?: PartsProductSuggestionsDetailComponent;

  showParts(product: Product) {
    this.parts = product.parts;
  }

  onOpenDetail(product: Product) {
    this.partsProductSuggestionsDetailComponent.open(product.parts);
  }
}
