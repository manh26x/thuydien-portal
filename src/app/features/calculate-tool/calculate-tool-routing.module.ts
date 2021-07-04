import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CalculateToolComponent} from './calculate-tool.component';
import {AuthGuard} from '../../auth/auth.guard';
import {CalculateToolDataComponent} from './calculate-tool-data/calculate-tool-data.component';
import {FeatureGuard} from '../feature.guard';
import {RoleEnum} from '../../shared/model/role';
import {FeatureEnum} from '../../shared/model/feature.enum';

const routes: Routes = [
  {
    path: '',
    component: CalculateToolComponent,
    children: [
      {
        path: '',
        component: CalculateToolDataComponent,
        data: {feature: FeatureEnum.TOOL, role: RoleEnum.ACTION_VIEW},
        canActivate: [AuthGuard, FeatureGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculateToolRoutingModule { }
