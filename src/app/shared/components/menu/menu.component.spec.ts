import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { providePrimeNG } from 'primeng/config';
import { BrickHunterPreset } from '../../theme/brickhunter-preset';
import { MenuComponent } from './menu.component';

describe('BrickHunter public menu wrapper', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let command: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, NoopAnimationsModule, RouterTestingModule.withRoutes([])],
      providers: [providePrimeNG({ theme: { preset: BrickHunterPreset, options: { darkModeSelector: false } } })],
    }).compileComponents();
    fixture = TestBed.createComponent(MenuComponent);
    command = jasmine.createSpy('command');
    fixture.componentRef.setInput('model', [
      { label: 'Red', swatch: { rgb: '#C91A09' }, command },
      { label: 'Disabled', disabled: true, command },
      { label: 'Hidden', visible: false, command },
      { separator: true },
      { label: 'Last', badge: '2', command },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  const key = (element: HTMLElement, code: string) =>
    element.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));

  it('renders structured swatches and badges and executes one enabled command', () => {
    const first = fixture.nativeElement.querySelector('.p-menu-item-link');
    expect(first.querySelector('.bh-menu-swatch').style.backgroundColor).toBe('rgb(201, 26, 9)');
    expect(fixture.nativeElement.querySelector('.bh-menu-badge').textContent).toBe('2');
    first.click();
    expect(command).toHaveBeenCalledTimes(1);
    fixture.nativeElement.querySelectorAll('.p-menu-item-link')[1].click();
    expect(command).toHaveBeenCalledTimes(1);
  });

  it('uses public keyboard navigation without activating disabled, hidden or separator entries', () => {
    const list = fixture.nativeElement.querySelector('[role="menu"]');
    list.focus();
    key(list, 'ArrowDown');
    key(list, 'ArrowDown');
    fixture.detectChanges();
    const active = fixture.nativeElement.querySelector('.p-menu-item.p-focus');
    expect(active.textContent).toContain('Last');
    key(list, 'Enter');
    expect(command).toHaveBeenCalledTimes(1);
    expect(command.calls.mostRecent().args[0].item.label).toBe('Last');
    key(list, 'ArrowUp');
    key(list, 'Space');
    expect(command).toHaveBeenCalledTimes(2);
    expect(command.calls.mostRecent().args[0].item.label).toBe('Red');
  });

  it('keeps grouped safe text, router links and icons while removing hidden groups', () => {
    fixture.componentRef.setInput('model', [
      { label: '<b>Colors</b>', items: [{ label: '<style>Red</style>', escape: false }] },
      { label: 'Hidden group', visible: false, items: [{ label: 'Hidden child' }] },
      { label: 'Actions', items: [{ label: 'Lists', icon: 'fa fa-list', routerLink: '/parts-list' }] },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('<b>Colors</b>');
    expect(fixture.nativeElement.textContent).toContain('<style>Red</style>');
    expect(fixture.nativeElement.textContent).not.toContain('Hidden child');
    expect(fixture.nativeElement.querySelector('b, style')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('a')[1].getAttribute('href')).toBe('/parts-list');
    expect(fixture.nativeElement.querySelector('.fa-list')).not.toBeNull();
  });

  it('renders untrusted item labels as text and preserves link metadata', () => {
    fixture.componentRef.setInput('model', [
      {
        label: '<b>Red</b>',
        escape: false,
        url: 'https://example.com/',
        target: '_blank',
        title: 'Color details',
        automationId: 'red',
        icon: 'fa fa-list',
        iconClass: 'extra-icon',
        iconStyle: { color: 'red' },
      },
    ]);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a');
    expect(link.textContent).toContain('<b>Red</b>');
    expect(link.querySelector('b')).toBeNull();
    expect(link.getAttribute('href')).toBe('https://example.com/');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('title')).toBe('Color details');
    expect(link.getAttribute('data-automationid')).toBe('red');
    expect(link.querySelector('.extra-icon').style.color).toBe('red');
  });

  it('does not mutate the source model when filtering hidden children and replacing it', () => {
    const child = { label: 'Hidden child', visible: false };
    const source = [{ label: 'Colors', items: [child, { label: 'Red' }] }];
    fixture.componentRef.setInput('model', source);
    fixture.detectChanges();
    expect(source[0].items.length).toBe(2);
    expect(fixture.componentInstance.visibleModel[0].items.length).toBe(1);
    fixture.componentRef.setInput('model', null);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="menuitem"]').length).toBe(0);
  });

  it('uses Home and End to reach enabled entries and retains their command identity', () => {
    const list = fixture.nativeElement.querySelector('[role="menu"]');
    list.focus();
    key(list, 'End');
    key(list, 'Enter');
    expect(command.calls.mostRecent().args[0].item).toBe(fixture.componentInstance.visibleModel[3]);
    key(list, 'Home');
    key(list, 'Space');
    expect(command.calls.mostRecent().args[0].item).toBe(fixture.componentInstance.visibleModel[0]);
    expect(command).toHaveBeenCalledTimes(2);
  });

  it('does not execute disabled or hidden commands when no enabled item exists', () => {
    fixture.componentRef.setInput('model', [
      { label: 'Disabled', disabled: true, command },
      { label: 'Hidden', visible: false, command },
      { separator: true },
    ]);
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="menu"]');
    list.focus();
    for (const code of ['ArrowDown', 'Enter', 'Space', 'Home', 'End', 'Enter']) key(list, code);
    fixture.nativeElement.querySelector('.p-menu-item-link').click();
    expect(command).not.toHaveBeenCalled();
  });

  it('forwards toggle, hide and popup lifecycle events through the wrapper', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    const shown = jasmine.createSpy('shown');
    const hidden = jasmine.createSpy('hidden');
    fixture.componentInstance.onShow.subscribe(shown);
    fixture.componentInstance.onHide.subscribe(hidden);
    try {
      fixture.componentRef.setInput('popup', true);
      fixture.detectChanges();
      await fixture.whenStable();
      shown.calls.reset();
      hidden.calls.reset();
      fixture.componentInstance.toggle({ currentTarget: trigger } as unknown as Event);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.componentInstance.menu.visible).toBeTrue();
      expect(shown).toHaveBeenCalledTimes(1);
      fixture.componentInstance.hide();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.componentInstance.menu.visible).toBeFalse();
      expect(hidden).toHaveBeenCalledTimes(1);
    } finally {
      fixture.destroy();
      trigger.remove();
    }
  });

  async function open(trigger: HTMLElement) {
    fixture.componentRef.setInput('popup', true);
    fixture.componentRef.setInput('appendTo', 'body');
    fixture.componentRef.setInput('baseZIndex', 2000);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.show({ currentTarget: trigger } as unknown as Event);
    fixture.detectChanges();
    await fixture.whenStable();
    return document.body.querySelector<HTMLElement>('.p-menu-overlay');
  }

  it('appends and positions a popup above overlays and returns focus on Escape', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    try {
      const panel = await open(trigger);
      expect(panel.parentElement).toBe(document.body);
      expect(Number(panel.style.zIndex)).toBeGreaterThan(2000);
      expect(panel.style.top).not.toBe('');
      key(panel.querySelector('[role="menu"]'), 'Escape');
      expect(fixture.componentInstance.menu.visible).toBeFalse();
      expect(document.activeElement).toBe(trigger);
    } finally {
      fixture.destroy();
      trigger.remove();
    }
  });

  it('closes on window scrolling and removes that listener after hiding and destruction', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    const hide = spyOn(fixture.componentInstance, 'hide').and.callThrough();
    try {
      await open(trigger);
      window.dispatchEvent(new Event('scroll'));
      expect(fixture.componentInstance.menu.visible).toBeFalse();
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      expect(hide).toHaveBeenCalledTimes(1);
      window.dispatchEvent(new Event('scroll'));
      expect(hide).toHaveBeenCalledTimes(1);
      await open(trigger);
      fixture.destroy();
      window.dispatchEvent(new Event('scroll'));
      expect(hide).toHaveBeenCalledTimes(1);
    } finally {
      if (!fixture.componentRef.hostView.destroyed) fixture.destroy();
      trigger.remove();
    }
  });

  it('closes on outside clicks, parent scroll and resize and cleans up the appended panel', async () => {
    const parent = document.createElement('div');
    parent.style.overflow = 'auto';
    const trigger = document.createElement('button');
    parent.appendChild(trigger);
    document.body.appendChild(parent);
    try {
      await open(trigger);
      document.body.click();
      expect(fixture.componentInstance.menu.visible).toBeFalse();
      await open(trigger);
      parent.dispatchEvent(new Event('scroll'));
      expect(fixture.componentInstance.menu.visible).toBeFalse();
      await open(trigger);
      window.dispatchEvent(new Event('resize'));
      expect(fixture.componentInstance.menu.visible).toBeFalse();
      await open(trigger);
      fixture.destroy();
      await fixture.whenRenderingDone();
      // Angular retains the test host; no panel may remain appended directly to body.
      expect(document.body.querySelector(':scope > .p-menu-overlay')).toBeNull();
      expect(() => {
        parent.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('resize'));
      }).not.toThrow();
    } finally {
      if (!fixture.componentRef.hostView.destroyed) fixture.destroy();
      parent.remove();
    }
  });
});
