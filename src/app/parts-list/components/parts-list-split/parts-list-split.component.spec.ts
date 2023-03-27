import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsListSplitComponent } from './parts-list-split.component';

describe('PartsListSplitComponent', () => {
  let component: PartsListSplitComponent;
  let fixture: ComponentFixture<PartsListSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsListSplitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsListSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
