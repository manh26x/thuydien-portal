import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RoleComponent} from './role.component';
import {RoleDataComponent} from './role-data/role-data.component';
import {RoleCreateComponent} from './role-create/role-create.component';
import {RoleUpdateComponent} from './role-update/role-update.component';
import {AuthGuard} from '../../auth/auth.guard';
import {FormLeaveGuard} from '../../core/form-leave.guard';

const routes: Routes = [
  {
    path: '',
    component: RoleComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: RoleDataComponent
      },
      {
        path: 'create',
        component: RoleCreateComponent,
        canDeactivate: [FormLeaveGuard]
      },
      {
        path: 'update/:id',
        component: RoleUpdateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
