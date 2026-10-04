import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';

import { BrowsePartsComponent } from './browse-parts.component';

describe('BrowsePartsComponent', () => {
  let component: BrowsePartsComponent;
  let fixture: ComponentFixture<BrowsePartsComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(BrowsePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
