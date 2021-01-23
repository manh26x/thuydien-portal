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
    KpiDetailComponent
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
    PaginatorModule
  ],
  providers: [
    KpiService,
    MessageService,
    DialogService
  ]
})
export class KpiModule { }
