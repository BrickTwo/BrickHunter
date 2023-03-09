import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { PartsList } from '../parts-list.model';

@Component({
  selector: 'app-parts-list-list',
  templateUrl: './parts-list-list.component.html',
  styleUrls: ['./parts-list-list.component.css']
})
export class PartsListListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'positions', 'actions'];
  dataSource: PartsList[];
  partListSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.partListSubscription = this.store.select('partsList')
      .pipe(map(partsListState => partsListState.partsLists))
      .subscribe((partsLists: PartsList[]) => {
        this.dataSource = partsLists
      })
  }

  openPartsList(row: PartsList) {
    this.router.navigate([row.id], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.partListSubscription.unsubscribe();
  }
}
