import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'dexie';
import { MessageService } from 'primeng/api';
import { IBrickHunterV1 } from 'src/app/models/brickhunter';
import { IBrickLinkWantedListItem } from 'src/app/models/bricklink';
import { IPart } from 'src/app/models/parts-list';
import * as xml2js from 'xml2js';
import { ImportService } from '../../services/import.service';

@Component({
  selector: 'app-parts-list-import',
  templateUrl: './parts-list-import.component.html',
  styleUrls: ['./parts-list-import.component.scss'],
})
export class PartsListImportComponent implements OnDestroy {
  display = false;
  showImportDialog = false;
  importStep = 0;
  partsList: IPart[];
  wantedList: IBrickLinkWantedListItem[];
  brickhunterV1List: IBrickHunterV1;
  source: string;
  subscription: Subscription;

  @ViewChild('form', { static: false }) form: NgForm;
  @ViewChild('fileUpload', { static: false }) fileUpload: any;

  clear() {
    this.fileUpload.clear();
  }
  constructor(private readonly messageService: MessageService, private importService: ImportService) {}

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public open() {
    this.display = true;
  }

  onHide() {
    this.importStep = 0;
    this.form.setValue({ partsListName: '' });
    this.fileUpload.clear();
  }

  closeSideBar() {
    this.showImportDialog = false;
    this.display = false;
    this.onHide();
  }

  onUpload(ee: any) {
    const file: File = ee.files[0];
    const fileName = file.name.split('.')[0];

    const fileReader = new FileReader();
    fileReader.onload = async event => {
      const fileContent = event.target?.result.toString();

      switch (file.type) {
        case 'text/xml':
          this.form.setValue({ partsListName: fileName });
          this.source = 'BrickLink';
          this.wantedList = await this.importXml(fileContent);
          break;
        case 'application/json':
          this.source = 'BrickHunterV1';
          this.brickhunterV1List = JSON.parse(fileContent) as IBrickHunterV1;
          this.form.setValue({ partsListName: this.brickhunterV1List.name });
          break;
        default:
          return;
      }
    };

    fileReader.readAsText(file);
  }

  onSubmit(importForm: NgForm) {
    this.showImportDialog = true;
    this.importService.step.subscribe(step => {
      if (this.importStep > 0 && step === 0 && !!this.importService.errorMessage) {
        this.closeSideBar();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.importService.errorMessage,
        });
      } else if (this.importStep > 0 && step === 0) {
        this.closeSideBar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New parts list has been successfully added!',
        });
      }

      this.importStep = step;

      if (step === 0) {
        if (this.subscription) this.subscription.unsubscribe();
      }
    });

    if (this.source === 'BrickLink') {
      this.importService.import(importForm.value.partsListName, this.source, this.wantedList);
    } else {
      this.importService.import(importForm.value.partsListName, this.source, this.brickhunterV1List);
    }
  }

  private importXml(content: string): IBrickLinkWantedListItem[] {
    const tagNameProcessor = [
      function (name: string) {
        switch (name) {
          case 'itemid':
            return 'itemId';
          case 'itemtype':
            return 'itemType';
          case 'maxprice':
            return 'maxPrice';
          case 'minqty':
            return 'minQty';
          case 'qtyfilled':
            return 'qtyFilled';
          default:
            return name;
        }
      },
    ];

    const valueProcessor = [
      function (value: string, name: string) {
        switch (name) {
          case 'color':
            return Number(value);
          case 'maxPrice':
            return Number(value);
          case 'minQty':
            return Number(value);
          case 'qtyFilled':
            return Number(value);
          case 'notify':
            return value === 'T' ? true : false;
          default:
            return value;
        }
      },
    ];

    const bb = xml2js
      .parseStringPromise(content, {
        normalizeTags: true,
        explicitArray: false,
        tagNameProcessors: tagNameProcessor,
        valueProcessors: valueProcessor,
      })
      .then(result => {
        return result.inventory.item as IBrickLinkWantedListItem[];
      })
      .catch(function (err) {
        // Failed
      });

    return bb;
  }
}
