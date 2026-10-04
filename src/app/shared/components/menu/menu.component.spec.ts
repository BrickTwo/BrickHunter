import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';
import { MenuComponent } from './menu.component';

describe('BrickHunter menu regression reference', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let menu: MenuComponent;
  let command: jasmine.Spy;

  beforeEach(async () => {
    await configureComponentTestBed();
    fixture = TestBed.createComponent(MenuComponent);
    menu = fixture.componentInstance;
    command = jasmine.createSpy('command');
    menu.model = [
      { label: 'Red', swatch: { rgb: '#C91A09' }, command },
      { label: 'Disabled', disabled: true, command },
      { label: 'Hidden', visible: false, command },
      { label: 'Last', badge: '2', command },
    ];
    fixture.detectChanges();
  });

  it('renders template color labels, badges and hidden states', () => {
    expect(fixture.nativeElement.querySelector('.p-menuitem-text').textContent.trim()).toBe('Red');
    expect(fixture.nativeElement.querySelector('.bh-menu-swatch').style.backgroundColor).toBe('rgb(201, 26, 9)');
    expect(fixture.nativeElement.querySelector('.p-menuitem-badge').textContent).toBe('2');
    expect(fixture.nativeElement.querySelectorAll('.p-hidden').length).toBe(1);
  });

  it('renders label markup as text without creating HTML or style elements', () => {
    fixture.componentRef.setInput('model', [{ label: '<style>body { display: none; }</style><b>Red</b>', escape: false }]);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.p-menuitem-text');
    expect(label.textContent).toContain('<b>Red</b>');
    expect(label.querySelector('b, style')).toBeNull();
  });

  it('skips disabled, hidden and separator entries in both keyboard directions', () => {
    fixture.componentRef.setInput('model', [menu.model[0], menu.model[1], { separator: true }, menu.model[2], menu.model[3]]);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
    links[0].focus();
    links[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(links[3]);
    links[3].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(links[0]);
    links[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(links[0]);
  });

  it('prevents Enter and Space from running disabled or hidden commands', () => {
    const links = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
    for (const code of ['Enter', 'Space']) {
      links[1].dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));
      links[2].dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));
    }
    expect(command).not.toHaveBeenCalled();
    links[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }));
    expect(command).toHaveBeenCalledTimes(1);
    expect(links[1].getAttribute('aria-disabled')).toBe('true');
  });

  it('keeps group labels, icons, badges and router links while skipping hidden groups', () => {
    fixture.componentRef.setInput('model', [
      { label: 'Colors', items: [menu.model[0]] },
      { label: 'Hidden group', visible: false, items: [{ label: 'Hidden child' }] },
      { label: 'Actions', items: [{ label: 'Lists', icon: 'fa fa-list', badge: '2', routerLink: '/parts-list' }] },
    ]);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
    expect(fixture.nativeElement.querySelector('.p-submenu-header').textContent).toContain('Colors');
    expect(links[2].getAttribute('href')).toBe('/parts-list');
    expect(links[2].querySelector('.p-menuitem-icon').classList.contains('fa-list')).toBeTrue();
    expect(links[2].querySelector('.p-menuitem-badge').textContent).toBe('2');
    links[0].focus();
    links[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(links[2]);
  });

  it('closes a popup with Escape and returns focus to its trigger', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    try {
      fixture.componentRef.setInput('popup', true);
      fixture.detectChanges();
      await fixture.whenStable();
      menu.show({ currentTarget: trigger });
      fixture.detectChanges();
      await fixture.whenStable();
      const link = fixture.nativeElement.querySelector('[role="menuitem"]');
      link.focus();
      link.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }));
      expect(menu.visible).toBeFalse();
      expect(document.activeElement).toBe(trigger);
    } finally {
      trigger.remove();
    }
  });

  it('positions an appended popup above overlays and closes it on parent scroll or resize', async () => {
    const parent = document.createElement('div');
    parent.style.overflow = 'auto';
    const trigger = document.createElement('button');
    parent.appendChild(trigger);
    document.body.appendChild(parent);
    try {
      fixture.componentRef.setInput('popup', true);
      fixture.componentRef.setInput('appendTo', 'body');
      fixture.componentRef.setInput('baseZIndex', 2000);
      fixture.detectChanges();
      await fixture.whenStable();
      const open = async () => {
        menu.show({ currentTarget: trigger });
        fixture.detectChanges();
        await fixture.whenStable();
      };
      await open();
      const panel = document.body.querySelector<HTMLElement>('.bh-menu-panel');
      expect(panel.parentElement).toBe(document.body);
      expect(Number(panel.style.zIndex)).toBeGreaterThan(2000);
      expect(panel.style.top).not.toBe('');
      parent.dispatchEvent(new Event('scroll'));
      expect(menu.visible).toBeFalse();
      fixture.detectChanges();
      await fixture.whenStable();
      await open();
      window.dispatchEvent(new Event('resize'));
      expect(menu.visible).toBeFalse();
      fixture.destroy();
      await fixture.whenRenderingDone();
      // Angular keeps the fixture's host in the test DOM; the appended panel must return to that host.
      expect(document.body.querySelector(':scope > .bh-menu-panel')).toBeNull();
      expect(menu.container.parentElement).toBe(fixture.nativeElement);
      expect(menu.documentResizeListener).toBeNull();
      expect(menu.scrollHandler).toBeNull();
    } finally {
      parent.remove();
    }
  });

  it('runs enabled commands and prevents disabled commands', () => {
    const links = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
    links[1].click();
    expect(command).not.toHaveBeenCalled();
    links[0].click();
    expect(command).toHaveBeenCalledTimes(1);
    expect(command.calls.mostRecent().args[0].item).toBe(menu.model[0]);
  });

  it('moves keyboard focus between enabled entries', () => {
    fixture.componentRef.setInput('model', [menu.model[0], menu.model[3]]);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
    links[0].focus();
    links[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(links[1]);
    links[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(links[0]);
  });

  it('closes a popup on outside click and releases document listeners on destruction', async () => {
    fixture.componentRef.setInput('popup', true);
    fixture.detectChanges();
    await fixture.whenStable();
    menu.show({ currentTarget: fixture.nativeElement });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(menu.visible).toBeTrue();
    expect(menu.documentClickListener).toBeTruthy();
    // The opening event is ignored once; the next outside click closes it.
    document.body.click();
    document.body.click();
    expect(menu.visible).toBeFalse();
    fixture.destroy();
    expect(menu.documentClickListener).toBeNull();
    expect(menu.documentResizeListener).toBeNull();
    expect(menu.scrollHandler).toBeNull();
  });
});
