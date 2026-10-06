import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';
import { PartsListImportComponent } from './parts-list-import.component';

describe('Parts list local file selection', () => {
  let fixture: ComponentFixture<PartsListImportComponent>;
  let component: PartsListImportComponent;

  beforeEach(async () => {
    await configureComponentTestBed();
    fixture = TestBed.createComponent(PartsListImportComponent);
    component = fixture.componentInstance;
    component.open();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  async function select(file: File, drop = false) {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    // FileReader events are not tracked by Angular's stability API.
    const loaded = file.type === 'text/plain' ? Promise.resolve() : new Promise<void>(resolve => {
      const subscription = component.form.controls.content.valueChanges.subscribe(() => {
        subscription.unsubscribe();
        resolve();
      });
    });
    if (drop) {
      fixture.nativeElement.querySelector('.p-fileupload-content').dispatchEvent(
        new DragEvent('drop', { dataTransfer: transfer, bubbles: true, cancelable: true })
      );
    } else {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
      input.files = transfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    await loaded;
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('reads a selected XML file locally and preserves the wanted-list conversion', async () => {
    await select(new File(['<INVENTORY><ITEM><ITEMID>3001</ITEMID><ITEMTYPE>P</ITEMTYPE><COLOR>5</COLOR><MINQTY>3</MINQTY></ITEM></INVENTORY>'],
      'wanted.xml', { type: 'text/xml' }));
    expect(component.form.value.partsListName).toBe('wanted');
    expect(component.source).toBe('BrickLink');
    expect(component.wantedList[0]).toEqual(jasmine.objectContaining({ itemId: '3001', itemType: 'P', color: 5, minQty: 3 }));
    expect(component.fileUpload.files.length).toBe(1);
    expect(fixture.nativeElement.querySelector('.p-fileupload-upload-button')).toBeNull();
  });

  it('reads a dropped JSON file and keeps its list name', async () => {
    const content = JSON.stringify({ name: 'Imported JSON', parts: [] });
    await select(new File([content], 'list.json', { type: 'application/json' }), true);
    expect(component.form.value.content).toBe(content);
    expect(component.form.value.partsListName).toBe('Imported JSON');
    expect(component.source).toBe('BrickHunterV1');
  });

  it('does not read rejected file types into the form', async () => {
    component.form.patchValue({ content: 'Existing content', partsListName: 'Existing list' });
    await select(new File(['Rejected content'], 'notes.txt', { type: 'text/plain' }));
    expect(component.fileUpload.files.length).toBe(0);
    expect(component.form.value.content).toBe('Existing content');
    expect(component.form.value.partsListName).toBe('Existing list');
    expect(component.fileUpload.msgs().length).toBeGreaterThan(0);
  });

  it('clears the selected file with Cancel and resets the form when the drawer closes', async () => {
    await select(new File(['{"name":"Imported JSON","parts":[]}'], 'list.json', { type: 'application/json' }));
    fixture.nativeElement.querySelector('.p-fileupload-cancel-button').click();
    fixture.detectChanges();
    expect(component.fileUpload.files.length).toBe(0);
    // Cancel clears the file widget; the parsed form is retained as before.
    expect(component.form.value.partsListName).toBe('Imported JSON');
    fixture.nativeElement.querySelector('.p-drawer-header button').click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.display).toBeFalse();
    expect(component.form.value).toEqual({ partsListName: '', content: '' });
  });
});
