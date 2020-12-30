import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RoleComponent} from './role.component';
import {RoleDataComponent} from './role-data/role-data.component';

const routes: Routes = [
  {
    path: '',
    component: RoleComponent,
    children: [
      {
        path: '',
        component: RoleDataComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
