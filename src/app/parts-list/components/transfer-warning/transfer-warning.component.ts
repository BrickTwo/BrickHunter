import { Component } from '@angular/core';
import { IReadCartItem } from 'src/app/models/background-message';
import { IPart } from 'src/app/models/parts-list';
import { PickABrickService } from '../../services/pickabrick.service';

@Component({
  selector: 'app-transfer-warning',
  templateUrl: './transfer-warning.component.html',
  styleUrls: ['./transfer-warning.component.scss'],
})
export class TransferWarningComponent {
  show = false;
  parts: { part: IPart; cart: IReadCartItem | undefined }[];
  rowHeight = 91;

  constructor(private readonly pickabrickService: PickABrickService) {}

  open(partsWithWarning: { part: IPart; cart: IReadCartItem | undefined }[]) {
    this.show = true;
    this.parts = partsWithWarning;
  }

  onContinue() {
    this.pickabrickService.continueTransfer(this.parts.map(row => row.part));
    this.show = false;
  }

  onCancel() {
    this.pickabrickService.cancelTransfer();
    this.show = false;
  }

  caclImageUrl(part: IPart) {
    return `https://brickhunter.blob.core.windows.net/parts/pab/${part.lego.elementId}.jpg`;
  }
}
