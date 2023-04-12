import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { PrimengModule } from './primeng.module';
import { CoreModule } from './core/core.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { LocaleService } from './core/services/locale.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    PrimengModule,
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
  ],
  providers: [
    ConfirmationService,
    MessageService,
    {
      provide: LOCALE_ID,
      useFactory: (localeService: LocaleService) => {
        return localeService.languageCountryCode;
      },
      deps: [LocaleService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(@Inject(LOCALE_ID) locale: string) {
    registerLocaleData(localeDe);
    registerLocaleData(localeEn);
  }
}
