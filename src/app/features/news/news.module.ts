import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { CustomTranslateLoader, LANGUAGE_FILE_PATH } from '../../core/translate.loader';
import { NewsRoutingModule } from './news-routing.module';
import {BaseModule} from '../../core/base-module';
import {NewsComponent} from './news.component';
import {PanelModule} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {FileUploadModule} from 'primeng/fileupload';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {NewsService} from './service/news.service';
import { NewsFormComponent } from './news-form/news-form.component';
import { NewsCreateComponent } from './news-create/news-create.component';
import { NewsDataComponent } from './news-data/news-data.component';
import { NewsFilterFormComponent } from './news-filter-form/news-filter-form.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';


@NgModule({
  declarations: [NewsComponent, NewsFormComponent, NewsCreateComponent, NewsDataComponent, NewsFilterFormComponent],
  imports: [
    CommonModule,
    NewsRoutingModule,
    PanelModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    DialogModule,
    FileUploadModule,
    RadioButtonModule,
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
    EditorModule,
    CheckboxModule,
    CalendarModule
  ],
  providers: [
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: { path: './assets/i18n/news/' }
    },
    NewsService
  ],
})
export class NewsModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}

