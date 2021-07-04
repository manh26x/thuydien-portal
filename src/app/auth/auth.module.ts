import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {AuthRoutingModule} from './auth-routing.module';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MessagesModule} from 'primeng/messages';
import {DropdownModule} from 'primeng/dropdown';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CustomMissingTranslationHandler} from '../core/translate.missing';
import {AppTranslateService} from '../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../core/translate.loader';
import {BaseModule} from '../core/base-module';
import {Router} from '@angular/router';



@NgModule({
  declarations: [LoginComponent],
    imports: [
      CommonModule,
      HttpClientModule,
      AuthRoutingModule,
      InputTextModule,
      ButtonModule,
      ReactiveFormsModule,
      FormsModule,
      MessagesModule,
      DropdownModule,
      TranslateModule.forChild({
        missingTranslationHandler: {
          provide: MissingTranslationHandler,
          useClass: CustomMissingTranslationHandler,
          deps: [AppTranslateService]
        },
        loader: {
          provide: TranslateLoader,
          useFactory: (CustomTranslateLoader),
          deps: [LANGUAGE_FILE_PATH, HttpClient]
        },
        isolate: true,
        useDefaultLang: false
      }),
    ],
  providers: [
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: { path: './assets/i18n/auth/' }
    }
  ],
})
export class AuthModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}

