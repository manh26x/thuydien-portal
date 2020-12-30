import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import {RoleComponent} from './role.component';
import { RoleDataComponent } from './role-data/role-data.component';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToastModule} from 'primeng/toast';
import {RoleService} from './service/role.service';
import {MessageService} from 'primeng/api';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {HttpClient} from '@angular/common/http';
import {BaseModule} from '../../core/base-module';
import {Router} from '@angular/router';


@NgModule({
  declarations: [RoleComponent, RoleDataComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    BreadcrumbModule,
    ToastModule,
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
      useValue: { path: './assets/i18n/role/' }
    },
    RoleService,
    MessageService
  ]
})
export class RoleModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
