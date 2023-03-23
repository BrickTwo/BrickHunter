import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IPartsList } from 'src/app/models/parts-list';
import { PartsListService } from '../../parts-list.service';

@Component({
  selector: 'app-parts-list-settings',
  templateUrl: './parts-list-settings.component.html',
  styleUrls: ['./parts-list-settings.component.scss'],
})
export class PartsListSettingsComponent implements OnChanges, AfterViewInit {
  display = false;
  have: boolean;
  withoutbl: boolean;
  bllower: boolean;

  @Input() partsList: IPartsList;

  @ViewChild('form', { static: false }) form: NgForm;

  constructor(private readonly partsListService: PartsListService) {}

  public open() {
    this.display = true;
  }

  ngAfterViewInit(): void {
    if (this.form && this.partsList)
      this.form.setValue({ partsListName: this.partsList?.name, have: false, withoutbl: false, bllower: false });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form && this.partsList)
      this.form.setValue({ partsListName: this.partsList?.name, have: false, withoutbl: false, bllower: false });
  }

  onSubmit(form: NgForm) {
    this.partsList.name = form.value.partsListName;
    this.partsListService.updatePartsList(this.partsList);
    this.display = false;
  }
}
