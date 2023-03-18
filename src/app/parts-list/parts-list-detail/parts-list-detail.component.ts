import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as partsListActions from '../store/parts-list.actions';
import { Part, PartsList } from '../parts-list.model';

@Component({
  selector: 'app-parts-list-detail',
  templateUrl: './parts-list-detail.component.html',
  styleUrls: ['./parts-list-detail.component.css']
})
export class PartsListDetailComponent implements OnInit {
  partsList: PartsList;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    let partsListId = '';

    this.route.params
      .pipe(map(params => {
        return params['id'];
      }), switchMap(id => {
        partsListId = id;
        return this.store.select('partsList');
      }), map(partsListState => {
        return partsListState.partsLists.find(partsList => partsList.uid === partsListId);
      }))
      .subscribe(partsList => {
        this.partsList = partsList
      });
  }

  onLoadPab() {
    let elementIds: number[] = [];
    this.partsList.parts.map(item => elementIds.push(...item.elementIds));

    chrome.runtime.sendMessage({
      service: 'pickABrick',
      action: 'findBrick',
      elementIds: elementIds,
    }).then(results => {
      console.log("findBrick", results);
      let parts: Part[] = this.partsList.parts.map(part => {
        if (!part.elementIds || part.elementIds.length === 0) return { ...part, lego: null };
        const pab = results.find(result => part.elementIds?.find(e => e === Number(result.variant.id)));
        if (!pab) return { ...part, lego: null };

        part.lego = {
          elementId: Number(pab.variant.id),
          designNumber: Number(pab.variant.attributes.designNumber),
          price: {
            currencyCode: String(pab.variant.price.currencyCode),
            amount: Number(pab.variant.price.centAmount) / 100
          },
          colourId: Number(pab.variant.attributes.colourId),
          deliveryChannel: String(pab.variant.attributes.deliveryChannel),
          inStock: Boolean(pab.inStock)
        }

        return part;
      })
      this.store.dispatch(partsListActions.updatePartsInPartsList({ partsListId: this.partsList.id, parts: parts }))
    });
  }

  onTransfer(cartType: string) {
    console.log('button clicked')
    chrome.runtime.sendMessage({
      service: 'pickABrick',
      action: 'readQAuth',
      designIds: this.partsList.parts.map(item => item.elementIds?.join(' '))
    }).then((response: string) => {
      console.log('qauth front', response)
      const authorization = response;
      if (response) {
        console.log("sendReadCart")
        // chrome.runtime.sendMessage({
        //       service: "pickABrick",
        //       action: "readCart",
        //       authorization: response,
        //     })
        //     .then((response) => {
              const items = this.getParts(cartType).map((part) => {
                return {
                  sku: part.lego.elementId.toString(),
                  quantity: part.qty,
                };
              });

              console.log("readcart", response)
              chrome.runtime.sendMessage({
                service: "pickABrick",
                action: "addElementToCart",
                authorization: authorization,
                items: items.slice(1,150),
                cartType: cartType,
              });
              // return true;
            // })
            // .catch(() => {});
        // if (action == "fill") {
        //   // this.$bvModal.show("modal-open-lego-fill-cart");
        // } else {
        //   // this.$bvModal.show("modal-open-lego-clear-cart");
        // }
        return false;
      }
      return false;
    });
  }


  getParts(filter: string): Part[] {
    switch (filter) {
      case 'pab':
      case 'bap':
        return this.partsList?.parts?.filter(p => p.lego?.deliveryChannel === filter);
      case 'oos':
        return this.partsList?.parts?.filter(p => p.lego?.inStock === false);
      case 'brickLink':
        return this.partsList?.parts?.filter(p => !p.lego);
      default:
        return this.partsList?.parts;
    }
  }

  getTotalQuantity(filter: string): number {
    return this.getParts(filter)?.reduce((a, b) => a + b.qty, 0)
  }

  getTotalPrice(filter: string): string {
    return (Math.round(this.getParts(filter)?.reduce((a, b) => a + b.qty * b.lego?.price.amount, 0) * 100) / 100).toFixed(2);
  }

  onDeletePartsList() {
    this.store.dispatch(partsListActions.deletePartsList({ id: this.partsList.id }));
    this.router.navigate(['/partslists']);
  }
}
