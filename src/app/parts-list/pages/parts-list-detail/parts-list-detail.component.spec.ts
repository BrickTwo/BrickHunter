import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsListDetailComponent } from './parts-list-detail.component';

describe('PartsListDetailComponent', () => {
  let component: PartsListDetailComponent;
  let fixture: ComponentFixture<PartsListDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsListDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
