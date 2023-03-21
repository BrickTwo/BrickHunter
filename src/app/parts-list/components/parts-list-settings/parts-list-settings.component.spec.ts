import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsListSettingsComponent } from './parts-list-settings.component';

describe('PartsListSettingsComponent', () => {
  let component: PartsListSettingsComponent;
  let fixture: ComponentFixture<PartsListSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsListSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartsListSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
