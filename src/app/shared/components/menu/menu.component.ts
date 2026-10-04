import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Menu, MenuModule as PrimeMenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

export interface BrickHunterMenuItem extends MenuItem {
  swatch?: { rgb: string };
}

// Keep BrickHunter templates behind the public PrimeNG Menu API.
@Component({
  selector: 'bh-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeMenuModule],
  template: `
    <p-menu
      #menu
      [model]="visibleModel"
      [popup]="popup"
      [appendTo]="appendTo"
      [baseZIndex]="baseZIndex"
      [autoZIndex]="autoZIndex"
      [style]="style"
      [styleClass]="'bh-menu-panel ' + styleClass"
      [showTransitionOptions]="showTransitionOptions"
      [hideTransitionOptions]="hideTransitionOptions"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      (onShow)="onShow.emit($event)"
      (onHide)="onHide.emit($event)">
      <ng-template pTemplate="item" let-item>
        <a
          *ngIf="item.routerLink; else externalLink"
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
          [state]="item.state"
          [routerLinkActive]="'p-menuitem-link-active'"
          [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
          [attr.title]="item.title"
          [attr.data-automationid]="item.automationId">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </a>
        <ng-template #externalLink>
          <a
            class="p-menu-item-link"
            data-pc-section="action"
            tabindex="-1"
            [attr.href]="item.url || null"
            [target]="item.target"
            [attr.title]="item.title"
            [attr.data-automationid]="item.automationId">
            <ng-container *ngTemplateOutlet="content"></ng-container>
          </a>
        </ng-template>
        <ng-template #content>
          <span
            *ngIf="item.icon"
            class="p-menu-item-icon"
            [ngClass]="[item.icon, item.iconClass || '']"
            [ngStyle]="item.iconStyle"></span>
          <span *ngIf="item.swatch" class="bh-menu-swatch" [style.background-color]="item.swatch.rgb"></span>
          <span class="p-menu-item-label">{{ item.label }}</span>
          <span *ngIf="item.badge" class="bh-menu-badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
        </ng-template>
      </ng-template>
      <ng-template pTemplate="submenuheader" let-item>{{ item.label }}</ng-template>
    </p-menu>
  `,
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent {
  @Input() popup = false;
  @Input() appendTo: string | HTMLElement | null = null;
  @Input() baseZIndex = 0;
  @Input() autoZIndex = true;
  @Input() style: Record<string, string> | null = null;
  @Input() styleClass = '';
  @Input() showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
  @Input() hideTransitionOptions = '.1s linear';
  @Input() ariaLabel: string | undefined;
  @Input() ariaLabelledBy: string | undefined;
  @Output() onShow = new EventEmitter<Event>();
  @Output() onHide = new EventEmitter<Event>();

  toggle(event: Event) {
    this.menu.toggle(event);
  }
  show(event: Event) {
    this.menu.show(event);
  }
  hide() {
    this.menu.hide();
  }

  @ViewChild('menu') menu!: Menu;
  visibleModel: BrickHunterMenuItem[] = [];

  @Input() set model(items: BrickHunterMenuItem[] | null | undefined) {
    // PrimeNG 18's keyboard lookup includes CSS-hidden menu items. Remove them
    // from the presented model so hidden groups and children cannot be activated.
    const visible = (model: BrickHunterMenuItem[]): BrickHunterMenuItem[] =>
      model
        .filter(item => item.visible !== false)
        .map(item => (item.items ? { ...item, items: visible(item.items) } : item));
    this.visibleModel = visible(items || []);
  }
}

@NgModule({
  imports: [MenuComponent],
  exports: [MenuComponent, RouterModule, TooltipModule],
})
export class MenuModule {}
