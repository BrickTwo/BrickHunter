import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { Part, PartsList, Product } from 'src/app/models/parts-list';
import { PaBCartType } from 'src/app/models/pick-a-brick';
import { PartsListService } from '../../services/parts-list.service';
import { PickABrickService } from '../../services/pickabrick.service';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';
import { AffiliateService } from 'src/app/core/services/affiliate.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { Affiliate } from 'src/app/models/global';
import { ImportService } from '../../services/import.service';
import { BrickHunterV2 } from 'src/app/models/brickhunter';
import {
  PartsListCopyOrMoveToComponent,
  PartsListExportComponent,
  PartsListSettingsComponent,
  PartsListTransferComponent,
  TransferWarningComponent,
} from '../../components';
import { BlukAction } from 'src/app/models/shared';
import { VersionService } from 'src/app/core/services/version.service';
import { PartsListSplitComponent } from '../../components/parts-list-split/parts-list-split.component';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { GetProductSuggestionsRequest, GetProductSuggestionsResponse } from 'src/app/models/brickhunter-api';

@Component({
  selector: 'app-parts-list-detail',
  templateUrl: './parts-list-detail.component.html',
  styleUrls: ['./parts-list-detail.component.scss'],
})
export class PartsListDetailComponent implements OnInit, OnDestroy {
  faClipboardList = faClipboardList;
  partsList: PartsList;
  items: MenuItem[] = [
    { label: 'All', id: 'all', title: 'All' },
    { label: 'PaB Bestseller', id: 'pab', title: 'PaB Bestseller' },
    { label: 'PaB Standard', id: 'bap', title: 'PaB Standard' },
    { label: 'PaB Out Of Stock', id: 'oos', title: 'PaB Out Of Stock' },
    { label: 'BrickLink', id: 'brickLink', title: 'BrickLink' },
    { label: 'Warnings', id: 'warning', title: 'Warnings' },
    { label: 'Set Suggestions', id: 'setSuggestions', title: 'Set Suggestions' },
  ];
  activeItem = this.items[0];
  parts: Part[];
  pabSubscription: Subscription;
  partsListSubscription: Subscription;
  globalSettingsSubscription: Subscription;
  importSubscription: Subscription;
  pabIsLoading: boolean = false;
  setSuggestionsLoaded: boolean = false
  setSugestionIsLoading: boolean = false;
  pabLoaded: boolean = false;
  uuid: string;
  cartType = PaBCartType;
  totals = {
    bestseller: {
      lot: 0,
      pieces: 0,
      price: '0.00',
    },
    standard: {
      lot: 0,
      pieces: 0,
      price: '0.00',
    },
    bricklink: {
      lot: 0,
      pieces: 0,
      price: '0.00',
    },
    total: {
      lot: 0,
      pieces: 0,
      price: '0.00',
    },
  };
  useAffiliatePaB = true;
  useAffiliateBaP = true;
  affiliate: Affiliate;
  permissionLegoCom = false;
  showImportDialog = false;
  importStep = 0;
  selectedParts: Part[];
  productsResponse: GetProductSuggestionsResponse[];
  products: Product[];

  @ViewChild(PartsListSettingsComponent, { static: false })
  private partsListSettingsComponent?: PartsListSettingsComponent;

  @ViewChild(PartsListSplitComponent, { static: false })
  private partsListSplitComponent?: PartsListSplitComponent;

  @ViewChild(PartsListExportComponent, { static: false })
  private partsListExportComponent?: PartsListExportComponent;

  @ViewChild(PartsListTransferComponent, { static: false })
  private partsListTransferComponent?: PartsListTransferComponent;

  @ViewChild(TransferWarningComponent, { static: false })
  private transferWarningComponent?: TransferWarningComponent;

