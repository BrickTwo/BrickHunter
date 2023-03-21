import { Component, Input } from '@angular/core';
import { IPart } from 'src/app/models/parts-list';

@Component({
  selector: 'app-parts-table',
  templateUrl: './parts-table.component.html',
  styleUrls: ['./parts-table.component.scss'],
})
export class PartsTableComponent {
  @Input()
  parts: IPart[] = [];

  caclImageUrl(part: IPart) {
    return `https://img.bricklink.com/ItemImage/PN/${part.source.color}/${part.source.id}.png`;
  }
}
