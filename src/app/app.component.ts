import { Component } from '@angular/core';
import { VersionService } from './core/services/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private readonly versionService: VersionService) {}
}
