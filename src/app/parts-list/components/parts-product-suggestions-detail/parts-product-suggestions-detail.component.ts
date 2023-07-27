import { Component } from '@angular/core';
import { Part } from 'src/app/models/parts-list';

@Component({
  selector: 'app-parts-product-suggestions-detail',
  templateUrl: './parts-product-suggestions-detail.component.html',
  styleUrls: ['./parts-product-suggestions-detail.component.scss'],
})
export class PartsProductSuggestionsDetailComponent {
  show = false;
  parts: Part[];

  open(parts: Part[]) {
    this.parts = parts;
    this.show = true;
  }

  onClose() {
    this.show = false;
  }
}
