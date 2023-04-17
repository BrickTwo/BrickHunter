import { Injectable } from '@angular/core';
import { catchError, from, map, Subscriber, switchMap } from 'rxjs';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { ColorService } from 'src/app/core/services/color.service';
import { GuidService } from 'src/app/core/services/guid.service';
import { BrickHunterV1 } from 'src/app/models/brickhunter';
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
    parts: BrickLinkWantedListItem[] | BrickHunterV1
  ) {
    importStep$.next(1);

    let partsList: Part[];

    if (source === 'BrickLink') {
      partsList = await this.mapWantedListToParts(parts as BrickLinkWantedListItem[], source);
    } else {
      const mapResponse = await this.mapBrickHunterV1ToParts(parts as BrickHunterV1);
      partsList = mapResponse.parts;
      source = mapResponse.source;
    }

    const partIds = partsList.map(item => {
      return item.externalId;
    });

    importStep$.next(2);
    const getRebrickableRequest: GetRebrickablePartsRequest = { source: source, ids: partIds };

    this.brickHunterApiService
      .getRebrickableParts(getRebrickableRequest)
      .pipe(
        map(responseRebrickableParts => {
          return from(this.transformRebrickableData(responseRebrickableParts, partsList, source));
        }),
        switchMap(parts => parts),
        switchMap(parts => {
          importStep$.next(3);
          const request: GetBrickLinkPartsRequest = { itemNumbers: partIds };
          return this.brickHunterApiService.getBrickLinkParts(request).pipe(
            map(responseBrickLinkParts => {
              return this.transformBrickLinkData(parts, responseBrickLinkParts, source);
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
            uuid: this.guidService.generate(),
            name: partsListName,
            source: source,
            parts: parts,
          };
          this.partsListService.addPartsList(partsList);
          importStep$.complete();
        },
        error: err => {
          importStep$.error('Something went wrong!');
        },
      });
  }

  private transformRebrickableData(rebrickableDatas: GetRebrickablePartsResponse[], partsList: Part[], source: string) {
    const resp = partsList.map(async part => {
      const rebrickableData = rebrickableDatas.find(resp => {
        if (source === 'Lego') {
          return resp.elementIds.find(e => e.elementId === part.elementId);
        } else {
          return resp.externalIds.find(
            e => e.externalId === part.externalId && e.source.toLowerCase() === part.source.source.toLowerCase()
          );
        }
      });

      let color: Color;
      if (source === 'Lego' && part.color === 0) {
        var foundElement = rebrickableData?.elementIds.find(e => Number(e.elementId) === part.elementId);
        if (foundElement) {
          color = await this.colorService.getColor(foundElement.colorId, 'Rebrickable');
        } else {
          color = await this.colorService.getColor(-1);
        }
      } else {
        color = await this.colorService.getColor(part.source.color, source);
      }

      part.color = color.id;

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
      if (source === 'BrickLink') part.elementId = part.elementIds[0];
      if (part.color === 9999) part.elementId = undefined;

      return part;
    });

    return Promise.all(resp);
  }

  private transformBrickLinkData(parts: Part[], brickLinkData: GetBrickLinkPartsResponse[], source: string) {
    return parts.map(part => {
      const resp = brickLinkData.find(resp => resp.itemNo === part.source.id);
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
      if (source === 'BrickLink') part.elementId = part.elementIds[0];
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
}
