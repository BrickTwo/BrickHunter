import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonModule } from 'primeng/button';
import { ButtonFocusDefaultsDirective } from './button-focus-defaults.directive';

@Component({ standalone: true, imports: [ButtonModule, ButtonFocusDefaultsDirective],
  template: '<p-button label="Default" /><p-button label="Explicit" [autofocus]="true" />' })
class FocusTestComponent {}

describe('ButtonFocusDefaultsDirective', () => {
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
