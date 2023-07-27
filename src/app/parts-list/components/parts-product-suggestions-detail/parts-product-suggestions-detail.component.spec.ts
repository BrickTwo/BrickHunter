import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsProductSuggestionsDetailComponent } from './parts-product-suggestions-detail.component';

describe('PartsProductSuggestionsDetailComponent', () => {
  let component: PartsProductSuggestionsDetailComponent;
  let fixture: ComponentFixture<PartsProductSuggestionsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsProductSuggestionsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsProductSuggestionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
