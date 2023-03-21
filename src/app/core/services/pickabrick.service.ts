import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IPart } from 'src/app/models/parts-list';
import { PartsListService } from 'src/app/parts-list/parts-list.service';

@Injectable()
export class PickABrickService {
  pabLoading = new Subject<boolean>();
  pabLoadError = '';

  constructor(private readonly partsListService: PartsListService) {}

  loadPaB(uuid: string) {
    this.pabLoadError = '';
    this.pabLoading.next(true);

    let elementIds: number[] = [];
    const partsList = this.partsListService.getPartsList(uuid);
    partsList.parts.map((item) => elementIds.push(...item.elementIds));

    chrome.runtime
      .sendMessage({
        service: 'pickABrick',
        action: 'findBrick',
        elementIds: elementIds,
      })
      .then((results) => {
        if (results.status) throw new Error(results.message);

        let parts: IPart[] = partsList.parts.map((part) => {
          if (!part.elementIds || part.elementIds.length === 0)
            return { ...part, lego: null };
          const pab = results.find((result) =>
            part.elementIds?.find((e) => e === Number(result.variant.id))
          );
          if (!pab) return { ...part, lego: null };

          part.lego = {
            elementId: Number(pab.variant.id),
            designNumber: Number(pab.variant.attributes.designNumber),
            price: {
              currencyCode: String(pab.variant.price.currencyCode),
              amount: Number(pab.variant.price.centAmount) / 100,
            },
            colourId: Number(pab.variant.attributes.colourId),
            deliveryChannel: String(pab.variant.attributes.deliveryChannel),
            inStock: Boolean(pab.inStock),
          };

          return part;
        });

        partsList.parts = parts;
        this.partsListService.updatePartsList(partsList);
        this.pabLoading.next(false);
      })
      .catch((e) => {
        this.pabLoadError = 'something went wrong';
        this.pabLoading.next(false);
      });
  }
}
