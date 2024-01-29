import { APP_INITIALIZER, NgModule } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DeferModule } from 'primeng/defer';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenuModule } from './shared/components/menu/menu.component';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';

const initializeAppFactory = (primeConfig: PrimeNGConfig) => () => {
  primeConfig.ripple = true;
};

@NgModule({
  exports: [
    AvatarModule,
    BadgeModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CheckboxModule,
    ConfirmDialogModule,
    DataViewModule,
    DeferModule,
    DialogModule,
    DividerModule,
    DropdownModule,
    DynamicDialogModule,
    FileUploadModule,
    ImageModule,
    InputNumberModule,
    InputTextModule,
    InputSwitchModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    OverlayPanelModule,
    PaginatorModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    RippleModule,
    SelectButtonModule,
    SidebarModule,
    TableModule,
    TabMenuModule,
    TagModule,
    ToastModule,
    TreeModule,
    TreeTableModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [PrimeNGConfig],
      multi: true,
    },
  ],
})
export class PrimengModule {}
