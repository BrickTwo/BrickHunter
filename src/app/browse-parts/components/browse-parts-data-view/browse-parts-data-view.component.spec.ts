import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePartsDataViewComponent } from './browse-parts-data-view.component';

describe('BrowsePartsDataViewComponent', () => {
  let component: BrowsePartsDataViewComponent;
  let fixture: ComponentFixture<BrowsePartsDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsePartsDataViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowsePartsDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
