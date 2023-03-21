import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { ColorService } from 'src/app/core/services/color.service';
import { GuidService } from 'src/app/core/services/guid.service';
import {
  GetBrickLinkPartsRequest,
  GetBrickLinkPartsResponse,
  GetRebrickablePartsRequest,
  GetRebrickablePartsResponse,
} from 'src/app/models/brickhunter-api';
import { IBrickLinkWantedListItem } from 'src/app/models/bricklink';
import { IBrickLinkModel, IPart, IPartsList, IRebrickableModel } from 'src/app/models/parts-list';
import * as xml2js from 'xml2js';
import { PartsListService } from '../../parts-list.service';

@Component({
  selector: 'app-parts-list-import',
  templateUrl: './parts-list-import.component.html',
  styleUrls: ['./parts-list-import.component.scss'],
})
export class PartsListImportComponent {
  faCheck = faCheck;
  display = false;
  showImportDialog = false;
  importStep = 0;
  wantedList: IBrickLinkWantedListItem[];
  @ViewChild('importForm', { static: false }) importForm: NgForm;
  @ViewChild('fileUpload', { static: false }) fileUpload: any;

  clear() {
    this.fileUpload.clear();
  }
  constructor(
    private readonly messageService: MessageService,
    private readonly brickHunterApiService: BrickHunterApiService,
    private readonly colorService: ColorService,
    private readonly partsListService: PartsListService,
    private readonly guidService: GuidService
  ) {}

  public open() {
    this.display = true;
  }

  onHide() {
    this.importStep = 0;
    this.importForm.setValue({ partsListName: '' });
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

    this.importForm.setValue({ partsListName: fileName });

    const fileReader = new FileReader();
    fileReader.onload = async event => {
      const fileContent = event.target?.result.toString();
      this.wantedList = await this.importXml(fileContent);
    };

    fileReader.readAsText(file);
  }

  onImport(importForm: NgForm) {
    this.showImportDialog = true;

    const source = 'BrickLink';

    this.importStep = 1;
    const partIds = this.wantedList.map(item => {
      return item.itemId;
    });
    const getRebrickableRequest: GetRebrickablePartsRequest = { source: source, ids: partIds };
    const partsList$ = this.brickHunterApiService.getRebrickableParts(getRebrickableRequest).pipe(
      map(responseRebrickableParts => {
        return this.transformRebrickableData(responseRebrickableParts, source);
      }),
      switchMap(parts => {
        this.importStep = 2;
        const request: GetBrickLinkPartsRequest = { itemNumbers: partIds };
        return this.brickHunterApiService.getBrickLinkParts(request).pipe(
          map(responseBrickLinkParts => {
            return this.transformBrickLinkData(parts, responseBrickLinkParts);
          })
        );
      }),
      catchError(errorForFirstOrSecondCall => {
        throw new Error('Error: ' + errorForFirstOrSecondCall.message);
      })
    );

    // you can either store this variable as `this.character$` or immediately subscribe to it like:
    partsList$.subscribe(
      (parts: IPart[]) => {
        const partsList: IPartsList = {
          id: 0,
          uuid: this.guidService.generate(),
          name: importForm.value.partsListName,
          source: source,
          parts: parts,
        };
        this.partsListService.addPartsList(partsList);

        this.closeSideBar();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'New parts list has been successfully added!',
        });
      },
      errorForFirstOrSecondCall => {
        this.closeSideBar();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong!',
        });
      }
    );
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

  private transformRebrickableData(rebrickableData: GetRebrickablePartsResponse[], source: string) {
    return this.wantedList.map(item => {
      const color = this.colorService.getColor(item.color, source);

      const part: IPart = {
        id: `${item.itemId}+${item.color}`,
        elementId: 0,
        elementIds: [],
        color: color.id,
        qty: item.minQty,
        have: item.qtyFilled,
        itemType: item.itemType,
        maxPrice: item.maxPrice,
        condition: item.condition,
        notify: item.notify,
        remarks: item.remarks,
        source: {
          source: source,
          id: item.itemId,
          color: item.color,
        },
      };

      const resp = rebrickableData.find(resp => {
        return resp.externalIds.find(e => e.externalId === item.itemId && e.source === source);
      });

      if (resp) {
        const elementIds = resp.elementIds
          .filter(e => e.colorId == color.id)
          .map(item => item.elementId)
          .map(id => Number(id));

        const rebrickable: IRebrickableModel = {
          partNum: resp.partNum,
          color: color.id,
          name: resp.name,
          imageUrl: resp.imageUrl,
          partCatId: resp.partCatId,
          yearFrom: resp.yearFrom,
          yearTo: resp.yearTo,
          isPrint: resp.isPrint,
          externalIds: resp.externalIds,
        };

        part.elementIds = elementIds;
        part.rebrickable = rebrickable;
      }

      part.elementIds = part.elementIds?.map(id => id).sort((a, b) => b - a); // numerical sort desc
      part.elementId = part.elementIds[0];

      return part;
    });
  }

  private transformBrickLinkData(parts: IPart[], brickLinkData: GetBrickLinkPartsResponse[]) {
    return parts.map(item => {
      let part = { ...item };
      part.elementIds = [...part.elementIds];

      const resp = brickLinkData.find(resp => resp.itemNo === item.source.id);
      if (resp) {
        const colorInfo = resp.colors.find(c => c.colorId === item.color);
        let yearColor = 0;
        let yearToColor = 0;
        if (colorInfo) {
          yearColor = colorInfo.yearFrom;
          yearToColor = colorInfo.yearTo;
        }

        const brickLink: IBrickLinkModel = {
          itemId: resp.itemId,
          itemType: resp.itemType,
          itemNo: resp.itemNo,
          itemName: resp.itemName,
          year: resp.year,
          yearTo: resp.yearTo,
          yearColor: yearColor,
          yearToColor: yearToColor,
          weight: resp.weight,
          dimX: resp.dimX,
          dimY: resp.dimY,
          dimZ: resp.dimZ,
          dimXmm: resp.dimXmm,
          dimYmm: resp.dimYmm,
          dimZmm: resp.dimZmm,
          hasSound: resp.hasSound,
          isStickerPart: resp.isStickerPart,
        };

        var elmts = resp.elementIds
          .filter(el => el.colorId === item.source.color)
          .filter(o => !item.elementIds.some(i => i === o.elementId))
          .map(el => el.elementId);

        if (elmts.length) part.elementIds.push(...elmts);
        part.brickLink = brickLink;
      }

      part.elementIds = item.elementIds?.map(id => id).sort((a, b) => b - a); // numerical sort desc
      part.elementId = item.elementIds[0];

      return part;
    });
  }
}
