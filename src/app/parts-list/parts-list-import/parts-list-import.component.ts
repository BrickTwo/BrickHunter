import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BrickLinkWantedListItem, IBrickLinkWantedListItem } from 'src/app/shared/bricklink-wantedlist.model';
import * as xml2js from 'xml2js';
import * as fromApp from '../../store/app.reducer';
import { GetPartsRequest, Part, PartsList } from '../parts-list.model';
import * as partListActions from '../store/parts-list.actions';

@Component({
  selector: 'app-parts-list-import',
  templateUrl: './parts-list-import.component.html',
  styleUrls: ['./parts-list-import.component.css']
})
export class PartsListImportComponent {
  @Output()
  close = new EventEmitter<string>()

  @ViewChild('importForm', { static: false }) importForm: NgForm;
  wantedList: BrickLinkWantedListItem[];

  constructor(private store: Store<fromApp.AppState>) { }

  onFileNameChange(fileName: string) {
    this.importForm.setValue({
      listName: fileName
    });
  }

  onFileContentChange(fileContent: string | ArrayBuffer) {
    const tagNameProcessor = [
      function (name: string) {
        switch (name) {
          case 'itemid': return 'itemId'
          case 'itemtype': return 'itemType'
          case 'maxprice': return 'maxPrice'
          case 'minqty': return 'minQty'
          case 'qtyfilled': return 'qtyFilled'
          default:
            return name;
        }
      }
    ]

    const valueProcessor = [
      function (value: string, name: string) {
        switch (name) {
          case 'color': return Number(value)
          case 'maxPrice': return Number(value)
          case 'minQty': return Number(value)
          case 'qtyFilled': return Number(value)
          case 'notify': return (value === "T") ? true : false
          default:
            return value;
        }
      }
    ]

    xml2js.parseStringPromise(fileContent, { normalizeTags: true, explicitArray: false, tagNameProcessors: tagNameProcessor, valueProcessors: valueProcessor })
      .then(result => {
        this.wantedList = result.inventory.item as IBrickLinkWantedListItem[];
      })
      .catch(function (err) {
        // Failed
      });
  }

  onSubmit(form: NgForm) {
    this.store.dispatch(partListActions.importPartsList({ partsListName: form.value.listName, source: "BrickLink", parts: this.wantedList}));
    // this.store.dispatch(partListActions.addPartsList({
    //   partsList: new PartsList("555", form.value.listName, 'BrickLink', this.wantedList.map(item => {
    //     return new Part(
    //       item.color,
    //       item.itemId,
    //       0,
    //       0,
    //       {
    //         amount: item.minQty,
    //         have: item.qtyFilled
    //       }
    //     )
    //   }))
    // }));
    this.close.emit();
  }
}
