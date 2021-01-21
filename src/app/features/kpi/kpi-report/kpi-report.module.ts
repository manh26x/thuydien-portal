import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiReportRoutingModule } from './kpi-report-routing.module';
import {KpiReportComponent} from './kpi-report.component';
import {TabViewModule} from 'primeng/tabview';
import {PanelModule} from 'primeng/panel';
import { AreaDataComponent } from './area-data/area-data.component';
import { AreaFormComponent } from './area-form/area-form.component';
import { AreaCreateComponent } from './area-create/area-create.component';
import { AreaUpdateComponent } from './area-update/area-update.component';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {KpiService} from '../service/kpi.service';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';


@NgModule({
  declarations: [KpiReportComponent, AreaDataComponent, AreaFormComponent, AreaCreateComponent, AreaUpdateComponent],
  imports: [
    CommonModule,
    KpiReportRoutingModule,
    TabViewModule,
    PanelModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ToastModule
  ],
  providers: [
    KpiService,
    MessageService
  ]
})
export class KpiReportModule { }
