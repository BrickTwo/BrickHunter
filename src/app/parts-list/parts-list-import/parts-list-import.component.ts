import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BrickLinkWantedListItem, IBrickLinkWantedListItem } from 'src/app/shared/bricklink-wantedlist.model';
import * as xml2js from 'xml2js';
import * as fromApp from '../../store/app.reducer';
import * as partListActions from '../store/parts-list.actions';

@Component({
  selector: 'app-parts-list-import',
  templateUrl: './parts-list-import.component.html',
  styleUrls: ['./parts-list-import.component.css']
})
export class PartsListImportComponent implements OnInit, OnDestroy {
  @Output()
  close = new EventEmitter<string>()

  @ViewChild('importForm', { static: false }) importForm: NgForm;

  wantedList: BrickLinkWantedListItem[];
  importStatus: number;

  private storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('partsList').subscribe(partsListState => {
      let closeModal = false
      if (this.importStatus > 0 && partsListState.importProgress === 0) {
        closeModal = true;
      }
      this.importStatus = partsListState.importProgress;

      if (closeModal) {
        this.importForm.setValue({ listName: "" });
        this.close.emit();
      }
    })
  }

  ngOnDestroy(): void {
    if (this.storeSub) this.storeSub.unsubscribe();
  }

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
    this.store.dispatch(partListActions.importPartsList({ partsListName: form.value.listName, source: "BrickLink", parts: this.wantedList }));
  }
}
