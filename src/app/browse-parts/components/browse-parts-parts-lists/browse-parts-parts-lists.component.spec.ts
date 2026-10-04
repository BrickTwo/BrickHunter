import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';

import { BrowsePartsPartsListsComponent } from './browse-parts-parts-lists.component';

describe('BrowsePartsPartsListsComponent', () => {
  let component: BrowsePartsPartsListsComponent;
  let fixture: ComponentFixture<BrowsePartsPartsListsComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(BrowsePartsPartsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
