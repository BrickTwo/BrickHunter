import { Component } from '@angular/core';
import { ReadCartItem } from 'src/app/models/background-message';
import { Part } from 'src/app/models/parts-list';
import { PickABrickService } from '../../services/pickabrick.service';

@Component({
  selector: 'app-transfer-warning',
  templateUrl: './transfer-warning.component.html',
  styleUrls: ['./transfer-warning.component.scss'],
})
export class TransferWarningComponent {
  show = false;
  parts: { part: Part; cart: ReadCartItem | undefined }[];
  rowHeight = 91;

  constructor(private readonly pickabrickService: PickABrickService) {}

  open(partsWithWarning: { part: Part; cart: ReadCartItem | undefined }[]) {
    this.show = true;
    this.parts = partsWithWarning;
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
