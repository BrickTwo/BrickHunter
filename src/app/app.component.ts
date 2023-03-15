import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { db } from './shared/functions/db';
import * as fromApp from './store/app.reducer';
import * as partsListActions from './parts-list/store/parts-list.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(partsListActions.restorePartsLists());
  }

}
