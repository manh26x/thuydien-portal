import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RoleComponent} from './role.component';
import {RoleDataComponent} from './role-data/role-data.component';
import {RoleCreateComponent} from './role-create/role-create.component';
import {RoleUpdateComponent} from './role-update/role-update.component';
import {AuthGuard} from '../../auth/auth.guard';
import {FormLeaveGuard} from '../../core/form-leave.guard';
import {FeatureGuard} from '../feature.guard';
import {RoleEnum} from '../../shared/model/role';
import {FeatureEnum} from '../../shared/model/feature.enum';

const routes: Routes = [
  {
    path: '',
    component: RoleComponent,
    children: [
      {
        path: '',
        component: RoleDataComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: {feature: FeatureEnum.ROLE, role: RoleEnum.ACTION_VIEW}
      },
      {
        path: 'create',
        component: RoleCreateComponent,
        canActivate: [AuthGuard, FeatureGuard],
        canDeactivate: [FormLeaveGuard],
        data: {feature: FeatureEnum.ROLE, role: RoleEnum.ACTION_INSERT}
      },
      {
        path: 'update/:id',
        component: RoleUpdateComponent,
        canActivate: [AuthGuard, FeatureGuard],
        canDeactivate: [FormLeaveGuard],
        data: {feature: FeatureEnum.ROLE, role: RoleEnum.ACTION_EDIT}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
