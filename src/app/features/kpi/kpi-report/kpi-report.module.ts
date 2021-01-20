import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiReportRoutingModule } from './kpi-report-routing.module';
import {KpiReportComponent} from './kpi-report.component';


@NgModule({
  declarations: [KpiReportComponent],
  imports: [
    CommonModule,
    KpiReportRoutingModule
  ]
})
export class KpiReportModule { }
