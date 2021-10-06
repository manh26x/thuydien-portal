import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BaseModule} from '../../core/base-module';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {HttpClient} from '@angular/common/http';
import {NotificationRoutingModule} from './notification-routing.module';
import { NotificationComponent } from './notification.component';
import { CreateNotificationComponent } from './create-notifcation/create-notification.component';
import { UpdateNotificationComponent } from './update-notification/update-notification.component';
import { ViewNotificationComponent } from './view-notification/view-notification.component';
import { FormNotificationComponent } from './form-notification/form-notification.component';
import { NotificationDataComponent } from './notification-data/notification-data.component';
import {NotificationService} from "./service/notification.service";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {ReactiveFormsModule} from "@angular/forms";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";
import {InputTextModule} from "primeng/inputtext";
import {MessageService} from "primeng/api";
import {TagsService} from "../tags/service/tags.service";
import {BranchService} from "../../shared/service/branch.service";
import {RoleService} from "../../shared/service/role.service";
import {UnitService} from "../../shared/service/unit.service";
import {MultiSelectModule} from "primeng/multiselect";
import {EditorModule} from "@tinymce/tinymce-angular";



@NgModule({
  declarations: [
    NotificationComponent,
    CreateNotificationComponent,
    UpdateNotificationComponent,
    ViewNotificationComponent,
    FormNotificationComponent,
    NotificationDataComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule,
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
    ReactiveFormsModule,
    CardModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    MultiSelectModule,
    EditorModule,
  ],
  providers: [
    NotificationService,
    {
    provide: LANGUAGE_FILE_PATH,
    useValue: {path: './assets/i18n/notification/'}
  },
    MessageService,
    TagsService,
    BranchService,
    RoleService,
    UnitService
  ]
})
export class NotificationModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
