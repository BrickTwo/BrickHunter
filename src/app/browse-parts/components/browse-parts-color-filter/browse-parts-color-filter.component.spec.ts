import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePartsColorFilterComponent } from './browse-parts-color-filter.component';

describe('BrowsePartsColorFilterComponent', () => {
  let component: BrowsePartsColorFilterComponent;
  let fixture: ComponentFixture<BrowsePartsColorFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsePartsColorFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowsePartsColorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
