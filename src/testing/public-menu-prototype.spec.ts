import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { providePrimeNG } from 'primeng/config';
import { BrickHunterPreset } from '../app/shared/theme/brickhunter-preset';
import { PublicMenuPrototype } from './public-menu-prototype';

describe('PrimeNG 18 public menu wrapper experiment', () => {
  let fixture: ComponentFixture<PublicMenuPrototype>;
  let command: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicMenuPrototype, NoopAnimationsModule, RouterTestingModule.withRoutes([])],
      providers: [providePrimeNG({ theme: { preset: BrickHunterPreset, options: { darkModeSelector: false } } })],
    }).compileComponents();
    fixture = TestBed.createComponent(PublicMenuPrototype);
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

  async function open(trigger: HTMLElement) {
    fixture.componentRef.setInput('popup', true);
    fixture.componentRef.setInput('appendTo', 'body');
    fixture.componentRef.setInput('baseZIndex', 2000);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.menu.show({ currentTarget: trigger });
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
