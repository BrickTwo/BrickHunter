import { Component } from '@angular/core';
import { Part, PartsList } from 'src/app/models/parts-list';

@Component({
  selector: 'app-parts-list-split',
  templateUrl: './parts-list-split.component.html',
  styleUrls: ['./parts-list-split.component.scss'],
})
export class PartsListSplitComponent {
  display = false;
  partsList: PartsList;
  splitedPartsList: PartsList[] = [];
  minValue = 13;
  maxLot = 150;

  public open(partsList: PartsList) {
    this.display = true;
    this.partsList = { ...partsList };
  }

  private split() {
    let listCountBestseller = this.getListCountForLots('pab');
    let listCountStandard = this.getListCountForLots('bap');
    const listCountMaxQuantityBestseller = this.getListCountForMaxQuantity('pab');
    const listCountMaxQuantityStandard = this.getListCountForMaxQuantity('pab');

    if (listCountBestseller < listCountMaxQuantityBestseller) listCountBestseller = listCountMaxQuantityBestseller;
    if (listCountStandard < listCountMaxQuantityStandard) listCountStandard = listCountMaxQuantityStandard;

    const totalPriceBestseller = this.getTotalPrice('pab');
    const totalPriceStandard = this.getTotalPrice('pab');
    let averagePricePerListBestseller = totalPriceBestseller / listCountBestseller;
    let averagePricePerListStandard = totalPriceStandard / listCountStandard;

    if (listCountBestseller === 1 && listCountStandard === 1) {
      // doen't needs to be splited!
      this.splitedPartsList.push(this.partsList);
      return;
    }

    let listCount = listCountBestseller;
    if (listCount < listCountStandard) listCount = listCountStandard;

    for (let i = 0; i < listCount; i++) {
      let list: PartsList = {
        uuid: this.partsList.uuid,
        name: this.partsList.name,
        source: this.partsList.source,
        parts: [],
      };

      this.splitedPartsList.push(list);
    }

    this.partsList.parts.map(part => {
      if (!part.lego || !part.lego.inStock) {
        this.splitedPartsList[0].parts.push(part);
        return;
      }

      if (part.lego.deliveryChannel === 'pab') {
        if (listCountBestseller === 1) {
          this.splitedPartsList[0].parts.push(part);
          return;
        }
      }
    });
  }

  private mysortfunction(a: Part, b: Part) {
    const aMaxQuantityIntikator = Math.ceil(a.lego?.maxOrderQuantity / a.qty);
    const bMaxQuantityIntikator = Math.ceil(b.lego?.maxOrderQuantity / b.qty);
    const aTotalPrice = a.lego ? a.lego.price.amount * a.qty : 0;
    const bTotalPrice = b.lego ? b.lego.price.amount * b.qty : 0;

    if (aMaxQuantityIntikator < bMaxQuantityIntikator) return -1;
    if (aMaxQuantityIntikator > bMaxQuantityIntikator) return 1;
    if (aTotalPrice < bTotalPrice) return -1;
    if (aTotalPrice > bTotalPrice) return 1;
    return 0;
  }

  private getListCountForLots(cartType: string) {
    return Math.ceil(this.maxLot / this.partsList.parts.filter(p => p.lego?.deliveryChannel === cartType).length);
  }

  private getListCountForMaxQuantity(cartType: string) {
    let amount = 1;
    this.partsList.parts
      .filter(p => {
        if (p.lego && p.lego.maxOrderQuantity < p.qty && p.lego?.deliveryChannel === cartType) return true;
        return false;
      })
      .map(part => {
        const count = Math.ceil(part.lego.maxOrderQuantity / part.qty);
        if (count > amount) amount = count;
      });

    return amount;
  }

  private getTotalPrice(cartType: string) {
    return this.partsList.parts
      .filter(p => p.lego?.deliveryChannel === cartType)
      .reduce((a, b) => a + b.qty * (!!b.lego?.price.amount ? b.lego.price.amount : 0), 0);
  }
}
