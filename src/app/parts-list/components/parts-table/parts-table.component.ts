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
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
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

  @Input()
  scrollHeightSubtraction = 210;

  @Input()
  dataTableWrapperIndex = 0;

  @Input()
  log = false;

  @Output()
  bulkAction = new EventEmitter<BlukAction>();

  selectedParts: Part[] = [];
  lastSort: string;
  bulkMenuItems: MenuItem[];

  rowHeight = 91;
  tableHeight = 0;

  tableWrapperRef: Element;
  tableRef: Element;

  rowsTop = 0;
  rowsBottom = 0;
  rowsVisible = 0;

  scrollSubscription: Subscription;
  resizeSubscription: Subscription;
  tableRefResizeObserver: ResizeObserver;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {}

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
      {
        label: 'Delete',
        icon: 'fa fa-trash-can',
        command: () => {
          this.onDelete();
        },
      },
    ];
  }

  ngAfterViewInit(): void {
    this.registerScrollSubscription('AfterViewInit');
    this.calcVisible('AfterViewInit');
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

  onDelete() {
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected Parts?',
      header: 'Delete Confirmation',
      icon: 'fa fa-circle-info',
      accept: () => {
        this.bulkAction.emit({ action: 'delete', parts: this.selectedParts });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      },
      key: 'positionDialog',
    });
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

  onImageError(imgRef: any) {
    imgRef.src = './assets/placeholder.png';
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
    if (this.log) console.log(changes);
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
    if (this.log) console.log('calcVisible', source, this.parts);
    if (!this.registerScrollSubscription('calcVisible')) return;
    if (this.log) console.log('blub');
    const rect = this.tableRef.getBoundingClientRect();
    this.rowsVisible =
      Math.ceil((this.tableWrapperRef.clientHeight - this.scrollHeightSubtraction) / this.rowHeight) + 2;

    if (this.log) console.log(this.tableWrapperRef.clientHeight, this.rowsVisible);

    this.rowsTop = 0;
    this.rowsBottom = 0;

    if (Math.floor(rect.top) < 0) {
      this.rowsTop = Math.floor((rect.top * -1) / this.rowHeight);
    }

    this.rowsBottom = (this.parts?.length || 0) - this.rowsTop - this.rowsVisible;
  }

  registerScrollSubscription(source: string) {
    if (this.log) console.log('registerScrollSubscription', source, this.parts);
    if (this.scrollSubscription) return true;
    this.tableWrapperRef = document.getElementsByClassName('p-datatable-wrapper')[this.dataTableWrapperIndex];
    if (this.log)
      console.log(
        this.tableWrapperRef,
        document.getElementsByClassName('p-datatable-wrapper'),
        document.getElementsByClassName('p-datatable-wrapper').length,
        this.dataTableWrapperIndex,
        document.getElementsByClassName('p-datatable-wrapper')[1]
      );
    if (!this.tableWrapperRef) {
      interval(250)
        .pipe(take(1))
        .subscribe(() => this.registerScrollSubscription('self'));
      return false;
    }
    if (!this.tableWrapperRef.attributes['style']) {
      interval(500)
        .pipe(take(1))
        .subscribe(() => this.registerScrollSubscription('self'));
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

    this.tableRefResizeObserver = new ResizeObserver(entries => {
      this.calcVisible('fff');
    });

    this.tableRefResizeObserver.observe(this.tableRef);
    return true;
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) this.scrollSubscription.unsubscribe();
    if (this.resizeSubscription) this.resizeSubscription.unsubscribe();
    if (this.tableRefResizeObserver) this.tableRefResizeObserver.unobserve(this.tableRef);
  }
}
