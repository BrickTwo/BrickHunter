import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IPartsList } from 'src/app/models/parts-list';
import { PartsListImportComponent } from '../../components/parts-list-import/parts-list-import.component';
import { PartsListService } from '../../services/parts-list.service';

@Component({
  selector: 'app-parts-list-list',
  templateUrl: './parts-list-list.component.html',
  styleUrls: ['./parts-list-list.component.scss'],
})
export class PartsListListComponent implements OnInit, OnDestroy {
  faList = faList;
  partsLists: IPartsList[];
  subscription: Subscription;

  @ViewChild(PartsListImportComponent, { static: false })
  private partsListImportComponent?: PartsListImportComponent;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly partsListService: PartsListService
  ) {}

  ngOnInit(): void {
    this.subscription = this.partsListService.partsListsChanged.subscribe((partsLists: IPartsList[]) => {
      this.partsLists = partsLists;
    });
    this.partsLists = this.partsListService.getPartsLists();
  }

  onDeletePartsList(uuid: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this parts list?',
      header: 'Delete Confirmation',
      icon: 'fa fa-circle-info',
      accept: () => {
        this.partsListService.deletePartsList(uuid);
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

  onImport() {
    this.partsListImportComponent?.open();
  }

  openPartsList(partsList: IPartsList) {
    console.log(partsList.uuid);
    this.router.navigate([partsList.uuid], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
