import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Part } from 'src/app/parts-list/parts-list.model';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-parts-table',
  templateUrl: './parts-table.component.html',
  styleUrls: ['./parts-table.component.css']
})
export class PartsTableComponent {
  displayedColumns: string[] = ['select', 'sourceId', 'elementId', 'image', 'color', 'quantity', 'brickLink', 'pickABrick'];
  
  @Input()
  parts: Part[];

  constructor(private store: Store<fromApp.AppState>) { }
}
