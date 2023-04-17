import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'dexie';
import { PartsList } from 'src/app/models/parts-list';
import { PartsListService } from 'src/app/parts-list/services/parts-list.service';
import { BrowsePartsService } from '../../service/browse-parts.service';

@Component({
  selector: 'app-browse-parts-parts-lists',
  templateUrl: './browse-parts-parts-lists.component.html',
  styleUrls: ['./browse-parts-parts-lists.component.scss'],
})
export class BrowsePartsPartsListsComponent implements OnInit, OnDestroy {
  partsLists: PartsList[];
  wishList: number[];
  haveItList: number[];
  partsListSubscription: Subscription;
  browsePartsSubscription: Subscription;
  wishListSubscription: Subscription;
  haveItListSubscription: Subscription;
  selectedListUuid: string;
  show: string;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly browsePartsService: BrowsePartsService
  ) {}

  ngOnInit(): void {
    this.partsLists = this.partsListService.getPartsLists();
    this.selectedListUuid = this.partsLists[0]?.uuid;
    this.browsePartsService.setSelectedPartsListUuid(this.selectedListUuid);
    this.wishList = this.browsePartsService.wishList;
    this.haveItList = this.browsePartsService.haveItList;

    this.partsListSubscription = this.partsListService.partsListsChanged$.subscribe(partsLists => {
      this.partsLists = partsLists;
      if (!this.selectedListUuid) {
        this.selectedListUuid = this.partsLists[0].uuid;
        this.browsePartsService.setSelectedPartsListUuid(this.selectedListUuid);
      }
    });

    this.browsePartsSubscription = this.browsePartsService.selectedPartsListUuid$.subscribe(uuid => {
      this.selectedListUuid = uuid;
    });

    this.wishListSubscription = this.browsePartsService.wishList$.subscribe(wishList => {
      this.wishList = wishList;
    });

    this.haveItListSubscription = this.browsePartsService.haveItList$.subscribe(haveItList => {
      this.haveItList = haveItList;
    });
  }

  onShowParts(uuid: string) {
    this.show = uuid;

    switch (uuid) {
      case 'wish':
        this.browsePartsService.setElementIds(this.browsePartsService.wishList);
        break;
      case 'haveit':
        this.browsePartsService.setElementIds(this.browsePartsService.haveItList);
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

  onCreatePartsList() {
    const partsList = this.partsListService.createPartsList('Parts List', 'Lego');
    this.selectedListUuid = partsList.uuid;
    this.browsePartsService.setSelectedPartsListUuid(partsList.uuid);
  }

  ngOnDestroy(): void {
    if (this.partsListSubscription) this.partsListSubscription.unsubscribe();
    if (this.browsePartsSubscription) this.browsePartsSubscription.unsubscribe();
    if (this.wishListSubscription) this.wishListSubscription.unsubscribe();
    if (this.haveItListSubscription) this.haveItListSubscription.unsubscribe();
  }
}
