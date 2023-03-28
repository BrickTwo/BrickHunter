import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LocaleService } from 'src/app/core/services/locale.service';
import { IPart } from 'src/app/models/parts-list';
import { PickABrickService } from '../../services/pickabrick.service';
import { TransferWarningComponent } from '../transfer-warning/transfer-warning.component';

@Component({
  selector: 'app-parts-list-transfer',
  templateUrl: './parts-list-transfer.component.html',
  styleUrls: ['./parts-list-transfer.component.scss'],
})
export class PartsListTransferComponent implements OnDestroy {
  transferStep = 0;
  subscription$: Subscription;
  show = false;
  parts: IPart[];
  cartType: string;
  errorMessage: string;
  transferWarningComponent: TransferWarningComponent;

  constructor(private readonly pickabrickService: PickABrickService, private readonly localeService: LocaleService) {}

  ngOnDestroy(): void {
    if (this.subscription$) this.subscription$.unsubscribe();
  }

  onClose() {
    if (this.subscription$) this.subscription$.unsubscribe();
    this.show = false;
  }

  start(parts: IPart[], cartType: string, transferWarningComponent: TransferWarningComponent) {
    this.show = true;
    this.errorMessage = '';
    this.parts = parts;
    this.cartType = cartType;
    this.transferWarningComponent = transferWarningComponent;

    this.subscription$ = new Observable<number>(subscriber => {
      this.pickabrickService.transferParts(subscriber, this.parts, this.cartType, this.transferWarningComponent);
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
    this.start(this.parts, this.cartType, this.transferWarningComponent);
  }

  onOpenLegoWebsite() {
    let affiliate = '';
    let url = `https://www.lego.com/${this.localeService.languageCountryCode}`;
    if (affiliate) {
      // if (affiliate.linkType == "webgains") {
      //   url = `https://track.webgains.com/click.html?wgcampaignid=${affiliate.wgcampaignid}&wgprogramid=${affiliate.wgprogramid}&clickref=${affiliate.clickref}&wgtarget=${target}`;
      // }
    }
    window.open(url, '_blank');
  }
}
