import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ColorService } from 'src/app/core/services/color.service';
import { BrowsePartCategory, BrowsePartsPart } from 'src/app/models/browse-parts';
import { BrowsePartsService } from '../../service/browse-parts.service';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';

@Component({
  selector: 'app-browse-parts-part-detail',
  templateUrl: './browse-parts-part-detail.component.html',
  styleUrls: ['./browse-parts-part-detail.component.scss'],
})
export class BrowsePartsPartDetailComponent implements OnInit {
  part: BrowsePartsPart;
  category: BrowsePartCategory;
  maxOrderQuantity: Number;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly browsePartsService: BrowsePartsService,
    private readonly globalSettingsService: GlobalSettingsService
  ) {
    this.part = config.data.part;
  }

  ngOnInit(): void {
    this.category = this.browsePartsService.categories.find(cat => cat.id === this.part.categoryId);
    this.maxOrderQuantity = this.part.maxOrderQuantity;
    if (this.maxOrderQuantity === 0) this.maxOrderQuantity = this.globalSettingsService.defaultMaxQuantityPerLot;
  }
}
