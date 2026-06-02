import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BrowsePartCountry } from 'src/app/models/browse-parts';
import { StudioService } from '../../service/studio.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { Country } from 'src/app/models/global';

@Component({
  selector: 'app-generate-palette',
  templateUrl: './generate-palette.component.html',
  styleUrls: ['./generate-palette.component.scss'],
})
export class GeneratePaletteComponent implements OnInit {
  countrySubscirption: Subscription;
  countries: Country[];
  selectedCountry: Country;
  deliveryChannelOptions = [
    { name: 'Bestseller', value: 'pab' },
    { name: 'Standard', value: 'bap' },
    { name: 'Out Of Stock', value: 'oos' },
  ];
  deliveryChannels = ['pab', 'bap', 'oos'];

  constructor(private readonly localeService: LocaleService, private readonly studioService: StudioService) {}

  ngOnInit(): void {
      this.countries = this.localeService.countries;
      this.selectedCountry = this.localeService.country || this.countries[0];
  }

  onDownload() {
  }

  // onCountrySelect() {
  //   this.studioService.setCountry(this.selectedCountry);
  // }

  // onDeliveryChannelsChange(value: string[]) {
  //   // this.studioService.setDeliveryChannels(value);
  // }
}
