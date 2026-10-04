import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesComponent } from './messages.component';

describe('Application warning messages', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MessagesComponent, NoopAnimationsModule] }).compileComponents();
  });

  it('renders every summary and detail as text through public Message components', () => {
    const fixture = TestBed.createComponent(MessagesComponent);
    fixture.componentRef.setInput('messages', [
      { severity: 'warn', summary: 'Warning', detail: '<b>Keep your lists</b>' },
      { severity: 'info', summary: 'Information', detail: 'Migration running' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="alert"]').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('<b>Keep your lists</b>');
    expect(fixture.nativeElement.querySelector('b')).toBeNull();
    expect(fixture.nativeElement.querySelector('.p-message-warn')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    fixture.componentRef.setInput('messages', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p-message')).toBeNull();
  });
});
