import { Component, Input } from '@angular/core';
import { faCheck, faO, faRightLong } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-progress-icon',
  templateUrl: './progress-icon.component.html',
  styleUrls: ['./progress-icon.component.scss'],
})
export class ProgressIconComponent {
  faCheck = faCheck;
  faRightLong = faRightLong;
  faO = faO;

  @Input()
  step = 0;

  @Input()
  currentStep = 0;
}
