import { Component } from '@angular/core';
import { faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-browse-parts',
  templateUrl: './browse-parts.component.html',
  styleUrls: ['./browse-parts.component.scss'],
})
export class BrowsePartsComponent {
  faBook = faBook;
}
