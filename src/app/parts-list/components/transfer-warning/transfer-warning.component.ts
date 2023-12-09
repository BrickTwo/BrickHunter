import { Component } from '@angular/core';
import { ReadCartItem } from 'src/app/models/background-message';
import { Part } from 'src/app/models/parts-list';
import { PickABrickService } from '../../services/pickabrick.service';
import { GlobalSettingsService } from 'src/app/core/services/global-settings.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-transfer-warning',
  templateUrl: './transfer-warning.component.html',
  styleUrls: ['./transfer-warning.component.scss'],
})
export class TransferWarningComponent {
  show = false;
  parts: { part: Part; cart: ReadCartItem | undefined }[];
  rowHeight = 91;
  maxPaBLotPerOrder = 0;
  warningMaxPaBLotPerOrder: Message[];

  constructor(private readonly pickabrickService: PickABrickService, private readonly globalSettingsService: GlobalSettingsService) {
    this.maxPaBLotPerOrder = this.globalSettingsService.maxPaBLotPerOrder;
  }

  open(partsWithWarning: { part: Part; cart: ReadCartItem | undefined }[], maxPaBLotPerOrderExceeded: boolean) {
    this.show = true;
    this.parts = partsWithWarning;

    if(maxPaBLotPerOrderExceeded) {
      this.warningMaxPaBLotPerOrder = [
        {
          severity: 'warn',
          summary: 'Warning',
          detail:
            `It is not possible to order more than ${this.maxPaBLotPerOrder} lots for each Bestseller and Standard parts per order. You may want to try the split function first.`,
        },
      ];
    }
  }

  onContinue() {
    this.pickabrickService.continueTransfer();
    this.show = false;
  }

  onCancel() {
    this.pickabrickService.cancelTransfer();
    this.show = false;
  }

  caclImageUrl(part: Part) {
    return `https://brickhunter.blob.core.windows.net/parts/pab/${part.lego.elementId}.jpg`;
  }
}
