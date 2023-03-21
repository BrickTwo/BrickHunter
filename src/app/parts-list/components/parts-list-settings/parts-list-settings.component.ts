import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-parts-list-settings',
  templateUrl: './parts-list-settings.component.html',
  styleUrls: ['./parts-list-settings.component.scss']
})
export class PartsListSettingsComponent {
  display = false;
  selectedDistribution: string[] = [];

  public open() {
    this.display = true;
  }

  onSubmit(importForm: NgForm) {
      this.display = false;
  }
}
