import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {KpiReportComponent} from './kpi-report.component';

const routes: Routes = [
  {
    path: '',
    component: KpiReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiReportRoutingModule { }
