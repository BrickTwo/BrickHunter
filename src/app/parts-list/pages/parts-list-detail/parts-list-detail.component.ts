import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IPart, IPartsList } from 'src/app/models/parts-list';
import { PartsListSettingsComponent } from '../../components/parts-list-settings/parts-list-settings.component';
import { PartsListTransferComponent } from '../../components/parts-list-transfer/parts-list-transfer.component';
import { TransferWarningComponent } from '../../components/transfer-warning/transfer-warning.component';
import { PartsListService } from '../../services/parts-list.service';
import { PickABrickService } from '../../services/pickabrick.service';

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
  pabIsLoading: boolean = false;
  uuid: string;

  @ViewChild(PartsListSettingsComponent, { static: false })
  private partsListSettingsComponent?: PartsListSettingsComponent;

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
    private readonly pickabrickService: PickABrickService
  ) {}

  ngOnDestroy(): void {
    if (this.pabSubscription) this.pabSubscription.unsubscribe();
    if (this.partsListSubscription) this.partsListSubscription.unsubscribe();
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

      this.partsListSubscription = this.partsListService.partsListsChanged.subscribe(partsLists => {
        if (!this.partsList && partsLists) {
          this.reloadPartsList();
        }
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
    this.parts = this.getParts(String(this.activeItem.id));

    if (loadPab) {
      this.pabIsLoading = true;
      this.pickabrickService.getParts(this.uuid);
    }
  }

  onTableChange(selectedTab: MenuItem) {
    this.parts = this.getParts(String(selectedTab.id));
  }

  getParts(filter: string): IPart[] {
    switch (filter) {
      case 'pab':
      case 'bap':
        return this.partsList?.parts?.filter(p => p.lego?.deliveryChannel === filter);
      case 'oos':
        return this.partsList?.parts?.filter(p => p.lego?.inStock === false);
      case 'brickLink':
        return this.partsList?.parts?.filter(p => !p.lego);
      case 'warning':
        return this.partsList?.parts?.filter(p => {
          if (p.lego?.inStock === false) return true;
          if (p.lego && p.lego.maxOrderQuantity < p.qty) return true;
          return false;
        });
      default:
        return this.partsList?.parts;
    }
  }

  getTotalQuantity(filter: string): number {
    return this.getParts(filter)?.reduce((a, b) => a + b.qty, 0);
  }

  getTotalPrice(filter: string): string {
    return (
      Math.round(
        this.getParts(filter)?.reduce((a, b) => a + b.qty * (!!b.lego?.price.amount ? b.lego.price.amount : 0), 0) * 100
      ) / 100
    ).toFixed(2);
  }

  onSetting() {
    this.partsListSettingsComponent?.open();
  }

  onDelete() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this parts list?',
      header: 'Delete Confirmation',
      icon: 'fa fa-circle-info',
      accept: () => {
        this.partsListService.deletePartsList(this.partsList.uuid);
        this.router.navigate(['/partslists']);
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

  onTransfer(cartType: string) {
    this.partsListTransferComponent?.start(this.getParts(cartType), cartType, this.transferWarningComponent);
  }
}
