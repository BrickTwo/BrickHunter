import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocaleService } from 'src/app/core/services/locale.service';
import { IPart } from 'src/app/models/parts-list';
import { PickABrickService } from '../../services/pickabrick.service';
import { TransferWarningComponent } from '../transfer-warning/transfer-warning.component';

@Component({
  selector: 'app-parts-list-transfer',
  templateUrl: './parts-list-transfer.component.html',
  styleUrls: ['./parts-list-transfer.component.scss'],
})
export class PartsListTransferComponent implements OnInit, OnDestroy {
  transferStep = 0;
  subscription: Subscription;
  show = false;
  parts: IPart[];
  cartType: string;
  errorMessage: string;
  transferWarningComponent: TransferWarningComponent;

  constructor(private readonly pickabrickService: PickABrickService, private readonly localeService: LocaleService) {}

  ngOnInit(): void {
    this.subscription = this.pickabrickService.transferStep.subscribe(step => {
      if (this.transferStep > 0 && step === 0 && !this.pickabrickService.transferError) {
        this.show = false;
      }
      if (!this.pickabrickService.transferError) {
        this.transferStep = step;
      }
      if (this.pickabrickService.transferError) {
        this.errorMessage = this.pickabrickService.transferError;
        if (!this.errorMessage) this.errorMessage = 'Something went wrong!';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onClose() {
    this.show = false;
  }

  start(parts: IPart[], cartType: string, transferWarningComponent: TransferWarningComponent) {
    this.show = true;
    this.errorMessage = '';
    this.parts = parts;
    this.cartType = cartType;
    this.transferWarningComponent = transferWarningComponent;
    this.pickabrickService.transferParts(this.parts, this.cartType, this.transferWarningComponent);
  }

  onRetry() {
    this.errorMessage = '';
    this.pickabrickService.transferParts(this.parts, this.cartType, this.transferWarningComponent);
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
