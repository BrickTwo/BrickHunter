import { NgModule } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { BrickHunterPreset } from './shared/theme/brickhunter-preset';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ButtonFocusDefaultsDirective } from './shared/directives/button-focus-defaults.directive';
import { CheckIcon, TimesIcon, InfoCircleIcon, TimesCircleIcon, ExclamationTriangleIcon } from 'primeng/icons';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MenuModule } from './shared/components/menu/menu.component';
import { MessageModule } from 'primeng/message';
import { MessagesComponent } from './shared/components/messages/messages.component';
import { PopoverModule } from 'primeng/popover';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';

@NgModule({
  imports: [MessagesComponent, CheckIcon, TimesIcon, InfoCircleIcon, TimesCircleIcon, ExclamationTriangleIcon, ButtonFocusDefaultsDirective],
  exports: [
    AvatarModule,
    BadgeModule,
    ButtonModule,
    ButtonFocusDefaultsDirective,
    CheckIcon,
    TimesIcon,
    InfoCircleIcon,
    TimesCircleIcon,
    ExclamationTriangleIcon,
    DatePickerModule,
    CardModule,
    CheckboxModule,
    ConfirmDialogModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    SelectModule,
    FileUploadModule,
    ImageModule,
    InputNumberModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToggleSwitchModule,
    MenuModule,
    MessageModule,
    MessagesComponent,
    PopoverModule,
    PaginatorModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    RippleModule,
    SelectButtonModule,
    DrawerModule,
    TableModule,
    TabsModule,
    TagModule,
    ToastModule,
    TreeModule,
    TreeTableModule,
  ],
  providers: [
    providePrimeNG({
      ripple: true,
      theme: {
        preset: BrickHunterPreset,
        options: { darkModeSelector: false, cssLayer: { name: 'primeng', order: 'primeng, brickhunter' } },
      },
    }),
  ],
})
export class PrimengModule {}
