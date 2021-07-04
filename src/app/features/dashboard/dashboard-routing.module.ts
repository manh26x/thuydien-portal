import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {RoleEnum} from '../../shared/model/role';
import {FeatureEnum} from '../../shared/model/feature.enum';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { feature: FeatureEnum.HOME, role: RoleEnum.ACTION_VIEW }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
