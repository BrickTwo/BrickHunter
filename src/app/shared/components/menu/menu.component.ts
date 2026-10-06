import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
      [motionOptions]="motionOptions"
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      (onShow)="handleShow($event)"
      (onHide)="handleHide($event)">
      <ng-template pTemplate="item" let-item>
        @if (item.routerLink) {
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
            [state]="item.state"
            [routerLinkActive]="'p-menuitem-link-active'"
            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
            [attr.title]="item.title"
            [attr.data-automationid]="item.automationId">
            <ng-container *ngTemplateOutlet="content"></ng-container>
          </a>
        } @else {
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
        }
        <ng-template #content>
          @if (item.icon) {
            <span
              class="p-menu-item-icon"
              [ngClass]="[item.icon, item.iconClass || '']"
              [ngStyle]="item.iconStyle"></span>
          }
          @if (item.swatch) {
            <span class="bh-menu-swatch" [style.background-color]="item.swatch.rgb"></span>
          }
          <span class="p-menu-item-label">{{ item.label }}</span>
          @if (item.badge) {
            <span class="bh-menu-badge" [ngClass]="item.badgeStyleClass">{{ item.badge }}</span>
          }
        </ng-template>
      </ng-template>
      <ng-template pTemplate="submenuheader" let-item>{{ item.label }}</ng-template>
    </p-menu>
  `,
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent implements OnDestroy {
  @Input() popup = false;
  @Input() appendTo: string | HTMLElement | null = null;
  @Input() baseZIndex = 0;
  @Input() autoZIndex = true;
  @Input() style: Record<string, string> | null = null;
  @Input() styleClass = '';
  readonly motionOptions = { duration: { enter: 120, leave: 100 } };
  @Input() ariaLabel: string | undefined;
  @Input() ariaLabelledBy: string | undefined;
  @Output() onShow = new EventEmitter<Event>();
  @Output() onHide = new EventEmitter<Event>();

  private removeWindowScrollListener?: () => void;

  constructor(private readonly renderer: Renderer2) {}

  handleShow(event: Event) {
    // PrimeNG watches scrollable parents; document scrolling also needs to close
    // the popup when none of the trigger's parents has overflow auto/scroll.
    if (this.popup && !this.removeWindowScrollListener) {
      this.removeWindowScrollListener = this.renderer.listen('window', 'scroll', () => this.hide());
    }
    this.onShow.emit(event);
  }

  handleHide(event: Event) {
    this.clearWindowScrollListener();
    this.onHide.emit(event);
  }

  ngOnDestroy() {
    this.clearWindowScrollListener();
  }

  private clearWindowScrollListener() {
    this.removeWindowScrollListener?.();
    this.removeWindowScrollListener = undefined;
  }

  toggle(event: Event) {
    this.menu.toggle(event);
  }
  show(event: Event) {
    this.menu.show(event);
  }
  hide() {
    // CSS leave animations finish later; stop listening as soon as hiding starts.
    this.clearWindowScrollListener();
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
