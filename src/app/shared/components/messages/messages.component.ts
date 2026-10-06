import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';
import { MessageModule } from 'primeng/message';

// Array-based application warnings, rendered through PrimeNG's public Message API.
@Component({
  selector: 'bh-messages',
  imports: [MessageModule],
  template: `
    @for (message of messages; track message) {
      <p-message
        [severity]="message.severity || 'info'"
        [closable]="false"
        styleClass="bh-message-banner"
        [icon]="message.icon || severityIcon(message.severity)">
        <span class="bh-message-summary">{{ message.summary }}</span>
        <span class="bh-message-detail">{{ message.detail }}</span>
      </p-message>
    }
  `,
  styles: [
    `
      .bh-message-banner {
        margin: 1rem 0;
      }
      .bh-message-banner .p-message-content {
        padding: 1.25rem 1.5rem;
        gap: 0.5rem;
      }
      .bh-message-banner .p-message-icon {
        width: 14px;
        font-size: 14px;
      }
      .bh-message-banner .p-message-text {
        display: flex;
        align-items: center;
        font-weight: 400;
      }
      .bh-message-summary {
        font-weight: 700;
        flex-shrink: 0;
      }
      .bh-message-detail {
        margin-left: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MessagesComponent {
  @Input() messages: ToastMessageOptions[] = [];

  severityIcon(severity?: string): string {
    return severity === 'warn'
      ? 'pi pi-exclamation-triangle'
      : severity === 'error'
        ? 'pi pi-times-circle'
        : severity === 'success'
          ? 'pi pi-check'
          : 'pi pi-info-circle';
  }
}
