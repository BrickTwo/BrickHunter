import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable, { ColumnInput } from 'jspdf-autotable';
import { ColorService } from 'src/app/core/services/color.service';
import { Part, PartsList } from 'src/app/models/parts-list';
import { PartsListService } from '../../services/parts-list.service';

@Component({
  selector: 'app-parts-list-pdf',
  templateUrl: './parts-list-pdf.component.html',
  styleUrls: ['./parts-list-pdf.component.scss'],
})
export class PartsListPdfComponent {
  display = false;
  partsList: PartsList;
  printOptions: any[] = [
    { name: 'All', value: 'all' },
    { name: 'PaB Bestseller', value: 'pab' },
    { name: 'PaB Standard', value: 'bap' },
    { name: 'PaB Out Of Stock', value: 'oos' },
    { name: 'BrickLink', value: 'brickLink' },
    { name: 'Warnings', value: 'warning' },
  ];
  selectedValue: string = 'all';

  constructor(private readonly partsListService: PartsListService, private readonly colorService: ColorService) {}

  public open(partsListUuid: string) {
    this.display = true;
    this.partsList = this.partsListService.getPartsList(partsListUuid);
  }

  async onExport() {
    const columns: ColumnInput[] = [
      { header: 'DesignId', dataKey: 'designId' },
      { header: 'ElementId', dataKey: 'elementId' },
      { header: 'Image', dataKey: 'image' },
      { header: 'Color', dataKey: 'color' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'BrickLink', dataKey: 'bricklink' },
      { header: 'PaB', dataKey: 'pab' },
    ];

    const rows = this.partsListService.getParts(this.partsList.uuid, this.selectedValue).map(async part => {
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

    const partsListTitle = `${this.partsList?.name} - ${
      this.printOptions.find(o => o.value === this.selectedValue).name
    }`;

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

    doc.save(`${this.partsList.name}-${this.printOptions.find(o => o.value === this.selectedValue).name}.pdf`);
  }

  onClose() {
    this.display = false;
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

  checkImage(src, good, bad) {
    var img = new Image();
    try {
      img.src = src;
    } catch (e) {}
  }
}
