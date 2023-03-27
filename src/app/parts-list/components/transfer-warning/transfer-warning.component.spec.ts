import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferWarningComponent } from './transfer-warning.component';

describe('TransferWarningComponent', () => {
  let component: TransferWarningComponent;
  let fixture: ComponentFixture<TransferWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferWarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
