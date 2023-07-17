import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'dexie';
import { BrowsePartsPart } from 'src/app/models/browse-parts';
import { PartsListService } from 'src/app/parts-list/services/parts-list.service';
import { BrowsePartsService } from '../../service/browse-parts.service';
import { Part } from 'src/app/models/parts-list';
import { ColorService } from 'src/app/core/services/color.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BrowsePartsPartDetailComponent } from '../browse-parts-part-detail/browse-parts-part-detail.component';

@Component({
  selector: 'app-browse-parts-grid-item',
  templateUrl: './browse-parts-grid-item.component.html',
  styleUrls: ['./browse-parts-grid-item.component.scss'],
  providers: [DialogService],
})
export class BrowsePartsGridItemComponent implements OnInit, OnDestroy {
  @Input()
  part: BrowsePartsPart;

  partsListPart: Part;
  partsListUuidSubscription: Subscription;
  partsListsSubscription: Subscription;

  isInWishList = false;
  wishListSubscription: Subscription;

  isInHaveItList = false;
  haveItListSubscription: Subscription;

  ref: DynamicDialogRef | undefined;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly browsePartsService: BrowsePartsService,
    private readonly colorService: ColorService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.partsListPart = this.partsListService
      .getParts(this.browsePartsService.selectedPartsListUuid, 'all')
      ?.find(p => (p.color !== 9999 ? this.isElementId(p) : false));

    this.isInWishList = !!this.browsePartsService.wishList.find(w => w === this.part.elementId);
    this.isInHaveItList = !!this.browsePartsService.haveItList.find(w => w === this.part.elementId);

    this.partsListUuidSubscription = this.browsePartsService.selectedPartsListUuid$.subscribe(uuid => {
      this.partsListPart = this.partsListService
        .getParts(uuid, 'all')
        .find(p => (p.color !== 9999 ? this.isElementId(p) : false));
    });

    this.partsListsSubscription = this.partsListService.partsListsChanged$.subscribe(partsList => {
      this.partsListPart = this.partsListService
        .getParts(this.browsePartsService.selectedPartsListUuid, 'all')
        .find(p => this.isElementId(p));
    });

    this.wishListSubscription = this.browsePartsService.wishList$.subscribe(wishList => {
      this.isInWishList = !!wishList.find(w => w === this.part.elementId);
    });

    this.haveItListSubscription = this.browsePartsService.haveItList$.subscribe(haveItList => {
      this.isInHaveItList = !!haveItList.find(w => w === this.part.elementId);
    });
  }

  async onAddPart() {
    if (this.partsListService.getPartsLists().length === 0) {
      const partsList = this.partsListService.createPartsList('Parts List', 'Lego');
      this.browsePartsService.setSelectedPartsListUuid(partsList.uuid);
    }

    const color = await this.colorService.getColor(this.part.colorId);

    this.partsListPart = {
      id: String(this.part.elementId),
      externalId: String(this.part.designId),
      designId: String(this.part.designId),
      elementId: Number(this.part.elementId),
      elementIds: [Number(this.part.elementId)],
      color: this.part.colorId,
      qty: 1,
      have: 0,
      itemType: '',
      maxPrice: 0,
      condition: '',
      notify: false,
      remarks: '',
      source: {
        source: 'Lego',
        id: String(this.part.elementId),
        color: color.externalIds.lego?.extIds[0],
      },
    };

    this.partsListService.addPartToPartsList(this.browsePartsService.selectedPartsListUuid, this.partsListPart);
  }

  onChangeQuantity() {
    this.partsListService.updatePartInPartsList(this.browsePartsService.selectedPartsListUuid, this.partsListPart);
  }

  onRemovePart() {
    this.partsListService.deletePartInPartsList(this.browsePartsService.selectedPartsListUuid, this.partsListPart.id);
  }

  onAddToWishList() {
    this.browsePartsService.addToWishList(this.part.elementId);
  }

  onRemoveFromWishList() {
    this.browsePartsService.removeFromWishList(this.part.elementId);
  }

  onAddToHaveItList() {
    this.browsePartsService.addToHaveItList(this.part.elementId);
  }

  onRemoveFromHaveItList() {
    this.browsePartsService.removeFromHaveItList(this.part.elementId);
  }

  onOpenPartDetail() {
    this.ref = this.dialogService.open(BrowsePartsPartDetailComponent, {
      data: {
        part: this.part,
      },
      header: this.part.description,
      dismissableMask: true,
    });
  }

  onSetKeywordFilter(value: string) {
    this.browsePartsService.setColor(null, false);
    this.browsePartsService.setKeyword(value);
  }

  onSetColorFilter(value: number) {
    this.browsePartsService.setKeyword('', false);
    this.browsePartsService.setColor(value);
  }

  ngOnDestroy(): void {
    if (this.partsListUuidSubscription) this.partsListUuidSubscription.unsubscribe();
    if (this.wishListSubscription) this.wishListSubscription.unsubscribe();
    if (this.haveItListSubscription) this.haveItListSubscription.unsubscribe();
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
            background-position: center;
            cursor: pointer;`;
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

  private isElementId(part: Part) {
    if (part.source.source === 'Lego') {
      return part.elementId === this.part.elementId;
    }
    return part.elementIds.some(el => el === this.part.elementId);
  }
}
