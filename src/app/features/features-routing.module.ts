import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FeaturesComponent} from './features.component';
import {AuthGuard} from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FeaturesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },

      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
      },

      {
        path: 'role',
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule)
      },

      {
        path: 'branch-unit-department',
        loadChildren: () => import('./branch-unit-department/branch-unit-department.module').then(m => m.BranchUnitDepartmentModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FeaturesRoutingModule { }
