import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';

import { PartsListListComponent } from './parts-list-list.component';

describe('PartsListListComponent', () => {
  let component: PartsListListComponent;
  let fixture: ComponentFixture<PartsListListComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(PartsListListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
