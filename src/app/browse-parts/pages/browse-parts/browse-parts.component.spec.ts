import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePartsComponent } from './browse-parts.component';

describe('BrowsePartsComponent', () => {
  let component: BrowsePartsComponent;
  let fixture: ComponentFixture<BrowsePartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsePartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowsePartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
