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
});
