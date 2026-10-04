import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureComponentTestBed } from 'src/testing/component-test-bed';

import { PartsListDetailComponent } from './parts-list-detail.component';
import { PartsListService } from '../../services/parts-list.service';

describe('PartsListDetailComponent', () => {
  let component: PartsListDetailComponent;
  let fixture: ComponentFixture<PartsListDetailComponent>;

  beforeEach(async () => {
    await configureComponentTestBed();

    fixture = TestBed.createComponent(PartsListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles the initial tab event before a parts list is available', () => {
    component.uuid = 'not-yet-loaded';
    component.onTableChange({ id: 'all' });
    expect(component.parts).toEqual([]);
  });

  it('switches the active filter through a rendered public tab', () => {
    const getParts = spyOn(TestBed.inject(PartsListService), 'getParts').and.returnValue([]);
    component.uuid = 'upgrade-reference';
    const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    tabs[1].click();
    fixture.detectChanges();
    expect(component.activeItem.id).toBe('pab');
    expect(getParts).toHaveBeenCalledWith('upgrade-reference', 'pab');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    for (const tab of Array.from(tabs)) {
      const panel = fixture.nativeElement.querySelector(`[id="${tab.getAttribute('aria-controls')}"]`);
      expect(panel).not.toBeNull();
      expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
    }
    tabs[6].click();
    fixture.detectChanges();
    expect(component.activeItem.id).toBe('setSuggestions');
    expect(fixture.nativeElement.textContent).toContain('Please use "Check for Sets" function.');
    expect(fixture.nativeElement.querySelector('app-parts-table')).toBeNull();
  });

  it('activates the next public tab with keyboard navigation', () => {
    spyOn(TestBed.inject(PartsListService), 'getParts').and.returnValue([]);
    const tabs: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(tabs[1]);
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(component.activeItem.id).toBe('pab');
  });

  it('ignores unknown or disabled tab values', () => {
    const getParts = spyOn(TestBed.inject(PartsListService), 'getParts').and.returnValue([]);
    component.items[1].disabled = true;
    component.onTabChange('pab');
    component.onTabChange('unknown');
    expect(component.activeItem.id).toBe('all');
    expect(getParts).not.toHaveBeenCalled();
  });
});
