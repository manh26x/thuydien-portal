import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import { BranchUnitDepartmentComponent } from './branch-unit-department.component';
import {BranchUnitDepartmentRoutingModule} from './branch-unit-department-routing.module';
import {BaseModule} from '../../core/base-module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {HttpClient} from '@angular/common/http';
import {NewsService} from '../news/service/news.service';
import {MessageService} from 'primeng/api';
import {TagsService} from '../tags/service/tags.service';
import {BranchService} from '../../shared/service/branch.service';
import {RoleService} from '../../shared/service/role.service';
import {UnitService} from '../../shared/service/unit.service';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToastModule} from 'primeng/toast';
import { BranchComponent } from './branch/branch.component';
import {TabViewModule} from 'primeng/tabview';
import { UnitComponent } from './unit/unit.component';
import { DepartmentComponent } from './department/department.component';
import {PaginatorModule} from 'primeng/paginator';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {PanelModule} from 'primeng/panel';
import {ReactiveFormsModule} from '@angular/forms';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {DialogModule} from 'primeng/dialog';



@NgModule({
  declarations: [BranchUnitDepartmentComponent, BranchComponent, UnitComponent, DepartmentComponent],
    imports: [
        CommonModule,
        BranchUnitDepartmentRoutingModule,
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
        ToastModule,
        TabViewModule,
        PaginatorModule,
        ButtonModule,
        TableModule,
        PanelModule,
        ReactiveFormsModule,
        TooltipModule,
        InputTextModule,
        MultiSelectModule,
        DialogModule,
    ],
  providers: [
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: {path: './assets/i18n/branch-unit-department/'}
    },
    NewsService,
    MessageService,
    TagsService,
    BranchService,
    RoleService,
    UnitService
  ],
})
export class BranchUnitDepartmentModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
