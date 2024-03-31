import { Component, Input, OnInit } from '@angular/core';
import { LocaleService } from 'src/app/core/services/locale.service';
import { Part } from 'src/app/models/parts-list';

@Component({
  selector: 'app-pab-price',
  templateUrl: './pab-price.component.html',
  styleUrls: ['./pab-price.component.scss'],
})
export class PabPriceComponent implements OnInit {
  @Input() part: Part;

  language: string;

  constructor(private readonly localeService: LocaleService) {}

  ngOnInit(): void {
    this.language =
      this.localeService.languageCountryCode.substring(0, 2) === 'de' ? this.localeService.languageCountryCode : 'en';
  }
}
