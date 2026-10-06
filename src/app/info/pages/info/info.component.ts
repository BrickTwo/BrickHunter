import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faCircleInfo } from '../../../shared/icons/reference-icons';
import { VersionService } from 'src/app/core/services/version.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class InfoComponent implements OnInit {
  faCircleInfo = faCircleInfo;
  currentVersion: string;

  constructor(private readonly versionService: VersionService) {}

  ngOnInit(): void {
    this.currentVersion = this.versionService.currentVersion;
  }
}
