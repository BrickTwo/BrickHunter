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
  newPartsLists: PartsList[] = [];
  newPartsListSummary: Summary[] = [];
  listCountBestseller = 0;
  listCountStandard = 0;

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
      partsList.name = `${this.form.value.partsListName} ${index}`;
      this.partsListService.addPartsList(partsList);
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
        uuid: this.guidService.generate(),
        name: 'partsListName',
        source: '',
        parts: [],
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

    console.log(this.listCountBestseller, this.listCountStandard, this.counter);

    this.fillByMaxOrderQuantity('pab');
    this.fillByMaxOrderQuantity('bap');

    console.log(this.newPartsLists, this.newPartsListSummary);
    console.table(this.newPartsListSummary);
  }

  private calculateAmountOfCarts(deliveryType: string) {
    const parts = this.partsListService.getParts(this.partsList.uuid, deliveryType);

    // list count for LOT
    if (parts.length === 0) return 0;
    let listCount = Math.ceil(parts.length / this.globalSettingsService.maxPaBLotPerOrder);
    console.log('A', deliveryType, listCount, this.globalSettingsService.maxPaBLotPerOrder, parts.length);

    // list count for maxOrderQuantity per piece
    parts.forEach(part => {
      if (!part.lego) return;
      if (part.qty / part.lego.maxOrderQuantity > listCount) {
        listCount = Math.ceil(part.qty / part.lego.maxOrderQuantity);
        console.log('B', deliveryType, listCount, part.qty, part.lego.maxOrderQuantity);
      }
    });

    return listCount;
  }

  private fillByMaxOrderQuantity(deliveryType: string) {
    const parts = this.partsListService.getParts(this.partsList.uuid, deliveryType).sort(this.mysortfunction);

    const minPrice = 13;
    let listCount = deliveryType === 'pab' ? this.listCountBestseller : this.listCountStandard;

    parts.forEach(part => {
      let partAdded = false;

      if (part.qty / part.lego.maxOrderQuantity > 1) {
        let qty = part.qty;
        let i = 0;

        const minTargetAmount = Math.ceil(minPrice / part.lego.price.amount);

        do {
          let newPart = { ...part, qty: 0 };
          if (qty > part.lego.maxOrderQuantity) {
            newPart.qty = part.lego.maxOrderQuantity;
            qty = qty - part.lego.maxOrderQuantity;
          } else {
            newPart.qty = qty;
            qty = 0;
          }

          this.newPartsLists[i].parts.push(newPart);
          const price = newPart.qty * newPart.lego.price.amount;
          this.addToSummary(deliveryType, i, 1, newPart.qty, price);

          i++;
        } while (qty > 0);

        const openLots = parts.length - i;
        const freeLots = this.newPartsListSummary.reduce(
          (a, b) => a + this.globalSettingsService.maxPaBLotPerOrder - b[deliveryType].lots,
          0
        );

        if (openLots > freeLots) {
          const difference = openLots - freeLots;
          const addCount = Math.ceil(difference / this.globalSettingsService.maxPaBLotPerOrder);
          for (let i = 0; i < this.counter; i++) {
            this.newPartsLists.push({
              uuid: this.guidService.generate(),
              name: 'partsListName',
              source: '',
              parts: [],
            });
          }
          listCount = listCount + addCount;
        }

        partAdded = true;
      }

      if (!partAdded) {
        for (let i = 0; i < listCount; i++) {
          let price = this.newPartsListSummary[i][deliveryType].price;
          if (price < minPrice) {
            this.newPartsLists[i].parts.push(part);
            price = part.qty * part.lego.price.amount;
            this.addToSummary(deliveryType, i, 1, part.qty, price);

            partAdded = true;
            break;
          }
        }
      }

      if (!partAdded) {
        for (let i = 0; i < listCount; i++) {
          let price = 0;
          let lots = this.newPartsListSummary[i][deliveryType].lots;

          if (lots < this.globalSettingsService.maxPaBLotPerOrder) {
            this.newPartsLists[i].parts.push(part);
            price = part.qty * part.lego.price.amount;
            this.addToSummary(deliveryType, i, 1, part.qty, price);
            break;
          }
        }
      }
    });
  }

  private addToSummary(deliveryType: string, index: number, lots: number, pieces: number, price: number) {
    this.newPartsListSummary[index][deliveryType].pieces =
      this.newPartsListSummary[index][deliveryType].pieces + pieces;
    this.newPartsListSummary[index][deliveryType].lots = this.newPartsListSummary[index][deliveryType].lots + lots;
    this.newPartsListSummary[index][deliveryType].price = this.newPartsListSummary[index][deliveryType].price + price;
  }

  private mysortfunction(b: Part, a: Part) {
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
}
