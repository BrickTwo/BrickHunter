import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartsListService } from '../../services/parts-list.service';
import { Part, PartsList } from 'src/app/models/parts-list';
import { MessageService } from 'primeng/api';
import { Subscription } from 'dexie';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-parts-list-copy-or-move-to',
  templateUrl: './parts-list-copy-or-move-to.component.html',
  styleUrls: ['./parts-list-copy-or-move-to.component.scss'],
})
export class PartsListCopyOrMoveToComponent implements OnInit, OnDestroy {
  display = false;

  action: string;

  targetPartsLists: PartsList[];
  selectedPartsListUuid: string;

  currentPartListUuid: string;
  selectedParts: Part[];

  partsListSubscription: Subscription;

  constructor(private readonly partsListService: PartsListService, private readonly messageService: MessageService) {}

  ngOnInit(): void {
    this.targetPartsLists = this.partsListService.getPartsLists();
    this.selectedPartsListUuid = this.targetPartsLists[0]?.uuid;

    this.partsListSubscription = this.partsListService.partsListsChanged$.subscribe(partsLists => {
      this.targetPartsLists = partsLists;
      this.selectedPartsListUuid = this.targetPartsLists[0]?.uuid;
    });
  }

  public open(partsListUuid: string, action: string, parts: Part[]) {
    this.currentPartListUuid = partsListUuid;
    this.selectedParts = parts;
    this.action = action;
    this.display = true;
  }

  onClose() {
    this.display = false;
  }

  onCreatePartsList(importForm: NgForm) {
    const partsList = this.partsListService.createPartsList(importForm.value.partsListName, 'Mixed');
    this.selectedPartsListUuid = partsList.uuid;
  }

  onSubmit() {
    const targetUuid = this.selectedPartsListUuid;
    this.selectedParts.map(part => this.partsListService.addPartToPartsList(targetUuid, part));
    if (this.action === 'move') {
      this.selectedParts.map(part => this.partsListService.deletePartInPartsList(this.currentPartListUuid, part.id));
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Parts have been ${this.action === 'move' ? 'moved' : 'copied'}!`,
    });
    this.onClose();
  }

  ngOnDestroy(): void {
    if (this.partsListSubscription) this.partsListSubscription.unsubscribe();
  }
}
