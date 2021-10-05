import {ErrorHandler, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from './translate.loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ResponseInterceptor} from './response.interceptor';
import {RequestInterceptor} from './request.interceptor';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {DialogErrorHandle} from './dialog-error-handle';
import {AppTranslateService} from './service/translate.service';
import {MessagingFirebaseService} from './service/messaging-firebase.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (CustomTranslateLoader),
        deps: [LANGUAGE_FILE_PATH, HttpClient]
      },
      isolate: true
    }),
    ConfirmDialogModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: DialogErrorHandle
    },
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: { path: './assets/i18n/app/' }
    },
    ConfirmationService,
    AppTranslateService,
    MessagingFirebaseService
  ],
  exports: [
    HttpClientModule,
    BrowserAnimationsModule,
    ConfirmDialogModule
  ],
})
export class CoreModule { }
