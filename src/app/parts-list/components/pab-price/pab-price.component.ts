import { Component, Input } from '@angular/core';
import { IPart } from 'src/app/models/parts-list';

@Component({
  selector: 'app-pab-price',
  templateUrl: './pab-price.component.html',
  styleUrls: ['./pab-price.component.scss'],
})
export class PabPriceComponent {
  @Input() part: IPart;
}
