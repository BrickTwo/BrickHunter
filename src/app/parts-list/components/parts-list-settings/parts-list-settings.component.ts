import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPartsList } from 'src/app/models/parts-list';
import { PartsListService } from '../../services/parts-list.service';

@Component({
  selector: 'app-parts-list-settings',
  templateUrl: './parts-list-settings.component.html',
  styleUrls: ['./parts-list-settings.component.scss'],
})
export class PartsListSettingsComponent implements OnInit, OnChanges {
  display = false;
  have: boolean;
  withoutbl: boolean;
  bllower: boolean;

  form = new FormGroup({
    partsListName: new FormControl(),
  });

  @Input() partsList: IPartsList;

  constructor(private readonly partsListService: PartsListService) {}

  ngOnInit(): void {
    // console.log('init', this.partsList?.name, !!this.form);
    // if (this.partsList) this.form.setValue({ partsListName: this.partsList.name });
    //this.form.patchValue({ partsListName: this.partsList.name });
  }

  public open() {
    this.display = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.partsList) this.form.patchValue({ partsListName: this.partsList.name });
  }

  onSubmit() {
    this.partsList.name = this.form.value.partsListName;
    this.partsListService.updatePartsList(this.partsList);
    this.display = false;
  }
}
