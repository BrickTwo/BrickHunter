import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ConfirmDialog } from 'primeng/confirmdialog';

// PrimeNG 18.0.2 and 19.1.4 never populate the Dialog reference used for defaultFocus.
// Observe only this host's overlay creation, including appendTo="body" moves.
@Directive({
    selector: 'p-confirmDialog[bhConfirmDialogFocus]',
    standalone: false
})
export class ConfirmDialogFocusDirective implements OnInit, OnDestroy {
  private observer?: MutationObserver;
  private mask?: HTMLElement;
  private listener?: () => void;

  constructor(private readonly element: ElementRef<HTMLElement>, private readonly confirmation: ConfirmDialog) {}

  ngOnInit() {
    this.observer = new MutationObserver(records => {
      for (const record of records) for (const node of Array.from(record.addedNodes)) {
        if (!(node instanceof HTMLElement)) continue;
        const mask = node.matches('.p-dialog-mask') ? node : node.querySelector<HTMLElement>('.p-dialog-mask');
        if (!mask?.querySelector('.p-confirmdialog')) continue;
        this.removeListener();
        this.mask = mask;
        const previous = document.activeElement as HTMLElement;
        this.listener = () => {
          this.removeListener();
          const selectors: Record<string, string> = {
            accept: '.p-confirmdialog-accept-button', reject: '.p-confirmdialog-reject-button',
            close: '.p-dialog-header .p-button',
          };
          const selector = selectors[this.confirmation.defaultFocus];
          const target = selector ? mask.querySelector<HTMLElement>(selector) : previous;
          if (target?.isConnected) target.focus();
        };
        mask.addEventListener('focusin', this.listener, true);
      }
    });
    this.observer.observe(this.element.nativeElement, { childList: true, subtree: true });
  }

  private removeListener() {
    if (this.mask && this.listener) this.mask.removeEventListener('focusin', this.listener, true);
    this.mask = undefined;
    this.listener = undefined;
  }

  ngOnDestroy() { this.observer?.disconnect(); this.removeListener(); }
}
