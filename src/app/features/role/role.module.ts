import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import {RoleComponent} from './role.component';
import { RoleDataComponent } from './role-data/role-data.component';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToastModule} from 'primeng/toast';
import {RoleService} from './service/role.service';
import {MessageService} from 'primeng/api';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {HttpClient} from '@angular/common/http';
import {BaseModule} from '../../core/base-module';
import {Router} from '@angular/router';
import {PanelModule} from 'primeng/panel';
import {TooltipModule} from 'primeng/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import { RoleCreateComponent } from './role-create/role-create.component';
import {TabViewModule} from 'primeng/tabview';
import { RoleFormComponent } from './role-form/role-form.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { FeatureListComponent } from './feature-list/feature-list.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CheckboxModule} from 'primeng/checkbox';
import {PickListModule} from 'primeng/picklist';
import {TagsService} from '../tags/service/tags.service';
import {FeatureService} from './service/feature.service';
import {CardModule} from 'primeng/card';
import {MessagesModule} from 'primeng/messages';
import { RoleUpdateComponent } from './role-update/role-update.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [RoleComponent, RoleDataComponent, RoleCreateComponent, RoleFormComponent, TagListComponent, FeatureListComponent, RoleUpdateComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    BreadcrumbModule,
    ToastModule,
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
    TooltipModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    TabViewModule,
    InputTextareaModule,
    CheckboxModule,
    FormsModule,
    PickListModule,
    CardModule,
    MessagesModule,
    SharedModule,
  ],
  providers: [
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: { path: './assets/i18n/role/' }
    },
    RoleService,
    MessageService,
    TagsService,
    FeatureService
  ]
})
export class RoleModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
