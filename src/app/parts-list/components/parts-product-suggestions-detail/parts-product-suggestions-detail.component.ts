import { Component, EventEmitter, Output } from '@angular/core';
import { Part, PartsList, Product } from 'src/app/models/parts-list';
import { PartsListService } from '../../services/parts-list.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { ColorService } from 'src/app/core/services/color.service';
import autoTable, { ColumnInput } from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { BlukAction } from 'src/app/models/shared';

@Component({
  selector: 'app-parts-product-suggestions-detail',
  templateUrl: './parts-product-suggestions-detail.component.html',
  styleUrls: ['./parts-product-suggestions-detail.component.scss'],
})
export class PartsProductSuggestionsDetailComponent {
  show = false;
  product: Product;
  currentPartListUuid: string;
  partsList: PartsList;

  @Output()
  bulkAction = new EventEmitter<BlukAction>();

  constructor(
    private readonly partsListService: PartsListService,
    private readonly messageService: MessageService,
    private readonly colorService: ColorService,
    private readonly confirmationService: ConfirmationService,
  ) {}

  open(partsListUuid: string, product: Product) {
    this.currentPartListUuid = partsListUuid;
    this.partsList = this.partsListService.getPartsList(this.currentPartListUuid);
    this.product = product;
    this.show = true;
  }

  onClose() {
    this.show = false;
  }

  getTotalPrice(filter: string): string {
    if (filter === 'all') {
      return (
        Math.round(
          this.product?.partsUsed?.reduce(
              (a, b) =>
                a +
                (b.qty) *
                  (b.lego?.price.amount || 0),
              0
            ) * 100
        ) / 100
      ).toFixed(2);
    } else {
      return (
        Math.round(
          this.product?.partsUsed.filter(part => part?.lego?.deliveryChannel === filter)
            ?.reduce(
              (a, b) =>
                a +
                (b.qty) *
                  (b.lego?.price.amount || 0),
              0
            ) * 100
        ) / 100
      ).toFixed(2);
    }
  }

  onRemoveParts() {
    this.confirmationService.confirm({
      message: 'Do you want to remove these parts from the current Parts List?',
      header: 'Delete Confirmation',
      icon: 'fa fa-circle-info',
      accept: () => {
        this.bulkAction.emit({ action: 'removePartsFromSelectedSet', parts: this.product.partsUsed });
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

  async onExportPdf() {
    const columns: ColumnInput[] = [
      { header: 'DesignId', dataKey: 'designId' },
      { header: 'ElementId', dataKey: 'elementId' },
      { header: 'Image', dataKey: 'image' },
      { header: 'Color', dataKey: 'color' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'BrickLink', dataKey: 'bricklink' },
      { header: 'PaB', dataKey: 'pab' },
    ];

    const rows = this.product.partsUsed.map(async part => {
      const color = await this.colorService.getColor(part.color);
      const imgUrl = await this.caclImageUrl(part)
        .then(imgUrl => imgUrl)
        .catch(e => './assets/placeholder.png');

      return {
        designId: part.designId,
        elementId: part.elementId,
        color: color?.name,
        quantity: part.qty,
        bricklink: part.maxPrice,
        pab: part.lego ? `${part.lego?.price.amount.toFixed(2)} ${part.lego?.price.currencyCode}` : '',
        imageUrl: imgUrl,
      };
    });

    var totalPagesExp = '{total_pages_count_string}';

    const partsListTitle = `${this.partsList.name} - ${this.product.id} - ${this.product?.name}`;

    const doc = new jsPDF('p', 'px', 'a4');
    autoTable(doc, {
      columns: columns,
      body: await Promise.all(rows),
      startY: 25,
      bodyStyles: { minCellHeight: 35 },
      rowPageBreak: 'avoid',
      didDrawCell: function (data) {
        if (data.column.dataKey === 'image' && data.cell.section === 'body') {
          const img = data.row.raw['imageUrl'];
          const dim = data.cell.height - data.cell.padding('vertical');
          const textPos = data.cell.getTextPos();
          doc.addImage(img, textPos.x, textPos.y, dim, dim);
        }
      },
      didDrawPage: function (data) {
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text(partsListTitle, data.settings.margin.left, 20);

        // Footer
        var str = 'Page ' + (doc.internal as any).getNumberOfPages();
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + ' of ' + totalPagesExp;
        }
        doc.setFontSize(10);

        // jsPDF 1.4+ uses getHeight, <1.4 uses .height
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save(
      `BrickHunter_${this.partsList.name}_${this.product.id}-${this.product.name}.pdf`
    );
  }

  caclImageUrl(part: Part) {
    if (part.source.source === 'BrickLink')
      return this.imageExists(`https://img.bricklink.com/ItemImage/PN/${part.source.color}/${part.source.id}.png`);
    return this.imageExists(`https://brickhunter.blob.core.windows.net/parts/pab/${part.elementId}.jpg`);
  }

  imageExists(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject();
      img.src = url;
    });
  }
}
