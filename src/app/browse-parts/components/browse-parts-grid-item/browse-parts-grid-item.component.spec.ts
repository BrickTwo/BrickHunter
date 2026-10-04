import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';
import { referencePart } from 'src/testing/upgrade-fixtures';

import { BrowsePartsGridItemComponent } from './browse-parts-grid-item.component';

describe('BrowsePartsGridItemComponent', () => {
  let component: BrowsePartsGridItemComponent;
  let fixture: ComponentFixture<BrowsePartsGridItemComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(BrowsePartsGridItemComponent);
    component = fixture.componentInstance;
    component.part = referencePart();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
