import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';

import { PartsListDetailComponent } from './parts-list-detail.component';

describe('PartsListDetailComponent', () => {
  let component: PartsListDetailComponent;
  let fixture: ComponentFixture<PartsListDetailComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(PartsListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles the initial tab event before a parts list is available', () => {
    component.uuid = 'not-yet-loaded';
    component.onTableChange({ id: 'all' });
    expect(component.parts).toEqual([]);
  });
});
