import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {KpiComponent} from './kpi.component';
import {KpiReportComponent} from './kpi-report/kpi-report.component';
import {AreaCreateComponent} from './area-create/area-create.component';
import {AreaUpdateComponent} from './area-update/area-update.component';
import {KpiDetailComponent} from './kpi-detail/kpi-detail.component';
import {KpiUpdateComponent} from './kpi-update/kpi-update.component';

const routes: Routes = [
  {
    path: '',
    component: KpiComponent,
    children: [
      {
        path: 'report',
        component: KpiReportComponent
      },
      {
        path: 'create-area',
        component: AreaCreateComponent
      },
      {
        path: 'update-area/:id',
        component: AreaUpdateComponent
      },
      {
        path: 'detail/:id',
        component: KpiDetailComponent
      },
      {
        path: 'update/:id',
        component: KpiUpdateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiRoutingModule { }
