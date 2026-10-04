import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';
import { BrowsePartsService } from '../../service/browse-parts.service';
import { BrickHunterApiService } from 'src/app/core/http/brickhunterapi.service';
import { of } from 'rxjs';
import { referenceSearch } from 'src/testing/upgrade-fixtures';

import { BrowsePartsColorFilterComponent } from './browse-parts-color-filter.component';

describe('BrowsePartsColorFilterComponent', () => {
  let component: BrowsePartsColorFilterComponent;
  let fixture: ComponentFixture<BrowsePartsColorFilterComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(BrowsePartsColorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('preserves color labels and sends the selected color to the search API', async () => {
    const browse = TestBed.inject(BrowsePartsService);
    const api = TestBed.inject(BrickHunterApiService) as jasmine.SpyObj<BrickHunterApiService>;
    browse.sendRequest();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.red.length).toBe(1);
    expect(component.blue.length).toBe(1);
    expect(component.red[0].label).toContain('Red');
    expect(component.red[0].swatch.rgb).toBe('#C91A09');
    component.red[0].command({});
    expect(api.getPickABrickParts.calls.mostRecent().args[0].colorIds).toEqual([4]);
    component.setColor(null);
    expect(api.getPickABrickParts.calls.mostRecent().args[0].colorIds).toEqual([]);
  });

  it('removes stale color groups when a subsequent search is empty', async () => {
    const browse = TestBed.inject(BrowsePartsService);
    browse.sendRequest();
    await fixture.whenStable();
    const api = TestBed.inject(BrickHunterApiService) as jasmine.SpyObj<BrickHunterApiService>;
    api.getPickABrickParts.and.returnValue(of(referenceSearch(0)));
    browse.sendRequest();
    await fixture.whenStable();
    expect(component.red).toEqual([]);
    expect(component.blue).toEqual([]);
  });

  it('opens an asynchronously populated public menu and applies its color command', async () => {
    const browse = TestBed.inject(BrowsePartsService);
    const api = TestBed.inject(BrickHunterApiService) as jasmine.SpyObj<BrickHunterApiService>;
    browse.sendRequest();
    fixture.detectChanges(); // Bind the initially empty model before color lookup resolves.
    await fixture.whenStable();
    fixture.detectChanges();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find(button => button.style.backgroundColor === 'rgb(220, 53, 69)').click();
    fixture.detectChanges();
    await fixture.whenStable();
    const link = fixture.nativeElement.querySelector('.p-menu-item-link');
    expect(link.textContent).toContain('Red');
    link.click();
    expect(api.getPickABrickParts.calls.mostRecent().args[0].colorIds).toEqual([4]);
  });
});
