import { Component } from '@angular/core';

@Component({
  selector: 'app-parts-list-split',
  templateUrl: './parts-list-split.component.html',
  styleUrls: ['./parts-list-split.component.scss'],
})
export class PartsListSplitComponent {
  display = false;

  public open() {
    this.display = true;
  }
}
