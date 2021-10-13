import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceRoutingModule } from './insurance-routing.module';
import {InsuranceComponent} from "./insurance.component";
import {BaseModule} from "../../core/base-module";
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {CustomTranslateLoader, LANGUAGE_FILE_PATH} from "../../core/translate.loader";
import {CustomMissingTranslationHandler} from "../../core/translate.missing";
import {AppTranslateService} from "../../core/service/translate.service";
import {HttpClient} from "@angular/common/http";
import {TabViewModule} from "primeng/tabview";
import {BreadcrumbModule} from "primeng/breadcrumb";
import { CarBrandComponent } from './car-brand/car-brand.component';
import { CarModalComponent } from './car-modal/car-modal.component';
import { InsuranceDataComponent } from './insurance-data/insurance-data.component';
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {MessageService} from "primeng/api";
import {BranchService} from "../../shared/service/branch.service";
import {PaginatorModule} from "primeng/paginator";
import {TableModule} from "primeng/table";
import { InsuranceFormComponent } from './insurance-data/insurance-form/insurance-form.component';
import { InsuranceViewComponent } from './insurance-data/insurance-view/insurance-view.component';
import { InsuranceUpdateComponent } from './insurance-data/insurance-update/insurance-update.component';
import { InsuranceTabviewComponent } from './insurance-tabview/insurance-tabview.component';
import {CardModule} from "primeng/card";
import { FormTabviewComponent } from './insurance-data/form-tabview/form-tabview.component';
import { InsuranceCarFormComponent } from './insurance-data/insurance-car-form/insurance-car-form.component';
import { InsuranceScopeFormComponent } from './insurance-data/insurance-scope-form/insurance-scope-form.component';
import { InsuranceCarOwnerFormComponent } from './insurance-data/insurance-car-owner-form/insurance-car-owner-form.component';

// @ts-ignore
@NgModule({
  declarations: [InsuranceComponent, CarBrandComponent, CarModalComponent, InsuranceDataComponent, InsuranceFormComponent, InsuranceViewComponent, InsuranceUpdateComponent, InsuranceTabviewComponent, FormTabviewComponent, InsuranceCarFormComponent, InsuranceScopeFormComponent, InsuranceCarOwnerFormComponent],
  imports: [
    CommonModule,
    InsuranceRoutingModule,
    TabViewModule,
    BreadcrumbModule,
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
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    TableModule,
    CardModule,
  ],
  providers: [
    {
      provide: LANGUAGE_FILE_PATH,
      useValue: {path: './assets/i18n/insurance/'}

    },
    BranchService,
    MessageService
  ],
  exports:[InsuranceFormComponent]
})
export class InsuranceModule extends BaseModule {
  constructor(translateService: TranslateService, router: Router) {
    super(translateService, router);
  }
}


