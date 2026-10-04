import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';

import { BrowsePartsCategorySelectionComponent } from './browse-parts-category-selection.component';

describe('BrowsePartsCategorySelectionComponent', () => {
  let component: BrowsePartsCategorySelectionComponent;
  let fixture: ComponentFixture<BrowsePartsCategorySelectionComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(BrowsePartsCategorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
