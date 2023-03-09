import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { PartsList } from '../parts-list.model';

export interface PartsLists {
  name: string;
  positions: number;
}

const ELEMENT_DATA: PartsLists[] = [
  { name: 'List 1', positions: 5 },
  { name: 'List 2', positions: 5 },
  { name: 'List 3', positions: 5 },
  { name: 'List 4', positions: 5 },
  { name: 'List 5', positions: 5 },
  { name: 'List 6', positions: 5 },
  { name: 'List 7', positions: 5 },
  { name: 'List 8', positions: 5 },
  { name: 'List 9', positions: 5 },
];

@Component({
  selector: 'app-parts-list-detail',
  templateUrl: './parts-list-detail.component.html',
  styleUrls: ['./parts-list-detail.component.css']
})
export class PartsListDetailComponent implements OnInit {
  displayedColumns: string[] = ['select', 'sourceId', 'designId', 'elementId', 'picture', 'color', 'quantity', 'brickLink', 'pickabrick'];
  dataSource = ELEMENT_DATA;
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
    }), map (partsListState => {
      return partsListState.partsLists.find(partsList => partsList.id === partsListId);
    }))
    .subscribe(partsList => this.partsList = partsList);
  }


  openPartsList(row: PartsLists) {
    this.router.navigate([row.positions], { relativeTo: this.route });
  }
}
