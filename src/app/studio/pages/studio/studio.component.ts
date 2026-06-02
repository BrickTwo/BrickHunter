import { Component } from '@angular/core';
import { faPenRuler } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.scss'],
})
export class StudioComponent {
  faPenRuler = faPenRuler;
}
