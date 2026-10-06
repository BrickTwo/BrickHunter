import { ElementRef } from '@angular/core';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmDialogFocusDirective } from './confirm-dialog-focus.directive';

describe('ConfirmDialogFocusDirective', () => {
  let host: HTMLDivElement;
  let mask: HTMLDivElement;
  let confirmation: ConfirmDialog;
  let defaultFocus: 'accept' | 'close' | 'reject' | 'none';
  let directive: ConfirmDialogFocusDirective;
  let previous: HTMLButtonElement;

  beforeEach(() => {
    host = document.createElement('div'); document.body.appendChild(host);
    previous = document.createElement('button'); host.appendChild(previous); previous.focus();
    defaultFocus = 'accept';
    confirmation = { defaultFocus: () => defaultFocus } as unknown as ConfirmDialog;
    directive = new ConfirmDialogFocusDirective(new ElementRef(host), confirmation);
    directive.ngOnInit();
    mask = document.createElement('div'); mask.className = 'p-dialog-mask';
    mask.innerHTML = '<div class="p-confirmdialog"><div class="p-dialog-header"><button class="p-dialog-close-button">Close</button></div>' +
      '<button class="p-confirmdialog-reject-button">No</button><button class="p-confirmdialog-accept-button">Yes</button></div>';
  });
  afterEach(() => { directive.ngOnDestroy(); mask.remove(); host.remove(); });

  async function open() {
    host.appendChild(mask); document.body.appendChild(mask);
    // Deliver native mutation records after the overlay moves to body.
    await new Promise<void>(resolve => setTimeout(resolve, 0));
  }

  it('restores accept focus for a body overlay and allows later user navigation', async () => {
    await open(); const reject = mask.querySelector<HTMLButtonElement>('.p-confirmdialog-reject-button');
    reject.focus();
    expect(document.activeElement).toBe(mask.querySelector('.p-confirmdialog-accept-button'));
    reject.focus(); expect(document.activeElement).toBe(reject);
  });

  it('honors the configured reject and close targets', async () => {
    defaultFocus = 'close'; await open();
    mask.querySelector<HTMLButtonElement>('.p-confirmdialog-reject-button').focus();
    expect(document.activeElement).toBe(mask.querySelector('.p-dialog-header button'));
    mask.remove(); defaultFocus = 'reject'; await open();
    mask.querySelector<HTMLButtonElement>('.p-confirmdialog-accept-button').focus();
    expect(document.activeElement).toBe(mask.querySelector('.p-confirmdialog-reject-button'));
  });

  it('restores previous focus for none', async () => {
    defaultFocus = 'none'; await open();
    mask.querySelector<HTMLButtonElement>('.p-confirmdialog-reject-button').focus();
    expect(document.activeElement).toBe(previous);
  });

  it('removes the listener on destruction', async () => {
    await open(); directive.ngOnDestroy();
    const reject = mask.querySelector<HTMLButtonElement>('.p-confirmdialog-reject-button'); reject.focus();
    expect(document.activeElement).toBe(reject);
  });
});
