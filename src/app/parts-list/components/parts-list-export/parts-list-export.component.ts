import { Component } from '@angular/core';
import { PartsListService } from '../../services/parts-list.service';
import { ColorService } from 'src/app/core/services/color.service';
import { Part, PartsList } from 'src/app/models/parts-list';
import * as xml2js from 'xml2js';
import { BrickHunterV2, BrickHunterV2Item } from 'src/app/models/brickhunter';
import autoTable, { ColumnInput } from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { ImportService } from '../../services/import.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-parts-list-export',
  templateUrl: './parts-list-export.component.html',
  styleUrls: ['./parts-list-export.component.scss'],
})
export class PartsListExportComponent {
  display = false;
  partsList: PartsList;

  filterOptions: any[] = [
    { name: 'All', value: 'all' },
    { name: 'PaB Bestseller', value: 'pab' },
    { name: 'PaB Standard', value: 'bap' },
    { name: 'PaB Out Of Stock', value: 'oos' },
    { name: 'BrickLink', value: 'brickLink' },
    { name: 'Warnings', value: 'warning' },
  ];
  selectedFilterValue: string = 'all';

  exportToOptions: any[] = [
    { name: 'PDF', value: 'pdf' },
    { name: 'BrickHunter', value: 'brickHunter' },
    { name: 'BrickLink', value: 'brickLink' },
    { name: 'CSV', value: 'csv' },
  ];
  selectedExportToValue: string = 'pdf';

  constructor(
    private readonly partsListService: PartsListService,
    private readonly colorService: ColorService,
    private readonly importService: ImportService
  ) {}

  public open(partsListUuid: string) {
    this.display = true;
    this.partsList = this.partsListService.getPartsList(partsListUuid);
  }

  async onExport() {
    switch (this.selectedExportToValue) {
      case 'pdf':
        this.exportPDF();
        break;
      case 'brickHunter':
        this.exportBrickHunter();
        break;
      case 'brickLink':
        await this.exportBrickLink();
        break;
      case 'csv':
        this.exportCsv();
        break;
    }
  }

  onClose() {
    this.display = false;
  }

