import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePartsPartDetailComponent } from './browse-parts-part-detail.component';

describe('BrowsePartsPartDetailComponent', () => {
  let component: BrowsePartsPartDetailComponent;
  let fixture: ComponentFixture<BrowsePartsPartDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsePartsPartDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowsePartsPartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
