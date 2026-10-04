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
      { label: '<span class="reference-swatch" style="background-color: #C91A09">Red</span>', escape: false, command },
      { label: 'Disabled', disabled: true, command },
      { label: 'Hidden', visible: false },
      { label: 'Last', badge: '2', command },
    ];
    fixture.detectChanges();
  });

  it('renders HTML color labels, badges and hidden states', () => {
    expect(fixture.nativeElement.querySelector('.reference-swatch').textContent).toBe('Red');
    expect(fixture.nativeElement.querySelector('.reference-swatch').style.backgroundColor).toBe('rgb(201, 26, 9)');
    expect(fixture.nativeElement.querySelector('.p-menuitem-badge').textContent).toBe('2');
    expect(fixture.nativeElement.querySelectorAll('.p-hidden').length).toBe(1);
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
