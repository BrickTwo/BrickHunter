import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePartsGridItemComponent } from './browse-parts-grid-item.component';

describe('BrowsePartsGridItemComponent', () => {
  let component: BrowsePartsGridItemComponent;
  let fixture: ComponentFixture<BrowsePartsGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsePartsGridItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowsePartsGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
