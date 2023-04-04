import { Injectable } from '@angular/core';
import { catchError, from, map, Subject, Subscriber, switchMap } from 'rxjs';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { ColorService } from 'src/app/core/services/color.service';
import { GuidService } from 'src/app/core/services/guid.service';
import { IBrickHunterV1 } from 'src/app/models/brickhunter';
import {
  GetBrickLinkPartsRequest,
  GetBrickLinkPartsResponse,
  GetRebrickablePartsRequest,
  GetRebrickablePartsResponse,
} from 'src/app/models/brickhunter-api';
import { IBrickLinkWantedListItem } from 'src/app/models/bricklink';
import { IBrickLinkModel, IColor, IPart, IPartsList, IRebrickableModel } from 'src/app/models/parts-list';
import { PartsListService } from './parts-list.service';

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
    parts: IBrickLinkWantedListItem[] | IBrickHunterV1
  ) {
    importStep$.next(1);

    let partsList: IPart[];

    if (source === 'BrickLink') {
      partsList = await this.mapWantedListToParts(parts as IBrickLinkWantedListItem[], source);
    } else {
      const mapResponse = await this.mapBrickHunterV1ToParts(parts as IBrickHunterV1);
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
        next: (parts: IPart[]) => {
          const partsList: IPartsList = {
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

  private transformRebrickableData(
    rebrickableDatas: GetRebrickablePartsResponse[],
    partsList: IPart[],
    source: string
  ) {
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

      let color: IColor;
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
      if (!part.elementIds.length && part.elementId) part.elementIds.push(part.elementId);
      if (source === 'BrickLink') part.elementId = part.elementIds[0];

      return part;
    });

    return Promise.all(resp);
  }

  private transformBrickLinkData(parts: IPart[], brickLinkData: GetBrickLinkPartsResponse[], source: string) {
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
      if (source === 'BrickLink') part.elementId = part.elementIds[0];

      return part;
    });
  }

  private async mapWantedListToParts(wantedList: IBrickLinkWantedListItem[], source: string) {
    const resp = wantedList.map(async item => {
      const color = await this.colorService.getColor(item.color, source);

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
          source: source,
          id: item.itemId,
          color: item.color,
        },
      };

      return part;
    });

    return await Promise.all(resp);
  }

  private async mapBrickHunterV1ToParts(brickhunterV1List: IBrickHunterV1) {
    if (brickhunterV1List.source.toLowerCase() === 'bricklink') {
      const wantedList = brickhunterV1List.positions.map(position => {
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

      return { parts: await this.mapWantedListToParts(wantedList, 'BrickLink'), source: 'BrickLink' };
    } else {
      const parts = brickhunterV1List.positions.map(item => {
        const part: IPart = {
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
