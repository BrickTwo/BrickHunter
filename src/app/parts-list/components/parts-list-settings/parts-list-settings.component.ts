import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';
import { PartsList } from 'src/app/models/parts-list';
import { PartsListService } from '../../services/parts-list.service';
import { LocaleService } from 'src/app/core/services/locale.service';

interface SubtractUnit {
  name: string;
  code: string;
}

@Component({
  selector: 'app-parts-list-settings',
  templateUrl: './parts-list-settings.component.html',
  styleUrls: ['./parts-list-settings.component.scss'],
})
export class PartsListSettingsComponent implements OnChanges {
  display = false;
  subtractHaveFromQuantity: boolean;
  ignoreBrickLinkPrices: boolean;
  subtractBrickLinkPrice: boolean;
  subtractBrickLinkPriceAmount: number;
  subtractBrickLinkPriceUnit: string;
  subtractUnits: SubtractUnit[];

  form = new FormGroup({
    partsListName: new FormControl(),
    subtractHaveFromQuantity: new FormControl(),
    ignoreBrickLinkPrices: new FormControl(),
    subtractBrickLinkPrice: new FormControl(),
    subtractBrickLinkPriceAmount: new FormControl(),
    subtractBrickLinkPriceUnit: new FormControl<SubtractUnit>({
      name: this.localeService.country.currency,
      code: 'absolute',
    }),
  });

  @Input() partsList: PartsList;

  constructor(
    private readonly partsListService: PartsListService,
    private readonly globalSettingsService: GlobalSettingsService,
    private readonly localeService: LocaleService
  ) {}

  public open() {
    this.display = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subtractUnits = [
      { name: this.localeService.country.currency, code: 'absolute' },
      { name: '%', code: 'percentage' },
    ];

    if (this.partsList) this.form.patchValue({ partsListName: this.partsList.name });
    this.form.patchValue({ subtractHaveFromQuantity: this.globalSettingsService.subtractHaveFromQuantity });
    this.form.patchValue({ ignoreBrickLinkPrices: this.globalSettingsService.ignoreBrickLinkPrices });
    this.form.patchValue({ subtractBrickLinkPrice: this.globalSettingsService.subtractBrickLinkPrice });
    this.form.patchValue({ subtractBrickLinkPriceAmount: this.globalSettingsService.subtractBrickLinkPriceAmount });
    this.form.patchValue({
      subtractBrickLinkPriceUnit: this.subtractUnits.find(
        su => su.code === this.globalSettingsService.subtractBrickLinkPriceUnit
      ),
    });
  }

  onSubmit() {
    this.partsList.name = this.form.value.partsListName;
    this.partsListService.updatePartsList(this.partsList);

    this.globalSettingsService.setSubtractHaveFromQuantity(this.form.value.subtractHaveFromQuantity);
    this.globalSettingsService.setIgnoreBrickLinkPrices(this.form.value.ignoreBrickLinkPrices);
    this.globalSettingsService.setSubtractBrickLinkPrice(this.form.value.subtractBrickLinkPrice);
    this.globalSettingsService.setSubtractBrickLinkPriceAmount(this.form.value.subtractBrickLinkPriceAmount);
    this.globalSettingsService.setSubtractBrickLinkPriceUnit(this.form.value.subtractBrickLinkPriceUnit.code);

    this.display = false;
  }
}
