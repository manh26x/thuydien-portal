import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BranchUnitDepartmentComponent} from '../branch-unit-department/branch-unit-department.component';
import {BranchComponent} from '../branch-unit-department/branch/branch.component';
import {AuthGuard} from '../../auth/auth.guard';
import {FeatureGuard} from '../feature.guard';
import {TrackingAppBehaviorComponent} from './tracking-app-behavior.component';

const routes: Routes = [
  {
    path: '',
    component: TrackingAppBehaviorComponent,

  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingAppBehaviorRoutingModule { }
