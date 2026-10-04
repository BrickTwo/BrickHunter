import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Select } from 'primeng/select';

@Directive({ selector: 'p-select[bhSelectEscape]' })
export class SelectEscapeDirective implements OnInit, OnDestroy {
  constructor(private readonly element: ElementRef<HTMLElement>, private readonly select: Select) {}

  private readonly onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !this.select.overlayVisible) return;
    // Select 18's own Escape handler hides the popup but also reaches the
    // enclosing Drawer/Dialog listener. Capture its open state before hiding.
    this.select.hide(true);
    event.preventDefault();
    event.stopPropagation();
  };

  ngOnInit() {
    this.element.nativeElement.addEventListener('keydown', this.onKeydown, true);
  }

  ngOnDestroy() {
    this.element.nativeElement.removeEventListener('keydown', this.onKeydown, true);
  }
}
