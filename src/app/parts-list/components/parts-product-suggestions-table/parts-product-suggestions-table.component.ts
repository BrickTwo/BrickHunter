import { Component, Input } from '@angular/core';
import { Part, Product } from 'src/app/models/parts-list';

@Component({
  selector: 'app-parts-product-suggestions-table',
  templateUrl: './parts-product-suggestions-table.component.html',
  styleUrls: ['./parts-product-suggestions-table.component.scss'],
})
export class PartsProductSuggestionsTableComponent {
  @Input()
  products!: Product[];

  parts: Part[];

  showParts(product: Product) {
    this.parts = product.parts;
  }
}
