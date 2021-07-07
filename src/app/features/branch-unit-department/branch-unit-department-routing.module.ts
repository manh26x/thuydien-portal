import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BranchUnitDepartmentComponent} from './branch-unit-department.component';
import {BranchComponent} from './branch/branch.component';
import {AuthGuard} from '../../auth/auth.guard';
import {FeatureGuard} from '../feature.guard';

const routes: Routes = [
  {
    path: '',
    component: BranchUnitDepartmentComponent,
    children: [
      {
        path: 'branch',
        component: BranchComponent ,
        canActivate: [AuthGuard, FeatureGuard]
      }]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchUnitDepartmentRoutingModule { }
