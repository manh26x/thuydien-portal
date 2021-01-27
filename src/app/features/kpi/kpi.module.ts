import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiRoutingModule } from './kpi-routing.module';
import {KpiComponent} from './kpi.component';
import {KpiReportComponent} from './kpi-report/kpi-report.component';
import {AreaDataComponent} from './area-data/area-data.component';
import {AreaFormComponent} from './area-form/area-form.component';
import {AreaCreateComponent} from './area-create/area-create.component';
import {AreaUpdateComponent} from './area-update/area-update.component';
import {KpiService} from './service/kpi.service';
import {CustomFileUploadModule} from '../../shared/custom-file-upload/custom-file-upload.module';
import {KpiImportComponent} from './kpi-import/kpi-import.component';

import {MessageService} from 'primeng/api';
import {TabViewModule} from 'primeng/tabview';
import {PanelModule} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';
import { KpiDataComponent } from './kpi-data/kpi-data.component';
import {CalendarModule} from 'primeng/calendar';
import { KpiPreviewComponent } from './kpi-preview/kpi-preview.component';
import {DialogService} from 'primeng/dynamicdialog';
import { KpiDirective } from './kpi.directive';
import {PaginatorModule} from 'primeng/paginator';
import { KpiDetailComponent } from './kpi-detail/kpi-detail.component';
import { KpiUpdateComponent } from './kpi-update/kpi-update.component';
import { KpiInfoComponent } from './kpi-info/kpi-info.component';
import { KpiFilterComponent } from './kpi-filter/kpi-filter.component';
import {CheckboxModule} from 'primeng/checkbox';
import {BaseModule} from '../../core/base-module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {HttpClient} from '@angular/common/http';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import { KpiDetailDataComponent } from './kpi-detail-data/kpi-detail-data.component';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [
    KpiComponent,
    KpiReportComponent,
    KpiImportComponent,
    AreaDataComponent,
    AreaFormComponent,
    AreaCreateComponent,
    AreaUpdateComponent,
    KpiDataComponent,
    KpiPreviewComponent,
    KpiDirective,
    KpiDetailComponent,
    KpiUpdateComponent,
    KpiInfoComponent,
    KpiFilterComponent,
    KpiDetailDataComponent
  ],
    imports: [
        CommonModule,
        KpiRoutingModule,
        TabViewModule,
        PanelModule,
        TableModule,
        ButtonModule,
        ToolbarModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        ToastModule,
        CustomFileUploadModule,
        CalendarModule,
        PaginatorModule,
        CheckboxModule,
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
        TooltipModule,
    ],
  providers: [
    KpiService,
    MessageService,
    DialogService,
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: {path: './assets/i18n/kpi/'}
    },
  ]
})
export class KpiModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
