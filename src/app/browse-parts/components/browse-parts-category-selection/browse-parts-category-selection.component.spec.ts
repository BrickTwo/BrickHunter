import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePartsCategorySelectionComponent } from './browse-parts-category-selection.component';

describe('BrowsePartsCategorySelectionComponent', () => {
  let component: BrowsePartsCategorySelectionComponent;
  let fixture: ComponentFixture<BrowsePartsCategorySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsePartsCategorySelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowsePartsCategorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
