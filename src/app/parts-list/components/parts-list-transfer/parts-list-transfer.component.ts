import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LocaleService } from 'src/app/core/services/locale.service';
import { Part } from 'src/app/models/parts-list';
import { PaBCartType } from 'src/app/models/pick-a-brick';
import { PickABrickService } from '../../services/pickabrick.service';
import { TransferWarningComponent } from '../transfer-warning/transfer-warning.component';
import { Affiliate } from 'src/app/models/global';

@Component({
  selector: 'app-parts-list-transfer',
  templateUrl: './parts-list-transfer.component.html',
  styleUrls: ['./parts-list-transfer.component.scss'],
})
export class PartsListTransferComponent implements OnDestroy {
  transferStep = 0;
  subscription$: Subscription;
  show = false;
  parts: Part[];
  cartType: PaBCartType;
  errorMessage: string;
  transferWarningComponent: TransferWarningComponent;
  affiliate: Affiliate;

  constructor(private readonly pickabrickService: PickABrickService, private readonly localeService: LocaleService) {}

  ngOnDestroy(): void {
    if (this.subscription$) this.subscription$.unsubscribe();
  }

  onClose() {
    if (this.subscription$) this.subscription$.unsubscribe();
    this.show = false;
  }

  start(
    parts: Part[],
    cartType: PaBCartType,
    transferWarningComponent: TransferWarningComponent,
    affiliate: Affiliate
  ) {
    this.show = true;
    this.errorMessage = '';
    this.parts = parts;
    this.cartType = cartType;
    this.transferWarningComponent = transferWarningComponent;
    this.affiliate = affiliate;

    this.subscription$ = new Observable<number>(subscriber => {
      this.pickabrickService.transferParts(
        subscriber,
        this.parts,
        this.cartType,
        this.transferWarningComponent,
        this.affiliate
      );
    }).subscribe({
      next: step => {
        this.transferStep = step;
      },
      complete: () => {
        this.show = false;
      },
      error: err => {
        this.errorMessage = err;
      },
    });
  }

  onRetry() {
    this.start(this.parts, this.cartType, this.transferWarningComponent, this.affiliate);
  }

  onOpenLegoWebsite() {
    let url = `https://www.lego.com/${this.localeService.languageCountryCode}`;
    if (this.affiliate) {
      if (this.affiliate.linkType == 'rakuten') {
        url = `https://click.linksynergy.com/deeplink?id=${this.affiliate.id}&mid=${this.affiliate.mid}&u1=${this.affiliate.clickref}&murl=${url}`;
      }
    }
    window.open(url, '_blank');
  }
}
