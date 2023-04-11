import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'dexie';
import { TreeNode } from 'primeng/api';
import { IPartsList } from 'src/app/models/parts-list';
import { PartsListService } from 'src/app/parts-list/services/parts-list.service';
import { BrowsePartsService } from '../../service/browse-parts.service';

@Component({
  selector: 'app-browse-parts-parts-lists',
  templateUrl: './browse-parts-parts-lists.component.html',
  styleUrls: ['./browse-parts-parts-lists.component.scss'],
})
export class BrowsePartsPartsListsComponent implements OnInit, OnDestroy {
  partsLists: IPartsList[];
  partsListSubscription: Subscription;
  selectedList: string;
  show: string;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly browsePartsService: BrowsePartsService
  ) {}

  ngOnInit(): void {
    this.partsListSubscription = this.partsListService.partsListsChanged$.subscribe(partsLists => {
      this.partsLists = partsLists;
      this.selectedList = this.partsLists[0].uuid;
      this.browsePartsService.setSelectedPartsListUuid(this.selectedList);
    });
    this.partsLists = this.partsListService.getPartsLists();
    this.selectedList = this.partsLists[0].uuid;
    this.browsePartsService.setSelectedPartsListUuid(this.selectedList);
  }

  onShowParts(uuid: string) {
    this.show = uuid;

    switch (uuid) {
      case 'wish':
        break;
      case 'haveit':
        break;
      default:
        const partsList = this.partsListService.getPartsList(uuid);
        let elementIds: number[] = [];
        partsList.parts.map(item => elementIds.push(...item.elementIds));
        this.browsePartsService.setElementIds(elementIds);
    }
  }

  onHideParts() {
    this.show = null;
    this.browsePartsService.setElementIds([]);
  }

  onSelectList(value: string) {
    this.browsePartsService.setSelectedPartsListUuid(value);
  }

  ngOnDestroy(): void {
    if (this.partsListSubscription) this.partsListSubscription.unsubscribe();
  }
}
