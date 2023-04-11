import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'dexie';
import { BrowsePartsPart } from 'src/app/models/browse-parts';
import { PartsListService } from 'src/app/parts-list/services/parts-list.service';
import { BrowsePartsService } from '../../service/browse-parts.service';
import { IPart } from 'src/app/models/parts-list';

@Component({
  selector: 'app-browse-parts-grid-item',
  templateUrl: './browse-parts-grid-item.component.html',
  styleUrls: ['./browse-parts-grid-item.component.scss'],
})
export class BrowsePartsGridItemComponent implements OnInit, OnDestroy {
  @Input()
  part: BrowsePartsPart;

  partsListPart: IPart;

  partsListSubscription: Subscription;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly browsePartsService: BrowsePartsService
  ) {}

  ngOnInit(): void {
    this.partsListSubscription = this.browsePartsService.selectedPartsListUuid$.subscribe(uuid => {
      this.partsListPart = this.partsListService
        .getParts(uuid, 'all')
        .find(p => p.elementIds.some(el => el === this.part.elementId));
    });
    this.partsListPart = this.partsListService
      .getParts(this.browsePartsService.selectedPartsListUuid, 'all')
      ?.find(p => p.elementIds.some(el => el === this.part.elementId));
  }

  ngOnDestroy(): void {
    if (this.partsListSubscription) this.partsListSubscription.unsubscribe();
  }

  getImageStyle() {
    return `background-image: url('${
      !!this.part.imageUrl
        ? `https://brickhunter.blob.core.windows.net${this.part.imageUrl}`
        : './assets/placeholder.png'
    }');
            width: 100%;
            height: 120px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;`;
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
