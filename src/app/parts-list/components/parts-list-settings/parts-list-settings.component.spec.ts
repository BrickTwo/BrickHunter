import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';
import { referenceLists } from 'src/testing/upgrade-fixtures';
import { PartsListSettingsComponent } from './parts-list-settings.component';

describe('PartsListSettingsComponent Angular 18 form controls', () => {
  let fixture: ComponentFixture<PartsListSettingsComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();
    fixture = TestBed.createComponent(PartsListSettingsComponent);
    fixture.componentRef.setInput('partsList', referenceLists()[0]);
    fixture.componentInstance.open();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('toggles each reactive form checkbox through its associated label', () => {
    for (const name of ['subtractHaveFromQuantity', 'ignoreBrickLinkPrices', 'subtractBrickLinkPrice']) {
      const control = fixture.componentInstance.form.get(name);
      control.setValue(false);
      fixture.detectChanges();
      const label: HTMLLabelElement = fixture.nativeElement.querySelector(`label[for="${name}"]`);
      expect(label).toBeTruthy();
      label.click();
      fixture.detectChanges();
      expect(control.value).withContext(name).toBeTrue();
      label.click();
      fixture.detectChanges();
      expect(control.value).withContext(name).toBeFalse();
    }
  });

  it('handles Escape in the open unit popup and passes it to the enclosing overlay when closed', async () => {
    const combo: HTMLElement = fixture.nativeElement.querySelector('[role="combobox"]');
    combo.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(combo.getAttribute('aria-expanded')).toBe('true');
    const bubbledEscape = jasmine.createSpy('document Escape');
    document.addEventListener('keydown', bubbledEscape);
    try {
      combo.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(combo.getAttribute('aria-expanded')).toBe('false');
      expect(fixture.componentInstance.display).toBeTrue();
      expect(bubbledEscape).not.toHaveBeenCalled();
      fixture.detectChanges();
      combo.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
      fixture.detectChanges();
      expect(bubbledEscape).toHaveBeenCalledTimes(1);
    } finally {
      document.removeEventListener('keydown', bubbledEscape);
    }
  });
});
