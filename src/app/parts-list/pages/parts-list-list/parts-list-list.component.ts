import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PartsList } from 'src/app/models/parts-list';
import { PartsListImportComponent } from '../../components/parts-list-import/parts-list-import.component';
import { PartsListService } from '../../services/parts-list.service';

@Component({
  selector: 'app-parts-list-list',
  templateUrl: './parts-list-list.component.html',
  styleUrls: ['./parts-list-list.component.scss'],
})
export class PartsListListComponent implements OnInit, OnDestroy {
  faList = faList;
  partsLists: PartsList[];
  subscription: Subscription;
  bulkMenuItems: MenuItem[];
  selectedPartsLists: PartsList[] = [];

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
    this.subscription = this.partsListService.partsListsChanged$.subscribe((partsLists: PartsList[]) => {
      this.partsLists = partsLists;
    });
    this.partsLists = this.partsListService.getPartsLists();

    this.bulkMenuItems = [
      {
        label: 'Open Combined',
        icon: 'fa fa-clipboard-list',
        command: () => {
          this.bulkOpen();
        },
      },
      {
        label: 'Delete',
        icon: 'fa fa-trash-can',
        command: () => {
          this.bulkDelete();
        },
      },
    ];
  }

  onDeletePartsList(uuid: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Parts List?',
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

  openPartsList(partsList: PartsList) {
    this.router.navigate([partsList.uuid], { relativeTo: this.route });
  }

  bulkOpen() {
    let partsList = JSON.parse(JSON.stringify(this.selectedPartsLists[0]));
    partsList.uuid = 'multiple';
    partsList.name = 'Multiple Parts Lists';

    this.partsListService.deletePartsList('multiple');
    this.partsListService.addPartsList(partsList);

    this.selectedPartsLists
      .filter(p => p.uuid !== this.selectedPartsLists[0].uuid)
      .forEach(partList => {
        partList.parts.forEach(part => {
          this.partsListService.addPartToPartsList('multiple', part);
        });
      });

    this.router.navigate([partsList.uuid], { relativeTo: this.route });
  }

  bulkDelete() {
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected Parts Lists?',
      header: 'Delete Confirmation',
      icon: 'fa fa-circle-info',
      accept: () => {
        this.selectedPartsLists.forEach(partsList => {
          this.partsListService.deletePartsList(partsList.uuid);
        });
        this.selectedPartsLists = [];
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Parts lists have been successfully deleted',
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

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
