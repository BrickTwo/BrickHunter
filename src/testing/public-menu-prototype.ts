import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Menu, MenuModule } from 'primeng/menu';
import { BrickHunterMenuItem } from '../app/shared/components/menu/menu.component';

// Upgrade experiment only: this component is never imported by the application.
@Component({
  selector: 'bh-public-menu-prototype',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule],
  template: `
    <p-menu #menu [model]="visibleModel" [popup]="popup" [appendTo]="appendTo" [baseZIndex]="baseZIndex">
      <ng-template pTemplate="item" let-item>
        <a
          class="p-menu-item-link"
          data-pc-section="action"
          tabindex="-1"
          [attr.href]="item.routerLink ? null : item.url || null"
          [routerLink]="item.routerLink"
          [queryParams]="item.queryParams"
          [fragment]="item.fragment"
          [target]="item.target"
          [queryParamsHandling]="item.queryParamsHandling"
          [preserveFragment]="item.preserveFragment"
          [skipLocationChange]="item.skipLocationChange"
          [replaceUrl]="item.replaceUrl"
          [state]="item.state">
          <span *ngIf="item.icon" class="p-menu-item-icon" [ngClass]="item.icon"></span>
          <span *ngIf="item.swatch" class="bh-menu-swatch" [style.background-color]="item.swatch.rgb"></span>
          <span class="p-menu-item-label">{{ item.label }}</span>
          <span *ngIf="item.badge" class="bh-menu-badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
        </a>
      </ng-template>
      <ng-template pTemplate="submenuheader" let-item>{{ item.label }}</ng-template>
    </p-menu>
  `,
})
export class PublicMenuPrototype {
  @Input() popup = false;
  @Input() appendTo: string | null = null;
  @Input() baseZIndex = 0;
  @ViewChild('menu') menu!: Menu;
  visibleModel: BrickHunterMenuItem[] = [];

  @Input() set model(items: BrickHunterMenuItem[]) {
    // PrimeNG 18's keyboard lookup includes CSS-hidden menu items. Remove them
    // from the presented model so hidden groups and children cannot be activated.
    const visible = (model: BrickHunterMenuItem[]): BrickHunterMenuItem[] =>
      model
        .filter(item => item.visible !== false)
        .map(item => (item.items ? { ...item, items: visible(item.items) } : item));
    this.visibleModel = visible(items);
  }
}
