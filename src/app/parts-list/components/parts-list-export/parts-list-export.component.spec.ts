import { TestBed } from '@angular/core/testing';
import * as xml2js from 'xml2js';
import { configureComponentTestBed } from 'src/testing/component-test-bed';
import { referenceColors, referenceTableParts } from 'src/testing/upgrade-fixtures';
import { ColorService } from 'src/app/core/services/color.service';
import { PartsListService } from '../../services/parts-list.service';
import { PartsListExportComponent } from './parts-list-export.component';
import { PartsListImportComponent } from '../parts-list-import/parts-list-import.component';

describe('Wanted-list export and local reimport', () => {
  let component: PartsListExportComponent;

  beforeEach(async () => {
    await configureComponentTestBed();
    component = TestBed.createComponent(PartsListExportComponent).componentInstance;
    const list = TestBed.inject(PartsListService).getPartsList('upgrade-reference');
    list.parts = referenceTableParts().slice(0, 2);
    list.parts.forEach((part, index) => {
      part.brickLink = { itemNo: String(4000 + index), itemType: 'P' } as typeof part.brickLink;
      part.notify = index === 0;
      part.remarks = 'ÄÖÜ äöü ß <&>';
    });
    component.open(list.uuid);
    component.brickLinkExportPrice = false;
  });

  async function items() {
    const parsed = await xml2js.parseStringPromise(await component.creatXml());
    return parsed.INVENTORY.ITEM;
  }

  it('waits for delayed colors and preserves source order when they finish in reverse order', async () => {
    const resolvers: Array<(color: (typeof referenceColors)[number]) => void> = [];
    spyOn(TestBed.inject(ColorService), 'getColor').and.callFake(() => new Promise(resolve => resolvers.push(resolve)));
    let completed = false;
    const pending = component.creatXml().then(xml => {
      completed = true;
      return xml;
    });
    await Promise.resolve();
    expect(completed).toBeFalse();
    resolvers[1](referenceColors[1]);
    await Promise.resolve();
    expect(completed).toBeFalse();
    resolvers[0](referenceColors[0]);
    const parsed = await xml2js.parseStringPromise(await pending);
    expect(parsed.INVENTORY.ITEM.map(item => item.ITEMID[0])).toEqual(['4000', '4001']);
    expect(parsed.INVENTORY.ITEM.map(item => item.COLOR[0])).toEqual(['5', '7']);
  });

  it('preserves zero filled quantity, prices, notification choices and XML-special remarks', async () => {
    const result = await items();
    expect(result[0].QTYFILLED).toEqual(['0']);
    expect(result[0].MAXPRICE).toEqual(['0.3']);
    expect(result.map(item => item.NOTIFY[0])).toEqual(['Y', 'N']);
    expect(result[0].REMARKS).toEqual(['ÄÖÜ äöü ß <&>']);
  });

  it('uses the selected PaB price and omits unavailable optional prices', async () => {
    component.brickLinkExportPrice = true;
    component.partsList.parts[1].lego = undefined;
    const result = await items();
    expect(result[0].MAXPRICE).toEqual(['0.25']);
    expect(result[1].MAXPRICE).toBeUndefined();
  });

  it('honors the filter and skips parts without BrickLink mappings', async () => {
    component.selectedFilterValue = 'pab';
    expect((await items()).map(item => item.ITEMID[0])).toEqual(['4000']);
    component.selectedFilterValue = 'all';
    component.partsList.parts[0].brickLink = undefined;
    expect((await items()).map(item => item.ITEMID[0])).toEqual(['4001']);
  });

  it('generates headerless upload XML without manual string stripping', async () => {
    expect(await component.creatXml(false)).toMatch(/^<INVENTORY>/);
    expect(await component.creatXml()).toMatch(/^<\?xml /);
  });

  it('roundtrips actual exported XML through the local file-selection workflow', async () => {
    const fixture = TestBed.createComponent(PartsListImportComponent);
    const importer = fixture.componentInstance;
    importer.open();
    fixture.detectChanges();
    await fixture.whenStable();
    const xml = await component.creatXml(false);
    const transfer = new DataTransfer();
    transfer.items.add(new File([xml], 'roundtrip.xml', { type: 'text/xml' }));
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
    const loaded = new Promise<void>(resolve => {
      const sub = importer.form.controls.content.valueChanges.subscribe(() => {
        sub.unsubscribe();
        resolve();
      });
    });
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await loaded;
    await fixture.whenStable();
    expect(importer.wantedList).toEqual([
      jasmine.objectContaining({
        itemId: '4000',
        color: 5,
        minQty: 10,
        qtyFilled: 0,
        maxPrice: 0.3,
        notify: true,
        remarks: 'ÄÖÜ äöü ß <&>',
      }),
      jasmine.objectContaining({ itemId: '4001', color: 7, minQty: 11, qtyFilled: 3, maxPrice: 0.3, notify: false }),
    ]);
  });
});
