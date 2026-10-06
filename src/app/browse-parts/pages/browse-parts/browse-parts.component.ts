import { Component, ChangeDetectionStrategy } from '@angular/core';
import { faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-browse-parts',
  templateUrl: './browse-parts.component.html',
  styleUrls: ['./browse-parts.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BrowsePartsComponent {
  faBook = faBook;
}
