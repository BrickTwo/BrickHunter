import { Component } from '@angular/core';
import {
  faList,
  faCircleInfo,
  faCircleQuestion,
  faClockRotateLeft,
  faBook,
  faGear,
  faPenRuler,
} from '@fortawesome/free-solid-svg-icons';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent {
  faBook = faBook;
  faList = faList;
  faClockRotateLeft = faClockRotateLeft;
  faGear = faGear;
  faPenRuler = faPenRuler;
  faCircleInfo = faCircleInfo;
  faCircleQuestion = faCircleQuestion;
  currentVersion: string;

  constructor(private readonly versionService: VersionService) {
    this.currentVersion = this.versionService.currentVersion;
  }
}
