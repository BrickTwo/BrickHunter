import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Part } from 'src/app/models/parts-list';
import { PartsListService } from '../../services/parts-list.service';
import { Subscription, fromEvent, interval, take } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { BlukAction } from 'src/app/models/shared';

@Component({
  selector: 'app-parts-table',
  templateUrl: './parts-table.component.html',
  styleUrls: ['./parts-table.component.scss'],
})
export class PartsTableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input()
  parts: Part[] = [];

  @Input()
  pabIsLoading = false;

  @Input()
  partsListUuid: string;

  @Input()
  allowEdit = false;

  selectedParts: Part[] = [];

  @Output()
  bulkAction = new EventEmitter<BlukAction>();

  rowHeight = 91;
  tableHeight = 0;

  tableWrapperRef: Element;
  tableRef: Element;

  rowsTop = 0;
  rowsBottom = 0;
  rowsVisible = 0;

  scrollSubscription: Subscription;
  resizeSubscription: Subscription;

  lastSort: string;

  bulkMenuItems: MenuItem[];

  constructor(private readonly partsListService: PartsListService) {}

  ngOnInit(): void {
    this.bulkMenuItems = [
      {
        label: 'Copy to',
        icon: 'fa fa-copy',
        command: () => {
          this.onCopyTo();
        },
      },
      {
        label: 'Move to',
        icon: 'fa fa-file-import',
        command: () => {
          this.onMoveTo();
        },
      },
    ];
  }

  ngAfterViewInit(): void {
    this.registerScrollSubscription();
    this.calcVisible('init');
  }

  onQuantityChange($event, partId) {
    let part: Part = this.parts.find(p => p.id === partId);
    part.qty = $event;
    this.partsListService.updatePartInPartsList(this.partsListUuid, part);
  }

  onHaveChange($event, partId) {
    let part: Part = this.parts.find(p => p.id === partId);
    part.have = $event;
    this.partsListService.updatePartInPartsList(this.partsListUuid, part);
    this.lastSort = '';
  }

  onCopyTo() {
    this.bulkAction.emit({ action: 'copy', parts: this.selectedParts });
  }
  onMoveTo() {
    this.bulkAction.emit({ action: 'move', parts: this.selectedParts });
  }

  onCustomSort($event) {
    const sort = $event.field + $event.order;
    if (this.lastSort === sort) return;
    this.lastSort = sort;
    this.parts.sort((data1, data2) => {
      let value1 = this.resolveFieldData(data1, $event.field);
      let value2 = this.resolveFieldData(data2, $event.field);
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return $event.order * result;
    });
  }

  resolveFieldData(data: any, field: any): any {
    if (data && field) {
      if (this.isFunction(field)) {
        return field(data);
      } else if (field.indexOf('.') == -1) {
        return data[field];
      } else {
        let fields: string[] = field.split('.');
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  }

  isFunction(obj: any) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tableHeight = (this.parts ? this.parts?.length : 0) * this.rowHeight + 56;
    this.calcVisible('changes');
  }

  onDeletePart(part: Part) {
    this.parts = this.parts.filter(p => p.id !== part.id);
    this.partsListService.deletePartInPartsList(this.partsListUuid, part.id);
  }

  getParts() {
    if (this.rowsVisible <= 20) this.rowsVisible = 20;
    return this.parts?.slice(this.rowsTop, this.rowsTop + this.rowsVisible);
  }

  getTopStyle() {
    if (this.rowsTop % 2 === 0) {
      return `height: ${(this.rowsTop - 1) * this.rowHeight}px`;
    }
    return `height: ${this.rowsTop * this.rowHeight}px`;
  }

  getBottomStyle() {
    return `height: ${this.rowsBottom * this.rowHeight}px`;
  }

  caclImageUrl(part: Part) {
    if (part.source.source === 'BrickLink')
      return `https://img.bricklink.com/ItemImage/PN/${part.source.color}/${part.source.id}.png`;
    return `https://brickhunter.blob.core.windows.net/parts/pab/${part.elementId}.jpg`;
  }

  calcVisible(source: string) {
    if (!this.registerScrollSubscription()) return;
    const rect = this.tableRef.getBoundingClientRect();
    this.rowsVisible = Math.ceil((this.tableWrapperRef.clientHeight - 210) / 91) + 2;

    this.rowsTop = 0;
    this.rowsBottom = 0;

    if (Math.floor(rect.top) < 0) {
      this.rowsTop = Math.floor((rect.top * -1) / this.rowHeight);
    }

    this.rowsBottom = (this.parts?.length || 0) - this.rowsTop - this.rowsVisible;
  }

  registerScrollSubscription() {
    if (this.scrollSubscription) return true;
    this.tableWrapperRef = document.getElementsByClassName('p-datatable-wrapper')[0];
    if (!this.tableWrapperRef) return false;
    if (!this.tableWrapperRef.attributes['style']) {
      interval(500)
        .pipe(take(1))
        .subscribe(() => this.registerScrollSubscription());
      return false;
    }
    if (!this.tableRef) this.tableRef = this.tableWrapperRef.getElementsByClassName('p-datatable-table')[0];
    if (!this.tableRef) return false;

    this.scrollSubscription = fromEvent(this.tableWrapperRef, 'scroll').subscribe((e: Event) => {
      this.calcVisible('scroll');
    });

    this.resizeSubscription = fromEvent(this.tableWrapperRef, 'resize').subscribe((e: Event) => {
      this.calcVisible('resize');
    });

    return true;
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) this.scrollSubscription.unsubscribe();
    if (this.resizeSubscription) this.resizeSubscription.unsubscribe();
  }
}