  async exportPDF() {
    const columns: ColumnInput[] = [
      { header: 'DesignId', dataKey: 'designId' },
      { header: 'ElementId', dataKey: 'elementId' },
      { header: 'Image', dataKey: 'image' },
      { header: 'Color', dataKey: 'color' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'BrickLink', dataKey: 'bricklink' },
      { header: 'PaB', dataKey: 'pab' },
    ];

    const rows = this.partsListService.getParts(this.partsList.uuid, this.selectedFilterValue).map(async part => {
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
      this.filterOptions.find(o => o.value === this.selectedFilterValue).name
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

    doc.save(
      `BrickHunter_${this.partsList.name}-${
        this.filterOptions.find(o => o.value === this.selectedFilterValue).name
      }.pdf`
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

  exportBrickHunter() {
    const parts = this.partsListService.getParts(this.partsList.uuid, this.selectedFilterValue).map(part => {
      delete part.rebrickable;
      delete part.lego;
      delete part.brickLink;
      return part as BrickHunterV2Item;
    });

    const partsList: BrickHunterV2 = {
      name: this.partsList.name,
      source: this.partsList.source,
      version: '2.0',
      parts: parts,
    };

    let data = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(partsList));

    var a = document.createElement('a');
    a.href = data;
    a.target = '_blank';
    a.download = `BrickHunter_${this.partsList.name}-${
      this.filterOptions.find(o => o.value === this.selectedFilterValue).name
    }.json`;
    a.click();
  }

  async exportBrickLink() {
    new Observable<number>(subscriber => {
      let syncList: BrickHunterV2 = this.partsList as unknown as BrickHunterV2;
      syncList.version = '2.0';
      this.importService.import(subscriber, this.partsList.name, 'BrickHunter', syncList, this.partsList.uuid);
    }).subscribe({
      complete: async () => {
        let xmlContent = 'data:text/xml;charset=utf-8,';
        xmlContent += await this.creatXml();
        const data = encodeURI(xmlContent);

        var a = document.createElement('a');
        a.href = data;
        a.target = '_blank';
        a.download = `WantedList_${this.partsList.name}-${
          this.filterOptions.find(o => o.value === this.selectedFilterValue).name
        }.xml`;
        a.click();
      },
    });
  }

  async creatXml(withHeader = true) {
    var wantedList = await this.createBrickLinkObject();
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(wantedList);
    if (withHeader) return xml;
    var startpos = xml.substr(xml).indexOf('>') + 2;
    return xml.substr(startpos, xml.length);
  }

  async createBrickLinkObject() {
    let wantedList = { INVENTORY: Array() };

    const parts = this.partsListService.getParts(this.partsList.uuid, this.selectedFilterValue);

    parts.map(async part => {
      const color = await this.colorService.getColor(part.color);

      if (part.brickLink) {
        let item = {
          ITEM: {
            ITEMTYPE: part.brickLink.itemType,
            ITEMID: part.brickLink.itemNo,
            COLOR: part.color !== 9999 ? color.externalIds.brickLink.extIds[0] : '',
            MAXPRICE: part.maxPrice,
            MINQTY: part.qty,
            QTYFILLED: part.have,
            CONDITION: part.condition,
            NOTIFY: part.notify,
            REMARKS: part.remarks,
          },
        };

        Object.keys(item.ITEM).forEach(key => {
          if (item.ITEM[key] == null) {
            delete item.ITEM[key];
          }
        });

        wantedList.INVENTORY.push(item);
      }
    });

    return wantedList;
  }

  exportCsv() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    //csvContent += this.createHeaderLineToCSV();
    let csvLine = '';

    csvLine = this.addToCSVLine(csvLine, 'Design Id');
    csvLine = this.addToCSVLine(csvLine, 'Element Id');
    csvLine = this.addToCSVLine(csvLine, 'Color');
    csvLine = this.addToCSVLine(csvLine, 'Quantity');
    csvLine = this.addToCSVLine(csvLine, 'Have');
    csvLine = this.addToCSVLine(csvLine, 'BrickLink Price');
    csvLine = this.addToCSVLine(csvLine, 'PaB Delivery Channel');
    csvLine = this.addToCSVLine(csvLine, 'PaB Price');
    csvLine = this.addToCSVLine(csvLine, 'PaB Currency');

    csvContent += csvLine;
    csvContent += '\n';

    const parts = this.partsListService.getParts(this.partsList.uuid, this.selectedFilterValue);

    parts.forEach(part => {
      let csvLine = '';
      // general options

      csvLine = this.addToCSVLine(csvLine, part.designId ? part.designId : '');
      csvLine = this.addToCSVLine(csvLine, part.elementId ? String(part.elementId) : '');
      csvLine = this.addToCSVLine(csvLine, part.color ? String(part.color) : '');
      csvLine = this.addToCSVLine(csvLine, part.qty ? String(part.qty) : '');
      csvLine = this.addToCSVLine(csvLine, part.have ? String(part.have) : '');
      csvLine = this.addToCSVLine(csvLine, part.maxPrice ? String(part.maxPrice) : '');
      csvLine = this.addToCSVLine(csvLine, part.lego?.deliveryChannel ? part.lego?.deliveryChannel : '');
      csvLine = this.addToCSVLine(csvLine, part.lego?.price?.amount ? String(part.lego?.price.amount) : '');
      csvLine = this.addToCSVLine(csvLine, part.lego?.price?.currencyCode ? String(part.lego?.price.currencyCode) : '');

      csvContent += csvLine;
      csvContent += '\n';
    });
    const data = encodeURI(csvContent);

    var a = document.createElement('a');
    a.href = data;
    a.target = '_blank';
    a.download = `BrickHunter_${this.partsList.name}-${
      this.filterOptions.find(o => o.value === this.selectedFilterValue).name
    }.csv`;
    a.click();
  }

  addToCSVLine(line: string, value: string) {
    line += value;
    line += ',';
    return line;
  }
}
