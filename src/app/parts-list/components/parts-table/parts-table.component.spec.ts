import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';
import { referenceLists, referenceTableParts } from 'src/testing/upgrade-fixtures';
import { IndexedDBService } from 'src/app/core/services/indexeddb.service.ts';
import { PartsListService } from '../../services/parts-list.service';
import { PartsTableComponent } from './parts-table.component';

describe('PartsTableComponent upgrade reference', () => {
  let fixture: ComponentFixture<PartsTableComponent>;
  let component: PartsTableComponent;

  beforeEach(async () => {
    await configureComponentTestBed();
    const lists = referenceLists();
    lists[0].parts = referenceTableParts();
    TestBed.inject(PartsListService).setPartsLists(lists);
    fixture = TestBed.createComponent(PartsTableComponent);
    component = fixture.componentInstance;
    // Initialize the empty view first, as happens while the list loads in the app.
    fixture.componentRef.setInput('partsListUuid', lists[0].uuid);
    fixture.componentRef.setInput('allowEdit', true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentRef.setInput('parts', lists[0].parts);
    fixture.detectChanges();
  });

  it('shows quantity, have quantity and max-order warnings from populated lists', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('300121');
    expect(text).toContain('have: 3');
    expect(text).toContain('max: 100');
    const renderedRows = fixture.nativeElement.querySelectorAll('.p-datatable-tbody tr').length;
    expect(renderedRows).toBeGreaterThanOrEqual(3);
    expect(renderedRows).toBeLessThanOrEqual(8);
    expect(component.parts.length).toBe(8);
  });

  it('updates the list and in-memory persistence through the real inline number editor', async () => {
    const cell: HTMLElement = fixture.nativeElement.querySelector('td.p-editable-column');
    cell.click();
    fixture.detectChanges();
    const input: HTMLInputElement = cell.querySelector('input');
    expect(input).toBeTruthy();
    input.value = '17';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(TestBed.inject(PartsListService).getPartsList('upgrade-reference').parts[0].qty).toBe(17);
    expect(TestBed.inject(IndexedDBService).partsLists.put).toHaveBeenCalled();
  });

  it('renders the placeholder after an image failure without corrupting the Image input signal', () => {
    const image: HTMLImageElement = fixture.nativeElement.querySelector('p-image img');
    expect(image).toBeTruthy();
    image.dispatchEvent(new Event('error'));
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(image.getAttribute('src')).toBe('./assets/placeholder.png');
    expect(component.caclImageUrl(component.parts[0])).toBe('./assets/placeholder.png');
  });

  it('emits selected parts for copy without changing the source list', () => {
    component.selectedParts = [component.parts[0], component.parts[1]];
    const copy = jasmine.createSpy('bulk copy');
    component.bulkAction.subscribe(copy);
    component.onCopyTo();
    expect(copy).toHaveBeenCalledWith({ action: 'copy', parts: component.selectedParts });
    expect(TestBed.inject(PartsListService).getPartsList('upgrade-reference').parts.length).toBe(8);
  });
});
