import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { faCheck, faO, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { PickABrickService } from 'src/app/core/services/pickabrick.service';
import { IPart } from 'src/app/models/parts-list';

@Component({
  selector: 'app-parts-list-transfer',
  templateUrl: './parts-list-transfer.component.html',
  styleUrls: ['./parts-list-transfer.component.scss'],
})
export class PartsListTransferComponent implements OnInit, OnDestroy {
  faCheck = faCheck;
  faRightLong = faRightLong;
  faO = faO;
  transferStep = 0;
  subscription: Subscription;
  show = false;
  parts: IPart[];
  cartType: string;
  errorMessage: string;

  constructor(private readonly pickabrickService: PickABrickService) {}

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

  start(parts: IPart[], cartType: string) {
    this.show = true;
    this.errorMessage = '';
    this.parts = parts;
    this.cartType = cartType;
    this.pickabrickService.transferParts(this.parts, this.cartType);
  }

  onRetry() {
    this.errorMessage = '';
    this.pickabrickService.transferParts(this.parts, this.cartType);
  }

  onOpenLegoWebsite() {
    let affiliate = '';
    let url = 'https://www.lego.com/de-de';
    if (affiliate) {
      // if (affiliate.linkType == "webgains") {
      //   url = `https://track.webgains.com/click.html?wgcampaignid=${affiliate.wgcampaignid}&wgprogramid=${affiliate.wgprogramid}&clickref=${affiliate.clickref}&wgtarget=${target}`;
      // }
    }
    window.open(url, '_blank');
  }
}
