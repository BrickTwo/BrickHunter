import { Injectable } from '@angular/core';
import { catchError, from, map, Subscriber, switchMap } from 'rxjs';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { ColorService } from 'src/app/core/services/color.service';
import { GuidService } from 'src/app/core/services/guid.service';
import { BrickHunterV1, BrickHunterV2 } from 'src/app/models/brickhunter';
import {
  GetBrickLinkPartsRequest,
  GetBrickLinkPartsResponse,
  GetRebrickablePartsRequest,
  GetRebrickablePartsResponse,
} from 'src/app/models/brickhunter-api';
import { BrickLinkWantedListItem } from 'src/app/models/bricklink';
import { BrickLinkModel, Part, PartsList, RebrickableModel } from 'src/app/models/parts-list';
import { PartsListService } from './parts-list.service';
import { Color } from 'src/app/models/shared';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  constructor(
    private readonly brickHunterApiService: BrickHunterApiService,
    private readonly colorService: ColorService,
    private readonly partsListService: PartsListService,
    private readonly guidService: GuidService
  ) {}

  async import(
    importStep$: Subscriber<number>,
    partsListName: string,
    source: string,
    parts: BrickLinkWantedListItem[] | BrickHunterV1 | BrickHunterV2,
    uuid: string = null
  ) {
    importStep$.next(1);

    let partsList: Part[];

    if (source === 'BrickLink') {
      partsList = await this.mapWantedListToParts(parts as BrickLinkWantedListItem[], source);
    } else {
      if ((parts as BrickHunterV2).version === '2.0') {
        const mapResponse = await this.mapBrickHunterV2ToParts(parts as BrickHunterV2);
        partsList = mapResponse.parts;
        source = mapResponse.source;
      } else {
        const mapResponse = await this.mapBrickHunterV1ToParts(parts as BrickHunterV1);
        partsList = mapResponse.parts;
        source = mapResponse.source;
      }
    }

    const partIdsBrickLink = partsList.filter(item => item.source.source === "BrickLink").map(item => {
      return item.externalId;
    });
    const partIdsLego = partsList.filter(item => item.source.source === "Lego").map(item => {
      return item.externalId;
    });

    importStep$.next(2);
    const getRebrickableRequest: GetRebrickablePartsRequest[] = [{ source: "BrickLink", ids: partIdsBrickLink },{ source: "Lego", ids: partIdsLego }];

    this.brickHunterApiService
      .getRebrickableParts(getRebrickableRequest)
      .pipe(
        map(responseRebrickableParts => {
          return from(this.transformRebrickableData(responseRebrickableParts, partsList));
        }),
        switchMap(parts => parts),
        switchMap(parts => {
          importStep$.next(3);
          const externalIds = parts.map(p => {
            return p.rebrickable?.externalIds.find(e => e.source === 'BrickLink')?.externalId;
          });
          const request: GetBrickLinkPartsRequest = { itemNumbers: externalIds };
          return this.brickHunterApiService.getBrickLinkParts(request).pipe(
            map(responseBrickLinkParts => {
              return this.transformBrickLinkData(parts, responseBrickLinkParts);
            })
          );
        }),
        catchError(errorForFirstOrSecondCall => {
          throw new Error('Error: ' + errorForFirstOrSecondCall.message);
        })
      )
      .subscribe({
        next: (parts: Part[]) => {
          const partsList: PartsList = {
            uuid: uuid ? uuid : this.guidService.generate(),
            name: partsListName,
            source: source,
            parts: parts,
          };
          uuid ? this.partsListService.updatePartsList(partsList) : this.partsListService.addPartsList(partsList);
          importStep$.complete();
        },
        error: err => {
          importStep$.error('Something went wrong!');
        },
      });
  }

  private transformRebrickableData(rebrickableDatas: GetRebrickablePartsResponse[], partsList: Part[]) {
    const resp = partsList.map(async part => {
      let rebrickableData = rebrickableDatas.find(resp => {
        if (resp.source === 'Lego') {
          return resp.elementIds.find(e => e.elementId === part.elementId);
        } else {
          return resp.externalIds.find(
            e => e.externalId === part.externalId && e.source.toLowerCase() === part.source.source.toLowerCase()
          );
        }
      });

      let color: Color;
      if (rebrickableData?.source === 'Lego' && part.color === 0) {
        var foundElement = rebrickableData?.elementIds.find(e => Number(e.elementId) === part.elementId);
        if (foundElement) {
          color = await this.colorService.getColor(foundElement.colorId, 'Rebrickable');
        } else {
          color = await this.colorService.getColor(-1);
        }
      } else {
        color = await this.colorService.getColor(part.source.color, rebrickableData?.source);
      }

      part.color = color.id;

      if (!rebrickableData) {
        rebrickableData = rebrickableDatas.find(resp => {
          return resp.elementIds.find(e => e.colorId === color.id);
        });
      }

      if (rebrickableData) {
        let elementIds = rebrickableData.elementIds
          .filter(e => (color.id !== 9999 ? e.colorId == color.id : 9999))
          .map(item => item.elementId)
          .map(id => Number(id));

        const rebrickable: RebrickableModel = {
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
      if (!part.elementIds.length && part.elementId) part.elementIds.push(part.elementId);
      if (rebrickableData?.source === 'BrickLink') part.elementId = part.elementIds[0];
      if (part.color === 9999) part.elementId = undefined;

      return part;
    });

    return Promise.all(resp);
  }

  private transformBrickLinkData(parts: Part[], brickLinkData: GetBrickLinkPartsResponse[]) {
    return parts.map(part => {
      const resp = brickLinkData.find(
        resp => resp.itemNo === part.rebrickable?.externalIds.find(e => e.source === 'BrickLink')?.externalId
      );
      if (resp) {
        const colorInfo = resp.colors.find(c => c.colorId === part.color);
        let yearColor = 0;
        let yearToColor = 0;
        if (colorInfo) {
          yearColor = colorInfo.yearFrom;
          yearToColor = colorInfo.yearTo;
        }

        const brickLink: BrickLinkModel = {
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
          .filter(el => (part.color !== 9999 ? el.colorId === part.source.color : true))
          .filter(o => !part.elementIds.some(i => i === o.elementId))
          .map(el => el.elementId);

        if (additionalElementIds.length) part.elementIds.push(...additionalElementIds);
        part.brickLink = brickLink;
      }

      part.elementIds = part.elementIds?.map(id => id).sort((a, b) => b - a); // numerical sort desc
      if (part.source.source === 'BrickLink' || !part.elementId) part.elementId = part.elementIds[0];
      if (part.color === 9999) part.elementId = undefined;

      return part;
    });
  }

  private async mapWantedListToParts(wantedList: BrickLinkWantedListItem[], source: string) {
    const resp = wantedList.map(async item => {
      const color = await this.colorService.getColor(item.color, source);

      const part: Part = {
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
          source: source,
          id: item.itemId,
          color: item.color,
        },
      };

      return part;
    });

    return await Promise.all(resp);
  }

  private async mapBrickHunterV1ToParts(brickhunterV1List: BrickHunterV1) {
    if (brickhunterV1List.source.toLowerCase() === 'bricklink') {
      const wantedList = brickhunterV1List.positions.map(position => {
        let item: BrickLinkWantedListItem = {
          color: position.color ? Number(position.color.brickLinkId) : -1,
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

      return { parts: await this.mapWantedListToParts(wantedList, 'BrickLink'), source: 'BrickLink' };
    } else {
      const parts = brickhunterV1List.positions.map(item => {
        const part: Part = {
          id: String(item.itemNumber),
          externalId: String(item.designId),
          designId: String(item.designId),
          elementId: Number(item.itemNumber),
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

      return { parts: parts, source: 'Lego' };
    }
  }

  private async mapBrickHunterV2ToParts(brickhunterV2List: BrickHunterV2) {
    const parts: Part[] = brickhunterV2List.parts.map(item => item);

    return { parts: parts, source: brickhunterV2List.source };
  }
}
