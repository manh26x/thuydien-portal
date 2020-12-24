import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserDataComponent } from './user-data/user-data.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import {UserComponent} from './user.component';
import {UserService} from './service/user.service';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {HttpClient} from '@angular/common/http';
import {PanelModule} from 'primeng/panel';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import {MultiSelectModule} from 'primeng/multiselect';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToastModule} from 'primeng/toast';
import {BaseModule} from '../../core/base-module';
import {Router} from '@angular/router';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {MessageService} from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';
import {TooltipModule} from 'primeng/tooltip';
import {PickListModule} from 'primeng/picklist';


@NgModule({
  declarations: [
    UserComponent,
    UserDataComponent,
    UserCreateComponent,
    UserFormComponent,
    UserViewComponent,
    UserUpdateComponent
  ],
    imports: [
      CommonModule,
      UserRoutingModule,
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
      AutoCompleteModule,
      CheckboxModule,
      TooltipModule,
      PickListModule
    ],
  providers: [
    UserService,
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: { path: './assets/i18n/user/' }
    },
    MessageService
  ]
})
export class UserModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
