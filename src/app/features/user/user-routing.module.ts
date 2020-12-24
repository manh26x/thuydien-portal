import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserComponent} from './user.component';
import {UserDataComponent} from './user-data/user-data.component';
import {AuthGuard} from '../../auth/auth.guard';
import {UserCreateComponent} from './user-create/user-create.component';
import {UserUpdateComponent} from './user-update/user-update.component';
import {UserViewComponent} from './user-view/user-view.component';
import {FormLeaveGuard} from '../../core/form-leave.guard';
import {SupperAdminGuard} from '../supper-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        component: UserDataComponent,
        canActivate: [AuthGuard, SupperAdminGuard]
      },
      {
        path: 'create',
        component: UserCreateComponent,
        canActivate: [AuthGuard, SupperAdminGuard],
        canDeactivate: [FormLeaveGuard]
      },
      {
        path: 'update/:id',
        component: UserUpdateComponent,
        canActivate: [AuthGuard, SupperAdminGuard]
      },
      {
        path: 'view/:id',
        component: UserViewComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
