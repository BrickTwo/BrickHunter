import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';

import { TransferWarningComponent } from './transfer-warning.component';

describe('TransferWarningComponent', () => {
  let component: TransferWarningComponent;
  let fixture: ComponentFixture<TransferWarningComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(TransferWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clears a previous lot-limit warning when reopened without an exceeded limit', () => {
    component.open([], true);
    fixture.detectChanges();
    expect(component.warningMaxPaBLotPerOrder.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('It is not possible to order more than');
    component.open([], false);
    fixture.detectChanges();
    expect(component.warningMaxPaBLotPerOrder).toEqual([]);
    expect(fixture.nativeElement.textContent).not.toContain('It is not possible to order more than');
  });
});
