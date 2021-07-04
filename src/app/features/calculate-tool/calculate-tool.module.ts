import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculateToolRoutingModule } from './calculate-tool-routing.module';
import {CalculateToolComponent} from './calculate-tool.component';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToastModule} from 'primeng/toast';
import {PanelModule} from 'primeng/panel';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {CustomMissingTranslationHandler} from '../../core/translate.missing';
import {AppTranslateService} from '../../core/service/translate.service';
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from '../../core/translate.loader';
import {HttpClient} from '@angular/common/http';
import {BaseModule} from '../../core/base-module';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {CalculateToolService} from './service/calculate-tool.service';
import { CalculateToolDataComponent } from './calculate-tool-data/calculate-tool-data.component';
import {TooltipModule} from 'primeng/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {InputSwitchModule} from 'primeng/inputswitch';


@NgModule({
  declarations: [CalculateToolComponent, CalculateToolDataComponent],
  imports: [
    CommonModule,
    CalculateToolRoutingModule,
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
    PanelModule,
    TooltipModule,
    ReactiveFormsModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    InputSwitchModule,
    FormsModule
  ],
  providers: [
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: { path: './assets/i18n/calculate-tool/' }
    },
    MessageService,
    CalculateToolService
  ]
})
export class CalculateToolModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}
