import { Component, ChangeDetectionStrategy } from '@angular/core';
import { faGear } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SettingsComponent {
  faGear = faGear;
}
