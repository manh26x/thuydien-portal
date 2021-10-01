import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QaComponent } from './qa.component';
import {Router, RouterModule, Routes} from '@angular/router';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {QaService} from './service/qa.service';
import {BaseModule} from '../../core/base-module';
import { QaImportComponent } from './qa-import/qa-import.component';
import { QaDataComponent } from './qa-data/qa-data.component';
import {DropdownModule} from "primeng/dropdown";
import {CustomFileUploadModule} from "../../shared/custom-file-upload/custom-file-upload.module";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";

const routes: Routes = [
  {
    path: '', component : QaComponent,
    children: [
      {path: '', component: QaDataComponent}
    ]
  }
  ];

@NgModule({
  declarations: [QaComponent, QaImportComponent, QaDataComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
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
    ToastModule,
    BreadcrumbModule,
    DropdownModule,
    CustomFileUploadModule,
    ButtonModule,
    CardModule,
  ],
  providers: [
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: { path: './assets/i18n/qa/' }
    },
    MessageService,
    QaService
  ],
  exports: [RouterModule]
})
export class QaModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
