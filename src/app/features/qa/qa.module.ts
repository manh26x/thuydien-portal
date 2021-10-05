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
import {DialogModule} from "primeng/dialog";
import {TableModule} from "primeng/table";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import { QaViewComponent } from './qa-view/qa-view.component';
import { QaUpdateComponent } from './qa-update/qa-update.component';
import { QaCreateComponent } from './qa-create/qa-create.component';
import { QaFormComponent } from './qa-form/qa-form.component';
import {InputTextareaModule} from "primeng/inputtextarea";

const routes: Routes = [
  {
    path: '', component : QaComponent,
    children: [
      {path: '', component: QaDataComponent},
      {path: 'view/:id', component: QaViewComponent},
      {path: 'update/:id', component: QaUpdateComponent},
      {path: 'create', component: QaCreateComponent}
    ]
  }
  ];

@NgModule({
  declarations: [QaComponent, QaImportComponent, QaDataComponent, QaViewComponent, QaUpdateComponent, QaCreateComponent, QaFormComponent],
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
    DialogModule,
    TableModule,
    ReactiveFormsModule,
    InputTextModule,
    PaginatorModule,
    InputTextareaModule,
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
