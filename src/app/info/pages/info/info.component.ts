import { Component, OnInit } from '@angular/core';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  faCircleInfo = faCircleInfo;
  currentVersion: string;

  constructor(private readonly versionService: VersionService) {}

  ngOnInit(): void {
    this.currentVersion = this.versionService.currentVersion;
  }
}
