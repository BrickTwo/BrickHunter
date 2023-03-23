import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PabPriceComponent } from './pab-price.component';

describe('PabPriceComponent', () => {
  let component: PabPriceComponent;
  let fixture: ComponentFixture<PabPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PabPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PabPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
