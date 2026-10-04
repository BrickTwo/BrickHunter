import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';
import { referenceSearch } from 'src/testing/upgrade-fixtures';

import { BrowsePartsDataViewComponent } from './browse-parts-data-view.component';

describe('BrowsePartsDataViewComponent', () => {
  let component: BrowsePartsDataViewComponent;
  let fixture: ComponentFixture<BrowsePartsDataViewComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(BrowsePartsDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps a bounded slice and matching spacer heights for 1000 parts after scroll and resize', () => {
    component.parts = referenceSearch(1000).bricks;
    const rect = spyOn(component.gridRef, 'getBoundingClientRect');
    rect.and.returnValue(new DOMRect(0, -656, 1000, 65600));
    window.dispatchEvent(new Event('scroll'));
    expect(component.showFromIndex).toBe(5);
    expect(component.getParts()[0].elementId).toBe(300126);
    expect(component.getParts().length).toBeLessThan(50);
    expect(component.getTopStyle()).toBe('height: 328px');
    expect(component.rowsTop + component.rowsBottom).toBeLessThan(component.totalRows);

    rect.and.returnValue(new DOMRect(0, -656, 400, 164000));
    window.dispatchEvent(new Event('resize'));
    expect(component.showFromIndex).toBe(2);
    expect(component.getParts()[0].elementId).toBe(300123);
    expect(component.totalRows).toBe(500);
  });

  it('renders an empty search without stale cards or spacer rows', () => {
    component.parts = [];
    spyOn(component.gridRef, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 1000, 0));
    component.calcVisible();
    fixture.detectChanges();
    expect(component.getParts()).toEqual([]);
    expect(component.rowsTop).toBe(0);
    expect(component.rowsBottom).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('app-browse-parts-grid-item').length).toBe(0);
  });

  it('removes its scroll and resize listeners when destroyed', () => {
    fixture.destroy();
    const calculate = spyOn(component, 'calcVisible');
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
    expect(calculate).not.toHaveBeenCalled();
  });
});
