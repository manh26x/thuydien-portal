import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingAppBehaviorRoutingModule } from './tracking-app-behavior-routing.module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {HttpClient} from '@angular/common/http';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {Router} from '@angular/router';
import {BaseModule} from '../../core/base-module';
import {BranchService} from '../../shared/service/branch.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrackingAppBehaviorRoutingModule,
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
    BreadcrumbModule,
  ],
  providers: [
    BranchService,
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: {path: './assets/i18n/tracking-app-behavior/'}
    },
    ]
})
export class TrackingAppBehaviorModule  extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