  @ViewChild(PartsListCopyOrMoveToComponent, { static: false })
  private partsListCopyOrMoveToComponent?: PartsListCopyOrMoveToComponent;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly pickabrickService: PickABrickService,
    private readonly gloablSettingsService: GlobalSettingsService,
    private readonly affiliateService: AffiliateService,
    private readonly localeService: LocaleService,
    private readonly importService: ImportService,
    private readonly versionService: VersionService,
    private readonly BrickHunterApiService: BrickHunterApiService
  ) {}

  ngOnDestroy(): void {
    if (this.pabSubscription) this.pabSubscription.unsubscribe();
    if (this.partsListSubscription) this.partsListSubscription.unsubscribe();
    if (this.globalSettingsSubscription) this.globalSettingsSubscription.unsubscribe();
    if (this.importSubscription) this.importSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.checkPermission();

    this.route.params.subscribe((params: Params) => {
      this.uuid = params['id'];
      this.reloadPartsList();

      this.pabSubscription = this.pickabrickService.pabLoading.subscribe(isLoading => {
        if (!isLoading && this.pabIsLoading) {
          if (this.pickabrickService.pabLoadError) {
            this.messageService.add({
              life: 10000,
              severity: 'error',
              summary: "Couldn't load PaB Data!",
              detail:
                'Permission for accessing lego.com may be not set or there is currently a problem at lego.com itself.',
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'PaB Data successfully updated',
            });
          }
          this.reloadPartsList();
        }
        this.pabIsLoading = isLoading;
      });

      this.partsListSubscription = this.partsListService.partsListsChanged$.subscribe(partsLists => {
        // if (!this.partsList && partsLists) {
        this.reloadPartsList();
        // }
      });

      this.globalSettingsSubscription = this.gloablSettingsService.settingsChanged$.subscribe(value => {
        this.reloadPartsList();
      });
    });

    this.affiliate = this.affiliateService.getPartnerForCountry(this.localeService.country.code);
  }

  private reloadPartsList() {
    let loadPab = false;
    if (!this.uuid) return;
    const partsList = this.partsListService.getPartsList(this.uuid);
    if (!this.partsList && partsList) {
      loadPab = true;
    }

    this.partsList = partsList;
    this.parts = this.partsListService.getParts(this.uuid, this.activeItem.id);

    this.totals = {
      bestseller: {
        lot: this.getParts('pab')?.length,
        pieces: this.getTotalQuantity('pab'),
        price: this.getTotalPrice('pab'),
      },
      standard: {
        lot: this.getParts('bap')?.length,
        pieces: this.getTotalQuantity('bap'),
        price: this.getTotalPrice('bap'),
      },
      bricklink: {
        lot: this.getParts('brickLink')?.length,
        pieces: this.getTotalQuantity('brickLink'),
        price: this.getTotalPrice('brickLink'),
      },
      total: {
        lot: this.getParts('all')?.length,
        pieces: this.getTotalQuantity('all'),
        price: '',
      },
    };

    this.totals['total']['price'] = (
      Number(this.totals.bestseller.price) +
      Number(this.totals.standard.price) +
      Number(this.totals.bricklink.price)
    ).toFixed(2);

    this.recalcTabTitle();

    this.permissionLegoCom = true;

    if (loadPab && this.permissionLegoCom) {
      this.pabIsLoading = true;
      this.pickabrickService.getParts(this.uuid);
      this.pabLoaded = true;
    }
  }

  private recalcTabTitle() {
    this.items = this.items.map(item => {
      item.label =
        item.title +
        (item.id !== 'setSuggestions'
          ? `(${this.getParts(item.id) ? this.getParts(item.id)?.length : 0})`
          : `(${this.products ? this.products.length : 0})`);
      return item;
    });
  }

  getSetSuggestions() {
    this.setSugestionIsLoading = true;
    const productsSuggestionRequest: GetProductSuggestionsRequest = {
      countryCode: this.localeService.country?.code || 'de',
      minQuantityPercentage: 33,
      elements: this.partsList.parts.map(p => {
        return {
          elementId: p.elementId,
          quantity: p.qty,
        };
      }),
    };

    this.BrickHunterApiService.getProductsSuggestions(productsSuggestionRequest).subscribe({
      next: products => {
        this.productsResponse = products;
        this.products = this.productsResponse.map(product => {
          return {
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            pieceCount: product.pieceCount,
            containesPieces: 0,
            containesPercentage: product.containesPercentage,
            containedPicesPrice: 0,
            price: product.price,
            currencyCode: product.currencyCode,
            partsUsed: [
              ...JSON.parse(JSON.stringify(
                this.partsList.parts?.filter(part => { 
                  return product.elements.find(element => element.elementId === part.elementId);
                })
              )),
            ],
            partsNotUsed: []
          };
        });

        this.recalcSetSuggestion();
        this.recalcTabTitle();
        this.setSuggestionsLoaded = true;
        this.setSugestionIsLoading = false;
      },
    });
  }

  private recalcSetSuggestion() {
    this.products.forEach(product => {
      product.containesPercentage = Math.round(product.containesPercentage * 10) / 10;

      product.partsUsed = product.partsUsed?.map(part => {
        const inventarQty = this.productsResponse
              .find(p => p.id === product.id)
              .elements.find(e => e.elementId === part.elementId).quantity;
        const qtyToBuy = part.qty - (this.gloablSettingsService.subtractHaveFromQuantity ? part.have || 0 : 0);
        
        if (inventarQty < qtyToBuy){
          part.qty = inventarQty;
        } else {
          part.qty = qtyToBuy;
        }

        return part;
      }, 0);

      product.containesPieces = product.partsUsed?.reduce((a, b) => {
        return a + b.qty;
      }, 0);

      product.containedPicesPrice =
        Math.round(
          product.partsUsed?.reduce((a, b) => {
            return a +  b.qty * (b.lego?.price.amount || 0);
          }, 0) * 100
        ) / 100;
      });


    //   product.containesPieces = product.partsUsed?.reduce((a, b) => {
    //     const inventarQty = this.productsResponse
    //       .find(p => p.id === product.id)
    //       .elements.find(e => e.elementId === b.elementId).quantity;
    //     const qtyToBuy = b.qty - (this.gloablSettingsService.subtractHaveFromQuantity ? b.have || 0 : 0);

    //     if (inventarQty < qtyToBuy) return a + inventarQty;
    //     return a + qtyToBuy;
    //   }, 0);

    //   product.containedPicesPrice =
    //     Math.round(
    //       product.partsUsed?.reduce((a, b) => {
    //         const inventarQty = this.productsResponse
    //           .find(p => p.id === product.id)
    //           .elements.find(e => e.elementId === b.elementId).quantity;
    //         const qtyToBuy = b.qty - (this.gloablSettingsService.subtractHaveFromQuantity ? b.have || 0 : 0);

    //         if (this.partsListService.brickLinkFilter(b)) {
    //           if (inventarQty < qtyToBuy) return a + inventarQty * (b.maxPrice || 0);
    //           return a + qtyToBuy * (b.maxPrice || 0);
    //         }

    //         if (inventarQty < qtyToBuy) return a + inventarQty * (b.lego?.price.amount || 0);
    //         return a + qtyToBuy * (b.lego?.price.amount || 0);
    //       }, 0) * 100
    //     ) / 100;
    // });
  }

  onTableChange(selectedTab: MenuItem) {
    this.parts = this.partsListService.getParts(this.uuid, String(selectedTab.id));
  }

  getTotalQuantity(filter: string): number {
    return this.partsListService
      .getParts(this.uuid, filter)
      ?.reduce((a, b) => a + (b.qty - (this.gloablSettingsService.subtractHaveFromQuantity ? b.have || 0 : 0)), 0);
  }

  getTotalPrice(filter: string): string {
    if (filter === 'brickLink') {
      return (
        Math.round(
          this.partsListService
            .getParts(this.uuid, filter)
            ?.reduce(
              (a, b) =>
                a +
                (b.qty - (this.gloablSettingsService.subtractHaveFromQuantity ? b.have || 0 : 0)) *
                  (b.maxPrice < 0 ? 0 : b.maxPrice || 0),
              0
            ) * 100
        ) / 100
      ).toFixed(2);
    } else {
      return (
        Math.round(
          this.partsListService
            .getParts(this.uuid, filter)
            ?.reduce(
              (a, b) =>
                a +
                (b.qty - (this.gloablSettingsService.subtractHaveFromQuantity ? b.have || 0 : 0)) *
                  (b.lego?.price.amount || 0),
              0
            ) * 100
        ) / 100
      ).toFixed(2);
    }
  }

  getParts(filter: string) {
    return this.partsListService.getParts(this.uuid, filter);
  }

  onSetting() {
    this.partsListSettingsComponent?.open();
  }

  onExport() {
    this.partsListExportComponent.open(this.uuid);
  }

  onSplit() {
    this.partsListSplitComponent.open(this.partsList);
  }

  onDelete() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this parts list?',
      header: 'Delete Confirmation',
      icon: 'fa fa-circle-info',
      accept: () => {
        this.partsListService.deletePartsList(this.partsList.uuid);
        this.router.navigate(['/parts-lists']);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Parts list has been successfully deleted',
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'warn',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      },
      key: 'positionDialog',
    });
  }

  onTransfer(cartType: PaBCartType) {
    let affiliate: Affiliate = null;
    if (cartType === PaBCartType.Bestseller && this.useAffiliatePaB) affiliate = this.affiliate;
    if (cartType === PaBCartType.Standard && this.useAffiliateBaP) affiliate = this.affiliate;

    this.partsListTransferComponent?.start(
      this.partsListService.getParts(this.uuid, cartType),
      cartType,
      this.transferWarningComponent,
      affiliate
    );
  }

  onReSync() {
    this.showImportDialog = true;

    this.importSubscription = new Observable<number>(subscriber => {
      let syncList: BrickHunterV2 = this.partsList as unknown as BrickHunterV2;
      syncList.version = '2.0';
      this.importService.import(subscriber, this.partsList.name, 'BrickHunter', syncList, this.partsList.uuid);
    }).subscribe({
      next: step => {
        this.importStep = step;
      },
      complete: () => {
        this.showImportDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Parts list has been successfully synchronized!',
        });
        this.pabIsLoading = true;
        this.pickabrickService.getParts(this.uuid);
      },
      error: error => {
        this.showImportDialog = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  onBulkAction(value: BlukAction) {
    if (value.action === 'delete') {
      value.parts.forEach(part => {
        this.partsListService.deletePartInPartsList(this.partsList.uuid, part.id);
      });
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Parts are successfully deleted from list.' });
      return;
    }
    if (value.action === 'removePartsFromSelectedSet') {
      value.parts.forEach(part => {
        this.partsListService.deletePartInPartsList(this.partsList.uuid, part.id);
      });
      this.getSetSuggestions();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Parts are successfully removed from list.' });
      return;
    }
    this.partsListCopyOrMoveToComponent.open(this.uuid, value.action, value.parts);
  }

  async checkPermission() {
    if (this.versionService.devmode) return;
    const permissions = await chrome.permissions.getAll();
    if (permissions.origins.find(o => o === 'https://*.lego.com/*')) {
      this.permissionLegoCom = true;
      if (!this.pabLoaded) {
        this.pabIsLoading = true;
        this.pickabrickService.getParts(this.uuid);
        this.pabLoaded = true;
      }
    } else {
      this.confirmationService.confirm({
        message: 'Permission for accessing lego.com needed.',
        header: 'Missing Permission',
        icon: 'fa fa-circle-info',
        accept: async () => {
          const response = await chrome.permissions.request({
            origins: ['https://*.lego.com/*'],
          });
          if (response == true) {
            this.permissionLegoCom = true;
            if (!this.pabLoaded) {
              this.pabIsLoading = true;
              this.pickabrickService.getParts(this.uuid);
              this.pabLoaded = true;
            }
          }
          this.checkPermission();
        },
        reject: (type: any) => {},
        key: 'positionDialog',
      });
    }
  }
}
