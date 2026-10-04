import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';

import { BrowsePartsPartDetailComponent } from './browse-parts-part-detail.component';

describe('BrowsePartsPartDetailComponent', () => {
  let component: BrowsePartsPartDetailComponent;
  let fixture: ComponentFixture<BrowsePartsPartDetailComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(BrowsePartsPartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
