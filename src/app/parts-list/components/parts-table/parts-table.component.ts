import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IPart } from 'src/app/models/parts-list';
import { PartsListService } from '../../services/parts-list.service';

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

  @Input()
  partsListUuid: string;

  @Input()
  allowEdit = false;

  rowHeight = 91;
  tableHeight = 0;

  constructor(private readonly partsListService: PartsListService) {}

  onQuantityChange($event, partId) {
    let part: IPart = this.parts.find(p => p.id === partId);
    part.qty = $event;
    this.partsListService.updatePartsListPart(this.partsListUuid, part);
  }

  onHaveChange($event, partId) {
    let part: IPart = this.parts.find(p => p.id === partId);
    part.have = $event;
    this.partsListService.updatePartsListPart(this.partsListUuid, part);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tableHeight = (this.parts ? this.parts?.length : 0) * this.rowHeight + 56;
  }

  caclImageUrl(part: IPart) {
    if (part.source.source === 'BrickLink')
      return `https://img.bricklink.com/ItemImage/PN/${part.source.color}/${part.source.id}.png`;
    return `https://brickhunter.blob.core.windows.net/parts/pab/${part.elementId}.jpg`;
  }
}
