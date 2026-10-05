import { Directive, inject } from '@angular/core';
import { Button } from 'primeng/button';

// PrimeNG 20 forwards an undefined autofocus value to AutoFocus, which then
// adds the native autofocus attribute. Keep the old default via public props.
@Directive({ selector: 'p-button', standalone: true })
export class ButtonFocusDefaultsDirective {
  constructor() {
    const button = inject(Button);
    button.buttonProps = { ...button.buttonProps, autofocus: false };
  }
}
