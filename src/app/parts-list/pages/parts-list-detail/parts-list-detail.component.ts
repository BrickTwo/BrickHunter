import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PickABrickService } from 'src/app/core/services/pickabrick.service';
import { IPart, IPartsList } from 'src/app/models/parts-list';
import { PartsListSettingsComponent } from '../../components/parts-list-settings/parts-list-settings.component';
import { PartsListService } from '../../parts-list.service';

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
    { label: 'PaB Out Of Service', id: 'oos' },
    { label: 'BrickLink', id: 'brickLink' },
    { label: 'Warnings', id: 'warning' },
  ];
  activeItem = this.items[0];
  parts: IPart[];
  subscription: Subscription;
  pabIsLoading: boolean = false;

  @ViewChild(PartsListSettingsComponent, { static: false })
  private partsListSettingsComponent?: PartsListSettingsComponent;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly pickabrickService: PickABrickService
  ) { }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.pickabrickService.pabLoading.subscribe(isLoading => {
      if(!isLoading && this.pabIsLoading) {
        if(this.pickabrickService.pabLoadError) {
          this.messageService.add({
            severity: 'error',
            summary: "Couldn't load PaB Data!",
            detail: this.pickabrickService.pabLoadError,
          });
        }
        this.partsList = this.partsListService.getPartsList(this.partsList.uuid);
        this.parts = this.getParts(String(this.activeItem.id));
      }
      this.pabIsLoading = isLoading;
    });
    this.route.params.subscribe((params: Params) => {
      const uuid = params['id'];
      this.partsList = this.partsListService.getPartsList(uuid);
      this.parts = this.getParts(String(this.activeItem.id));
      this.pickabrickService.loadPaB(this.partsList.uuid);
    });
  }

  onTableChange(selectedTab: MenuItem) {
    this.parts = this.getParts(String(selectedTab.id));
  }

  getParts(filter: string): IPart[] {
    switch (filter) {
      case 'pab':
      case 'bap':
        return this.partsList?.parts?.filter(
          (p) => p.lego?.deliveryChannel === filter
        );
      case 'oos':
        return this.partsList?.parts?.filter((p) => p.lego?.inStock === false);
      case 'brickLink':
        return this.partsList?.parts?.filter((p) => !p.lego);
      case 'warning':
        return this.partsList?.parts?.filter((p) => p.lego?.inStock === false);
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
        this.getParts(filter)?.reduce(
          (a, b) =>
            a + b.qty * (!!b.lego?.price.amount ? b.lego.price.amount : 0),
          0
        ) * 100
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
        this.partsListService.deletePartsList(this.partsList.id);
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
        }
      },
      key: 'positionDialog',
    });
  }
}