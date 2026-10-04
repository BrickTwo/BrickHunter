import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';
import { referenceLists } from 'src/testing/upgrade-fixtures';
import { PartsListSettingsComponent } from './parts-list-settings.component';

describe('PartsListSettingsComponent Angular 18 checkbox labels', () => {
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
});
