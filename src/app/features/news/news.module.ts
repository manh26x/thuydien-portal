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
import { EditorModule } from '@tinymce/tinymce-angular';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {MultiSelectModule} from 'primeng/multiselect';
import {ReactiveFormsModule} from '@angular/forms';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToastModule} from 'primeng/toast';
import { NewsViewComponent } from './news-view/news-view.component';
import { NewsUpdateComponent } from './news-update/news-update.component';
import {MessageService} from 'primeng/api';
import {TooltipModule} from 'primeng/tooltip';
import {CustomFileUploadModule} from '../../shared/custom-file-upload/custom-file-upload.module';
import {MatRadioModule} from '@angular/material/radio';
import {TagsService} from '../tags/service/tags.service';
import {BranchService} from '../../shared/service/branch.service';
import {RoleService} from '../../shared/service/role.service';
import {UnitService} from '../../shared/service/unit.service';
import { NewsCommentComponent } from './news-comment/news-comment.component';
import {TreeTableModule} from 'primeng/treetable';
import {CommentService} from './service/comment.service';

@NgModule({
    declarations: [
        NewsComponent,
        NewsFormComponent,
        NewsCreateComponent,
        NewsDataComponent,
        NewsViewComponent,
        NewsUpdateComponent,
        NewsCommentComponent
    ],
    imports: [
        CommonModule,
        NewsRoutingModule,
        PanelModule,
        TableModule,
        PaginatorModule,
        InputTextModule,
        TreeTableModule,
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
        CalendarModule,
        MultiSelectModule,
        ReactiveFormsModule,
        BreadcrumbModule,
        ToastModule,
        TooltipModule,
        CustomFileUploadModule,
        MatRadioModule
    ],
    providers: [
      {
          provide: LANGUAGE_FILE_PATH,
          useValue: {path: './assets/i18n/news/'}
      },
      CommentService,
      NewsService,
      MessageService,
      TagsService,
      BranchService,
      RoleService,
      UnitService
    ],
    exports: [
        NewsFormComponent
    ]
})
export class NewsModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}

