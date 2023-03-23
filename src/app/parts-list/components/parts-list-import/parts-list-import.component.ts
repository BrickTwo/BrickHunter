import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { ColorService } from 'src/app/core/services/color.service';
import { GuidService } from 'src/app/core/services/guid.service';
import { IBrickHunterV1, IBrickHunterV1Item } from 'src/app/models/brickhunter';
import {
  GetBrickLinkPartsRequest,
  GetBrickLinkPartsResponse,
  GetRebrickablePartsRequest,
  GetRebrickablePartsResponse,
} from 'src/app/models/brickhunter-api';
import { IBrickLinkWantedListItem } from 'src/app/models/bricklink';
import { IBrickLinkModel, IColor, IPart, IPartsList, IRebrickableModel } from 'src/app/models/parts-list';
import * as xml2js from 'xml2js';
import { PartsListService } from '../../parts-list.service';

@Component({
  selector: 'app-parts-list-import',
  templateUrl: './parts-list-import.component.html',
  styleUrls: ['./parts-list-import.component.scss'],
})
export class PartsListImportComponent {
  display = false;
  showImportDialog = false;
  importStep = 0;
  partsList: IPart[];
  wantedList: IBrickLinkWantedListItem[];
  brickhunterV1List: IBrickHunterV1;
  source: string;
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

    const fileReader = new FileReader();
    fileReader.onload = async event => {
      const fileContent = event.target?.result.toString();

      switch (file.type) {
        case 'text/xml':
          this.importForm.setValue({ partsListName: fileName });
          this.source = 'BrickLink';
          this.wantedList = await this.importXml(fileContent);
          break;
        case 'application/json':
          this.source = 'BrickHunterV1';
          this.brickhunterV1List = JSON.parse(fileContent) as IBrickHunterV1;
          this.importForm.setValue({ partsListName: this.brickhunterV1List.name });
          break;
        default:
          return;
      }
    };

    fileReader.readAsText(file);
  }

  onImport(importForm: NgForm) {
    this.showImportDialog = true;

    this.importStep = 1;

    if (this.source === 'BrickLink') {
      this.mapWantedListToParts();
    } else {
      this.mapBrickHunterV1ToParts();
    }

    const partIds = this.partsList.map(item => {
      return item.externalId;
    });

    this.importStep = 2;
    const getRebrickableRequest: GetRebrickablePartsRequest = { source: this.source, ids: partIds };
    const partsList$ = this.brickHunterApiService.getRebrickableParts(getRebrickableRequest).pipe(
      map(responseRebrickableParts => {
        return this.transformRebrickableData(responseRebrickableParts);
      }),
      switchMap(parts => {
        this.importStep = 3;
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
          source: this.source,
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

  private transformRebrickableData(rebrickableDatas: GetRebrickablePartsResponse[]) {
    return this.partsList.map(part => {
      const rebrickableData = rebrickableDatas.find(resp => {
        return resp.externalIds.find(
          e => e.externalId === part.externalId && e.source.toLowerCase() === part.source.source.toLowerCase()
        );
      });

      let color: IColor;
      if (this.source === 'Lego' && part.color === 0) {
        var foundElement = rebrickableData?.elementIds.find(e => Number(e.elementId) === part.elementId);
        if (foundElement) {
          color = this.colorService.getColor(foundElement.colorId, 'Rebrickable');
        } else {
          color = this.colorService.getColor(-1);
        }
      } else {
        color = this.colorService.getColor(part.source.color, this.source);
      }

      part.color = color.id;

      if (rebrickableData) {
        let elementIds = rebrickableData.elementIds
          .filter(e => e.colorId == color.id)
          .map(item => item.elementId)
          .map(id => Number(id));

        const rebrickable: IRebrickableModel = {
          partNum: rebrickableData.partNum,
          color: color.id,
          name: rebrickableData.name,
          imageUrl: rebrickableData.imageUrl,
          partCatId: rebrickableData.partCatId,
          yearFrom: rebrickableData.yearFrom,
          yearTo: rebrickableData.yearTo,
          isPrint: rebrickableData.isPrint,
          externalIds: rebrickableData.externalIds,
        };

        part.elementIds = elementIds;
        part.rebrickable = rebrickable;
      }

      part.elementIds = part.elementIds?.map(id => id).sort((a, b) => b - a); // numerical sort desc
      if (this.source === 'BrickLink') part.elementId = part.elementIds[0];

      return part;
    });
  }

  private transformBrickLinkData(parts: IPart[], brickLinkData: GetBrickLinkPartsResponse[]) {
    return parts.map(part => {
      // let part = { ...item };
      // part.elementIds = [...part.elementIds];

      const resp = brickLinkData.find(resp => resp.itemNo === part.source.id);
      if (resp) {
        const colorInfo = resp.colors.find(c => c.colorId === part.color);
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

        var additionalElementIds = resp.elementIds
          .filter(el => el.colorId === part.source.color)
          .filter(o => !part.elementIds.some(i => i === o.elementId))
          .map(el => el.elementId);

        if (additionalElementIds.length) part.elementIds.push(...additionalElementIds);
        part.brickLink = brickLink;
      }

      part.elementIds = part.elementIds?.map(id => id).sort((a, b) => b - a); // numerical sort desc
      if (this.source === 'BrickLink') part.elementId = part.elementIds[0];

      return part;
    });
  }

  private mapWantedListToParts() {
    this.partsList = this.wantedList.map(item => {
      const color = this.colorService.getColor(item.color, this.source);

      const part: IPart = {
        id: `${item.itemId}+${item.color}`,
        externalId: item.itemId,
        designId: item.itemId,
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
          source: this.source,
          id: item.itemId,
          color: item.color,
        },
      };

      return part;
    });
  }

  private mapBrickHunterV1ToParts() {
    if (this.brickhunterV1List.source === 'brickLink') {
      this.source = 'BrickLink';
      this.wantedList = this.brickhunterV1List.positions.map(position => {
        let item: IBrickLinkWantedListItem = {
          color: Number(position.color.brickLinkId),
          condition: position.brickLink.wantedList.condition,
          itemId: position.designId,
          itemType: position.brickLink.wantedList.itemtype,
          maxPrice: position.brickLink.wantedList.maxprice,
          minQty: position.qty.min,
          qtyFilled: position.qty.have,
          notify: position.brickLink.wantedList.notify === 'Y' ? true : false,
          remarks: position.brickLink.wantedList.remarks,
        };

        return item;
      });

      this.mapWantedListToParts();
    } else {
      this.source = 'Lego';
      this.partsList = this.brickhunterV1List.positions.map(item => {
        const part: IPart = {
          id: String(item.itemNumber),
          externalId: String(item.designId),
          designId: item.designId,
          elementId: item.itemNumber,
          elementIds: [],
          color: 0,
          qty: item.qty.min,
          have: item.qty.have,
          itemType: '',
          maxPrice: 0,
          condition: '',
          notify: false,
          remarks: '',
          source: {
            source: 'Lego',
            id: String(item.itemNumber),
            color: Number(item.color.brickLinkId),
          },
        };
        return part;
      });
    }
  }
}
