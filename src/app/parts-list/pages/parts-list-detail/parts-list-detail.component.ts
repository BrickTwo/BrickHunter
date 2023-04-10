import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IPart, IPartsList } from 'src/app/models/parts-list';
import { PaBCartType } from 'src/app/models/pick-a-brick';
import { PartsListPdfComponent } from '../../components/parts-list-pdf/parts-list-pdf.component';
import { PartsListSettingsComponent } from '../../components/parts-list-settings/parts-list-settings.component';
import { PartsListTransferComponent } from '../../components/parts-list-transfer/parts-list-transfer.component';
import { TransferWarningComponent } from '../../components/transfer-warning/transfer-warning.component';
import { PartsListService } from '../../services/parts-list.service';
import { PickABrickService } from '../../services/pickabrick.service';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';

@Component({
  selector: 'app-parts-list-detail',
  templateUrl: './parts-list-detail.component.html',
  styleUrls: ['./parts-list-detail.component.scss'],
})
export class PartsListDetailComponent implements OnInit, OnDestroy {
  faClipboardList = faClipboardList;
  partsList: IPartsList;
  items: MenuItem[] = [
    { label: 'All', id: 'all' },
    { label: 'PaB Bestseller', id: 'pab' },
    { label: 'PaB Standard', id: 'bap' },
    { label: 'PaB Out Of Stock', id: 'oos' },
    { label: 'BrickLink', id: 'brickLink' },
    { label: 'Warnings', id: 'warning' },
  ];
  activeItem = this.items[0];
  parts: IPart[];
  pabSubscription: Subscription;
  partsListSubscription: Subscription;
  globalSettingsSubscription: Subscription;
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
  };

  @ViewChild(PartsListSettingsComponent, { static: false })
  private partsListSettingsComponent?: PartsListSettingsComponent;

  @ViewChild(PartsListPdfComponent, { static: false })
  private partsListPdfComponent?: PartsListPdfComponent;

  @ViewChild(PartsListTransferComponent, { static: false })
  private partsListTransferComponent?: PartsListTransferComponent;

  @ViewChild(TransferWarningComponent, { static: false })
  private transferWarningComponent?: TransferWarningComponent;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly pickabrickService: PickABrickService,
    private readonly gloablSettingsService: GlobalSettingsService
  ) {}

  ngOnDestroy(): void {
    if (this.pabSubscription) this.pabSubscription.unsubscribe();
    if (this.partsListSubscription) this.partsListSubscription.unsubscribe();
    if (this.globalSettingsSubscription) this.globalSettingsSubscription.unsubscribe();
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
              detail: 'PLease try again later',
            });
          }
          this.reloadPartsList();
        }
        this.pabIsLoading = isLoading;
      });

      this.partsListSubscription = this.partsListService.partsListsChanged$.subscribe(partsLists => {
        if (!this.partsList && partsLists) {
          this.reloadPartsList();
        }
      });

      this.globalSettingsSubscription = this.gloablSettingsService.settingsChanged$.subscribe(value => {
        this.reloadPartsList();
      });
    });
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
    };

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
    this.partsListTransferComponent?.start(
      this.partsListService.getParts(this.uuid, cartType),
      cartType,
      this.transferWarningComponent
    );
  }
}
