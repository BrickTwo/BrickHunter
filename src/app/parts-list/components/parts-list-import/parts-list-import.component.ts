import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Subscription } from 'dexie';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { BrickHunterV1 } from 'src/app/models/brickhunter';
import { BrickLinkWantedListItem } from 'src/app/models/bricklink';
import { Part } from 'src/app/models/parts-list';
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
  partsList: Part[];
  wantedList: BrickLinkWantedListItem[];
  brickhunterV1List: BrickHunterV1;
  source: string;
  subscription$: Subscription;

  // @ViewChild('form', { static: false }) form: NgForm;
  @ViewChild('fileUpload', { static: false }) fileUpload: any;

  form = new FormGroup({
    partsListName: new FormControl(),
    content: new FormControl(),
  });

  clear() {
    this.fileUpload.clear();
  }
  constructor(private readonly messageService: MessageService, private importService: ImportService) {}

  ngOnDestroy(): void {
    if (this.subscription$) this.subscription$.unsubscribe();
  }

  public open() {
    this.display = true;
  }

  onHide() {
    this.importStep = 0;
    this.form.patchValue({ partsListName: '' });
    this.form.patchValue({ content: '' });
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
      this.form.patchValue({ content: fileContent });

      switch (file.type) {
        case 'text/xml':
          this.form.patchValue({ partsListName: fileName });
          this.source = 'BrickLink';
          this.wantedList = await this.importXml(fileContent);
          break;
        case 'application/json':
          this.source = 'BrickHunterV1';
          this.brickhunterV1List = JSON.parse(fileContent) as BrickHunterV1;
          this.form.patchValue({ partsListName: this.brickhunterV1List.name });
          break;
        default:
          return;
      }
    };

    fileReader.readAsText(file);
  }

  async onSubmit() {
    this.showImportDialog = true;

    const content = this.form.value.content;

    if (!this.hasJsonStructure(content)) {
      this.source = 'BrickLink';
      this.wantedList = await this.importXml(content);
    } else {
      this.source = 'BrickHunterV1';
      this.brickhunterV1List = JSON.parse(content) as BrickHunterV1;
    }

    this.subscription$ = new Observable<number>(subscriber => {
      if (this.source === 'BrickLink') {
        this.importService.import(subscriber, this.form.value.partsListName, this.source, this.wantedList);
      } else {
        this.importService.import(subscriber, this.form.value.partsListName, this.source, this.brickhunterV1List);
      }
    }).subscribe({
      next: step => {
        this.importStep = step;
      },
      complete: () => {
        this.closeSideBar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New parts list has been successfully added!',
        });
      },
      error: error => {
        this.closeSideBar();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  private importXml(content: string): BrickLinkWantedListItem[] {
    const tagNameProcessor = [
      function (name: string) {
        switch (name) {
          case 'itemid':
            return 'itemId';
          case 'itemtype':
            return 'itemType';
          case 'maxprice':
            return 'maxPrice';
          case 'price':
              return 'maxPrice';
          case 'minqty':
            return 'minQty';
          case 'qty':
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
        if(!Array.isArray(result.inventory.item)) {
          return [result.inventory.item] as BrickLinkWantedListItem[];
        }

        return result.inventory.item as BrickLinkWantedListItem[];
      })
      .catch(function (err) {
        // Failed
      });

    return bb;
  }

  private hasJsonStructure(str: string) {
    if (typeof str !== 'string') return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }
}
