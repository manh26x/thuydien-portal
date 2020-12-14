import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsDataComponent } from './tags-data/tags-data.component';
import { TagsFormComponent } from './tags-form/tags-form.component';
import { TagsCreateComponent } from './tags-create/tags-create.component';
import { TagsUpdateComponent } from './tags-update/tags-update.component';
import {TagsComponent} from './tags.component';
import {BaseModule} from '../../core/base-module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {HttpClient} from '@angular/common/http';
import {PanelModule} from 'primeng/panel';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {TagsService} from './service/tags.service';
import {MultiSelectModule} from 'primeng/multiselect';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import { TagsViewComponent } from './tags-view/tags-view.component';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  declarations: [
    TagsComponent,
    TagsDataComponent,
    TagsFormComponent,
    TagsCreateComponent,
    TagsUpdateComponent,
    TagsViewComponent
  ],
  imports: [
    CommonModule,
    TagsRoutingModule,
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
    PanelModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    PaginatorModule,
    MultiSelectModule,
    BreadcrumbModule,
    ToastModule,
    TooltipModule
  ],
  providers: [
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: { path: './assets/i18n/tags/' }
    },
    TagsService,
    MessageService
  ]
})
export class TagsModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
