import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable, { Cell, CellDef, ColumnInput } from 'jspdf-autotable';
import { ColorService } from 'src/app/core/services/color.service';
import { IPart, IPartsList } from 'src/app/models/parts-list';
import { PartsListService } from '../../services/parts-list.service';

@Component({
  selector: 'app-parts-list-pdf',
  templateUrl: './parts-list-pdf.component.html',
  styleUrls: ['./parts-list-pdf.component.scss'],
})
export class PartsListPdfComponent {
  display = false;
  partsList: IPartsList;
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

  onExport() {
    const columns: ColumnInput[] = [
      { header: 'DesignId', dataKey: 'designId' },
      { header: 'ElementId', dataKey: 'elementId' },
      // { header: 'Image', dataKey: 'image' },
      { header: 'Color', dataKey: 'color' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'BrickLink', dataKey: 'bricklink' },
      { header: 'PaB', dataKey: 'pab' },
    ];

    const rows = this.getParts(this.selectedValue).map(part => {
      const color = this.colorService.getColor(part.color);

      return {
        desingId: part.designId,
        elementId: part.elementId,
        color: color?.name,
        quantity: part.qty,
        bricklink: part.maxPrice,
        pab: part.lego?.price.amount,
      };
    });

    var totalPagesExp = '{total_pages_count_string}';

    console.log(this.partsList?.name);
    const partsListTitle = `${this.partsList?.name} - ${
      this.printOptions.find(o => o.value === this.selectedValue).name
    }`;

    const doc = new jsPDF('p', 'px', 'a4');
    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: 25,
      // didParseCell: data => {
      // if (data.column.dataKey === 'image' && data.cell.section === 'body') {
      //   var img =
      //     this.caclImageUrl(this.partsList.parts[data.row.index]) + '?r=' + Math.floor(Math.random() * 100000);
      //   var dim = data.cell.height - data.cell.padding('vertical');
      //   var textPos = data.cell.getTextPos();
      //   data.cell.contentHeight = 150;
      //   doc.addImage(img, textPos.x, textPos.y, 10, 10);
      //   console.log(data);
      // }
      // },
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

  getParts(filter: string): IPart[] {
    switch (filter) {
      case 'pab':
      case 'bap':
        return this.partsList?.parts?.filter(p => p.lego?.deliveryChannel === filter);
      case 'oos':
        return this.partsList?.parts?.filter(p => p.lego?.inStock === false);
      case 'brickLink':
        return this.partsList?.parts?.filter(p => !p.lego);
      case 'warning':
        return this.partsList?.parts?.filter(p => {
          if (p.lego?.inStock === false) return true;
          if (p.lego && p.lego.maxOrderQuantity < p.qty) return true;
          return false;
        });
      default:
        return this.partsList?.parts;
    }
  }

  onClose() {
    this.display = false;
  }

  // private caclImageUrl(part: IPart) {
  //   if (part.source.source === 'BrickLink')
  //     return `https://img.bricklink.com/ItemImage/PN/${part.source.color}/${part.source.id}.png`;
  //   return `https://brickhunter.blob.core.windows.net/parts/pab/${part.elementId}.jpg`;
  // }

  // private toDataURL(url: string, callback: Function) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.onload = function () {
  //     var reader = new FileReader();
  //     reader.onloadend = function () {
  //       callback(reader.result);
  //     };
  //     reader.readAsDataURL(xhr.response);
  //   };
  //   xhr.open('GET', url);
  //   xhr.responseType = 'blob';
  //   xhr.send();
  // }
}
