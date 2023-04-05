import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IPart } from 'src/app/models/parts-list';

@Component({
  selector: 'app-parts-table',
  templateUrl: './parts-table.component.html',
  styleUrls: ['./parts-table.component.scss'],
})
export class PartsTableComponent implements OnChanges {
  @Input()
  parts: IPart[] = [];

  @Input()
  pabIsLoading = false;

  rowHeight = 91;
  tableHeight = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.tableHeight = (this.parts ? this.parts?.length : 0) * this.rowHeight + 56;
  }

  caclImageUrl(part: IPart) {
    if (part.source.source === 'BrickLink')
      return `https://img.bricklink.com/ItemImage/PN/${part.source.color}/${part.source.id}.png`;
    return `https://brickhunter.blob.core.windows.net/parts/pab/${part.elementId}.jpg`;
  }
}
