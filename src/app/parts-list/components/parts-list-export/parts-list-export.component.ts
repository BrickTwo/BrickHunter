import { Component } from '@angular/core';
import { PartsListService } from '../../services/parts-list.service';
import { ColorService } from 'src/app/core/services/color.service';
import { PartsList } from 'src/app/models/parts-list';
import * as xml2js from 'xml2js';
import { BrickHunterV2, BrickHunterV2Item } from 'src/app/models/brickhunter';

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
    { name: 'BrickHunter', value: 'brickHunter' },
    { name: 'BrickLink', value: 'brickLink' },
    { name: 'CSV', value: 'csv' },
  ];
  selectedExportToValue: string = 'brickHunter';

  constructor(private readonly partsListService: PartsListService, private readonly colorService: ColorService) {}

  public open(partsListUuid: string) {
    this.display = true;
    this.partsList = this.partsListService.getPartsList(partsListUuid);
  }

  async onExport() {
    switch (this.selectedExportToValue) {
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
    a.download = `BrickHunter_${this.partsList.name}.json`;
    a.click();
  }

  async exportBrickLink() {
    let xmlContent = 'data:text/xml;charset=utf-8,';
    xmlContent += await this.creatXml();
    console.log(xmlContent);
    const data = encodeURI(xmlContent);

    var a = document.createElement('a');
    a.href = data;
    a.target = '_blank';
    a.download = 'WantedList.xml';
    a.click();
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
        var item = {
          ITEM: {
            ITEMTYPE: part.brickLink.itemType,
            ITEMID: part.brickLink.itemId,
            COLOR: part.color !== 9999 ? color.externalIds.brickLink.extIds[0] : '',
            MAXPRICE: part.maxPrice,
            MINQTY: part.qty,
            QTYFILLED: part.have,
            CONDITION: part.condition,
            NOTIFY: part.notify,
            REMARKS: part.remarks,
          },
        };
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
    a.download = 'BrickHunter.csv';
    a.click();
  }

  addToCSVLine(line: string, value: string) {
    line += value;
    line += ',';
    return line;
  }
}
