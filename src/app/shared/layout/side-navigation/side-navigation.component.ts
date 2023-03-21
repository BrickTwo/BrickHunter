import { Component } from '@angular/core';
import { faList, faCircleInfo, faCircleQuestion, faClockRotateLeft, faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent {
  faBook = faBook;
  faList = faList;
  faClockRotateLeft = faClockRotateLeft;
  faCircleInfo = faCircleInfo;
  faCircleQuestion = faCircleQuestion;
}
