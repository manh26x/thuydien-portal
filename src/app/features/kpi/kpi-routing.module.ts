import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {KpiComponent} from './kpi.component';
import {KpiReportComponent} from './kpi-report/kpi-report.component';
import {AreaCreateComponent} from './area-create/area-create.component';
import {AreaUpdateComponent} from './area-update/area-update.component';
import {KpiDetailComponent} from './kpi-detail/kpi-detail.component';
import {KpiUpdateComponent} from './kpi-update/kpi-update.component';
import {KpiDetailDataComponent} from './kpi-detail-data/kpi-detail-data.component';
import {FeatureEnum} from '../../shared/model/feature.enum';
import {RoleEnum} from '../../shared/model/role';
import {AuthGuard} from '../../auth/auth.guard';
import {FeatureGuard} from '../feature.guard';

const routes: Routes = [
  {
    path: '',
    component: KpiComponent,
    children: [
      {
        path: '',
        redirectTo: 'report'
      },
      {
        path: 'report',
        component: KpiReportComponent,
        data: {feature: FeatureEnum.KPI, role: [RoleEnum.ACTION_VIEW, RoleEnum.ACTION_IMPORT] },
        canActivate: [AuthGuard, FeatureGuard]
      },
      {
        path: 'create-area',
        component: AreaCreateComponent,
        data: {feature: FeatureEnum.KPI, role: RoleEnum.ACTION_INSERT},
        canActivate: [AuthGuard, FeatureGuard]
      },
      {
        path: 'update-area/:id',
        component: AreaUpdateComponent,
        data: {feature: FeatureEnum.KPI, role: RoleEnum.ACTION_EDIT},
        canActivate: [AuthGuard, FeatureGuard]
      },
      {
        path: 'detail/:id',
        component: KpiDetailComponent,
        data: {feature: FeatureEnum.KPI, role: RoleEnum.ACTION_VIEW},
        canActivate: [AuthGuard, FeatureGuard]
      },
      {
        path: 'update/:id',
        component: KpiUpdateComponent,
        data: {feature: FeatureEnum.KPI, role: RoleEnum.ACTION_EDIT},
        canActivate: [AuthGuard, FeatureGuard]
      },
      {
        path: 'detail-data/:id',
        component: KpiDetailDataComponent,
        data: {feature: FeatureEnum.KPI, role: RoleEnum.ACTION_VIEW},
        canActivate: [AuthGuard, FeatureGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiRoutingModule { }
