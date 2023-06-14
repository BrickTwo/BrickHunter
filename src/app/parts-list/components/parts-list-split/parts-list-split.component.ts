import { Component } from '@angular/core';
import { Part, PartsList } from 'src/app/models/parts-list';
import { PartsListService } from '../../services/parts-list.service';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';
import { GuidService } from 'src/app/core/services/guid.service';
import { FormControl, FormGroup } from '@angular/forms';

interface Summary {
  pab: SummaryDetail;
  bap: SummaryDetail;
  brickLink: SummaryDetail;
}

interface SummaryDetail {
  lots: number;
  pieces: number;
  price: number;
}

@Component({
  selector: 'app-parts-list-split',
  templateUrl: './parts-list-split.component.html',
  styleUrls: ['./parts-list-split.component.scss'],
})
export class PartsListSplitComponent {
  display = false;
  partsList: PartsList;
  minValue = 13;
  maxLot = 150;
  counter = 0;
  newPartsLists: { index: number; partsList: PartsList }[] = [];
  newPartsListSummary: Summary[] = [];
  listCountBestseller = 0;
  listCountStandard = 0;
  minPaBPrice = 13;
  minBaPPrice = 13;

  form = new FormGroup({
    partsListName: new FormControl(),
  });

  constructor(
    private readonly partsListService: PartsListService,
    private readonly globalSettingsService: GlobalSettingsService,
    private readonly guidService: GuidService
  ) {}

  public open(partsList: PartsList) {
    this.display = true;
    this.partsList = { ...partsList };

    this.form.patchValue({ partsListName: this.partsList.name });

    this.split();
  }

  closeSideBar() {
    this.display = false;
  }

  async onSubmit() {
    let index = 1;
    this.newPartsLists.forEach(partsList => {
      partsList.partsList.name = `${this.form.value.partsListName} ${index}`;
      this.partsListService.addPartsList(partsList.partsList);
      index++;
    });

    this.closeSideBar();
  }

  private split() {
    this.listCountBestseller = this.calculateAmountOfCarts('pab');
    this.listCountStandard = this.calculateAmountOfCarts('bap');

    this.counter = this.listCountBestseller;
    if (this.counter < this.listCountStandard) this.counter = this.listCountStandard;

    for (let i = 0; i < this.counter; i++) {
      this.newPartsLists[i] = {
        index: i,
        partsList: {
          uuid: this.guidService.generate(),
          name: 'partsListName',
          source: '',
          parts: [],
        },
      };

      this.newPartsListSummary[i] = {
        pab: {
          lots: 0,
          pieces: 0,
          price: 0,
        },
        bap: {
          lots: 0,
          pieces: 0,
          price: 0,
        },
        brickLink: {
          lots: 0,
          pieces: 0,
          price: 0,
        },
      };
    }

    this.SplitMethod2('pab');
    this.SplitMethod2('bap');

    const brickLinkParts = this.partsListService.getParts(this.partsList.uuid, 'brickLink');
    brickLinkParts.forEach(part => {
      this.newPartsLists[0].partsList.parts.push(part);
      this.addToSummary('brickLink', 0, 1, part.qty, part.maxPrice);
    });
  }

  private calculateAmountOfCarts(deliveryType: string) {
    const parts = this.partsListService.getParts(this.partsList.uuid, deliveryType);
    if (parts.length === 0) return 0;
    let expectedLots = parts.length;
    let listCount = 1;

    // list count for maxOrderQuantity per piece
    parts.forEach(part => {
      if (!part.lego) return;
      if (part.qty / part.lego.maxOrderQuantity > 1) {
        expectedLots += Math.ceil(part.qty / part.lego.maxOrderQuantity) - 1;
      }
      if (part.qty / part.lego.maxOrderQuantity > listCount) {
        listCount = Math.ceil(part.qty / part.lego.maxOrderQuantity);
      }
    });

    // list count for LOT
    if (expectedLots / this.globalSettingsService.maxPaBLotPerOrder > listCount) {
      listCount = Math.ceil(expectedLots / this.globalSettingsService.maxPaBLotPerOrder);
    }

    return listCount;
  }

  private SplitMethod2(deliveryType: string) {
    const parts = this.partsListService
      .getParts(this.partsList.uuid, deliveryType)
      .sort(this.sortByMaxOrderQuantityAndTotalPrice);
    let listCount = deliveryType === 'pab' ? this.listCountBestseller : this.listCountStandard;

    parts.forEach(part => {
      if (part.qty / part.lego.maxOrderQuantity > 1) {
        for (let i = 0; i < part.qty; i++) {
          let currentPart: Part;
          let newLot = 0;
          let listIndex = 0;

          const partsListSorted = this.newPartsLists.sort((a, b) =>
            this.sortByTopPrioList(a.partsList, b.partsList, deliveryType)
          );

          for (let j = 0; j < listCount; j++) {
            newLot = 0;
            currentPart = partsListSorted[j].partsList.parts.find(p => p.id === part.id);

            if (!currentPart) {
              currentPart = { ...part, qty: 0 };
              this.newPartsLists[j].partsList.parts.push(currentPart);
              newLot = 1;
            }

            if (currentPart.qty >= currentPart.lego.maxOrderQuantity) {
              continue;
            }

            if (currentPart.qty < currentPart.lego.maxOrderQuantity) {
              listIndex = j;
              break;
            }
          }

          currentPart.qty = currentPart.qty + 1;
          this.addToSummary(deliveryType, partsListSorted[listIndex].index, newLot, 1, currentPart.lego.price.amount);
        }
      } else {
        const partsListSorted = this.newPartsLists.sort((a, b) =>
          this.sortByTopPrioList(a.partsList, b.partsList, deliveryType)
        );
        let currentPart: Part;
        let newLot = 0;
        currentPart = partsListSorted[0].partsList.parts.find(p => p.id === part.id);

        if (!currentPart) {
          currentPart = { ...part, qty: 0 };
          this.newPartsLists[0].partsList.parts.push(currentPart);
          newLot = 1;
        }
        currentPart.qty = currentPart.qty + 1;
        this.addToSummary(deliveryType, partsListSorted[0].index, newLot, 1, currentPart.lego.price.amount);
      }

      this.newPartsLists.sort((a, b) => a.index - b.index);
    });
  }

  // private SplitMethod1(deliveryType: string) {
  //   const parts = this.partsListService
  //     .getParts(this.partsList.uuid, deliveryType)
  //     .sort(this.sortByMaxOrderQuantityAndTotalPrice);

  //   const minPrice = 13;
  //   let listCount = deliveryType === 'pab' ? this.listCountBestseller : this.listCountStandard;

  //   parts.forEach(part => {
  //     let partAdded = false;

  //     if (part.qty / part.lego.maxOrderQuantity > 1) {
  //       let qty = part.qty;
  //       let i = 0;

  //       const minTargetAmount = Math.ceil(minPrice / part.lego.price.amount);

  //       do {
  //         let newPart = { ...part, qty: 0 };
  //         if (qty > part.lego.maxOrderQuantity) {
  //           newPart.qty = part.lego.maxOrderQuantity;
  //           qty = qty - part.lego.maxOrderQuantity;
  //         } else {
  //           newPart.qty = qty;
  //           qty = 0;
  //         }

  //         this.newPartsLists[i].parts.push(newPart);
  //         const price = newPart.qty * newPart.lego.price.amount;
  //         // this.addToSummary(deliveryType, i, 1, newPart.qty, price);

  //         i++;
  //       } while (qty > 0);

  //       const openLots = parts.length - i;
  //       const freeLots = this.newPartsListSummary.reduce(
  //         (a, b) => a + this.globalSettingsService.maxPaBLotPerOrder - b[deliveryType].lots,
  //         0
  //       );

  //       if (openLots > freeLots) {
  //         const difference = openLots - freeLots;
  //         const addCount = Math.ceil(difference / this.globalSettingsService.maxPaBLotPerOrder);
  //         for (let i = 0; i < this.counter; i++) {
  //           this.newPartsLists.push({
  //             uuid: this.guidService.generate(),
  //             name: 'partsListName',
  //             source: '',
  //             parts: [],
  //           });
  //         }
  //         listCount = listCount + addCount;
  //       }

  //       partAdded = true;
  //     }

  //     if (!partAdded) {
  //       for (let i = 0; i < listCount; i++) {
  //         let price = this.newPartsListSummary[i][deliveryType].price;
  //         if (price < minPrice) {
  //           this.newPartsLists[i].parts.push(part);
  //           price = part.qty * part.lego.price.amount;
  //           // this.addToSummary(deliveryType, i, 1, part.qty, price);

  //           partAdded = true;
  //           break;
  //         }
  //       }
  //     }

  //     if (!partAdded) {
  //       for (let i = 0; i < listCount; i++) {
  //         let price = 0;
  //         let lots = this.newPartsListSummary[i][deliveryType].lots;

  //         if (lots < this.globalSettingsService.maxPaBLotPerOrder) {
  //           this.newPartsLists[i].parts.push(part);
  //           price = part.qty * part.lego.price.amount;
  //           // this.addToSummary(deliveryType, i, 1, part.qty, price);
  //           break;
  //         }
  //       }
  //     }
  //   });
  // }

  private addToSummary(deliveryType: string, index: number, lots: number, pieces: number, price: number) {
    this.newPartsListSummary[index][deliveryType].pieces =
      this.newPartsListSummary[index][deliveryType].pieces + pieces;
    this.newPartsListSummary[index][deliveryType].lots = this.newPartsListSummary[index][deliveryType].lots + lots;
    this.newPartsListSummary[index][deliveryType].price = this.newPartsListSummary[index][deliveryType].price + price;
  }

  private sortByMaxOrderQuantityAndTotalPrice(b: Part, a: Part) {
    const aMaxQuantityIntikator = Math.ceil(a.qty / a.lego?.maxOrderQuantity);
    const bMaxQuantityIntikator = Math.ceil(b.qty / b.lego?.maxOrderQuantity);
    const aTotalPrice = a.lego ? a.lego.price.amount * a.qty : 0;
    const bTotalPrice = b.lego ? b.lego.price.amount * b.qty : 0;

    if (aMaxQuantityIntikator < bMaxQuantityIntikator) return -1;
    if (aMaxQuantityIntikator > bMaxQuantityIntikator) return 1;
    if (aTotalPrice < bTotalPrice) return -1;
    if (aTotalPrice > bTotalPrice) return 1;
    return 0;
  }

  private sortByTopPrioList(a: PartsList, b: PartsList, deliveryType: string) {
    const minPrice = deliveryType === 'pab' ? this.minPaBPrice : this.minBaPPrice;

    const aTotalPrice = a.parts
      .filter(p => p.lego.deliveryChannel === deliveryType)
      .reduce((a, b) => a + b.qty * b.lego.price.amount, 0);
    const bTotalPrice = b.parts
      .filter(p => p.lego.deliveryChannel === deliveryType)
      .reduce((a, b) => a + b.qty * b.lego.price.amount, 0);

    if (aTotalPrice < minPrice && bTotalPrice < minPrice) {
      if (aTotalPrice < bTotalPrice) return 1;
      if (aTotalPrice > bTotalPrice) return -1;
      return 0;
    }
    if (aTotalPrice < minPrice && bTotalPrice >= minPrice) return -1;

    const aTotalLots = a.parts.filter(p => p.lego.deliveryChannel === deliveryType).length;
    const bTotalLots = b.parts.filter(p => p.lego.deliveryChannel === deliveryType).length;

    if (aTotalLots < this.maxLot && bTotalLots < this.maxLot) {
      if (aTotalLots < bTotalLots) return 1;
      if (aTotalLots > bTotalLots) return -1;
    }

    if (aTotalLots < this.maxLot && bTotalLots >= this.maxLot) return -1;

    if (aTotalPrice < bTotalPrice) return 1;
    if (aTotalPrice > bTotalPrice) return -1;

    return 0;
  }
}
