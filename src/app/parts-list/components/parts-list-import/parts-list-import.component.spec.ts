import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsListImportComponent } from './parts-list-import.component';

describe('PartsListImportComponent', () => {
  let component: PartsListImportComponent;
  let fixture: ComponentFixture<PartsListImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsListImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsListImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
