import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [ButtonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<p-button label="Default" /><p-button label="Explicit" [autofocus]="true" />',
})
class FocusTestComponent {}

describe('PrimeNG button focus defaults', () => {
  it('does not add native autofocus when the app leaves autofocus unspecified', () => {
    const fixture = TestBed.createComponent(FocusTestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').hasAttribute('autofocus')).toBeFalse();
    fixture.destroy();
  });

  it('preserves explicitly requested autofocus', () => {
    const fixture = TestBed.createComponent(FocusTestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('button')[1].hasAttribute('autofocus')).toBeTrue();
    fixture.destroy();
  });
});
