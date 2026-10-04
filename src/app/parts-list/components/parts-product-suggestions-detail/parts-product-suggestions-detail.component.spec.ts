import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';

import { PartsProductSuggestionsDetailComponent } from './parts-product-suggestions-detail.component';

describe('PartsProductSuggestionsDetailComponent', () => {
  let component: PartsProductSuggestionsDetailComponent;
  let fixture: ComponentFixture<PartsProductSuggestionsDetailComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(PartsProductSuggestionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
