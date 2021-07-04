import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserComponent} from './user.component';
import {UserDataComponent} from './user-data/user-data.component';
import {AuthGuard} from '../../auth/auth.guard';
import {UserCreateComponent} from './user-create/user-create.component';
import {UserUpdateComponent} from './user-update/user-update.component';
import {UserViewComponent} from './user-view/user-view.component';
import {FormLeaveGuard} from '../../core/form-leave.guard';
import {FeatureGuard} from '../feature.guard';
import {RoleEnum} from '../../shared/model/role';
import {FeatureEnum} from '../../shared/model/feature.enum';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        component: UserDataComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: {feature: FeatureEnum.USER, role: RoleEnum.ACTION_VIEW}
      },
      {
        path: 'create',
        component: UserCreateComponent,
        canActivate: [AuthGuard, FeatureGuard],
        canDeactivate: [FormLeaveGuard],
        data: {feature: FeatureEnum.USER, role: RoleEnum.ACTION_INSERT}
      },
      {
        path: 'update/:id',
        component: UserUpdateComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: {feature: FeatureEnum.USER, role: RoleEnum.ACTION_EDIT}
      },
      {
        path: 'view/:id',
        component: UserViewComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: {feature: FeatureEnum.USER, role: RoleEnum.ACTION_VIEW}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
