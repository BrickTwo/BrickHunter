import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Select } from 'primeng/select';

@Directive({
    selector: 'p-select[bhSelectEscape]',
    standalone: false
})
export class SelectEscapeDirective implements OnInit, OnDestroy {
  constructor(private readonly element: ElementRef<HTMLElement>, private readonly select: Select) {}

  private readonly onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    if (this.select.overlayVisible()) {
      this.select.hide(true);
      event.preventDefault();
      event.stopPropagation();
    } else {
      // Select 19 consumes Escape even when closed. Forward it from the parent
      // so the enclosing Drawer/Dialog can handle the second Escape as before.
      event.stopImmediatePropagation();
      const forwarded = new KeyboardEvent(event.type, {
        key: event.key, code: event.code, location: event.location, repeat: event.repeat,
        ctrlKey: event.ctrlKey, shiftKey: event.shiftKey, altKey: event.altKey, metaKey: event.metaKey,
        bubbles: event.bubbles, cancelable: event.cancelable, composed: event.composed,
      });
      if (!this.element.nativeElement.parentElement?.dispatchEvent(forwarded)) event.preventDefault();
    }
  };

  ngOnInit() {
    this.element.nativeElement.addEventListener('keydown', this.onKeydown, true);
  }

  ngOnDestroy() {
    this.element.nativeElement.removeEventListener('keydown', this.onKeydown, true);
  }
}
