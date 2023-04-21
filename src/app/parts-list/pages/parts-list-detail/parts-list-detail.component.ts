import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { Part, PartsList } from 'src/app/models/parts-list';
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
  PartsListPdfComponent,
  PartsListSettingsComponent,
  PartsListTransferComponent,
  TransferWarningComponent,
} from '../../components';
import { BlukAction } from 'src/app/models/shared';

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
  ];
  activeItem = this.items[0];
  parts: Part[];
  pabSubscription: Subscription;
  partsListSubscription: Subscription;
  globalSettingsSubscription: Subscription;
  importSubscription: Subscription;
  pabIsLoading: boolean = false;
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

  @ViewChild(PartsListSettingsComponent, { static: false })
  private partsListSettingsComponent?: PartsListSettingsComponent;

  @ViewChild(PartsListPdfComponent, { static: false })
  private partsListPdfComponent?: PartsListPdfComponent;

  @ViewChild(PartsListExportComponent, { static: false })
  private partsListExportComponent?: PartsListExportComponent;

  @ViewChild(PartsListTransferComponent, { static: false })
  private partsListTransferComponent?: PartsListTransferComponent;

  @ViewChild(TransferWarningComponent, { static: false })
  private transferWarningComponent?: TransferWarningComponent;

  @ViewChild(PartsListCopyOrMoveToComponent, { static: false })
  private partsListCopyOrMoveToComponent?: PartsListCopyOrMoveToComponent;

  showImportDialog = false;
  importStep = 0;
  selectedParts: Part[];

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
    private readonly importService: ImportService
  ) {}

  ngOnDestroy(): void {
    if (this.pabSubscription) this.pabSubscription.unsubscribe();
    if (this.partsListSubscription) this.partsListSubscription.unsubscribe();
    if (this.globalSettingsSubscription) this.globalSettingsSubscription.unsubscribe();
    if (this.importSubscription) this.importSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.uuid = params['id'];
      this.reloadPartsList();

      this.pabSubscription = this.pickabrickService.pabLoading.subscribe(isLoading => {
        if (!isLoading && this.pabIsLoading) {
          if (this.pickabrickService.pabLoadError) {
            this.messageService.add({
              severity: 'error',
              summary: "Couldn't load PaB Data!",
              detail: 'Please try again later',
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

    this.items = this.items.map(item => {
      item.label = `${item.title} (${this.getParts(item.id)?.length})`;
      return item;
    });

    if (loadPab) {
      this.pabIsLoading = true;
      this.pickabrickService.getParts(this.uuid);
    }
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
                (b.qty - (this.gloablSettingsService.subtractHaveFromQuantity ? b.have || 0 : 0)) * (b.maxPrice || 0),
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

  onPdf() {
    this.partsListPdfComponent.open(this.uuid);
  }

  onExport() {
    this.partsListExportComponent.open(this.uuid);
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
    this.partsListCopyOrMoveToComponent.open(this.uuid, value.action, value.parts);
  }
}
