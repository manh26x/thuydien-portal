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
        path: 'news',
        loadChildren: () => import('./news/news.module').then(m => m.NewsModule)
      },
      {
        path: 'tags',
        loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
      },
      {
        path: 'calculate-tool',
        loadChildren: () => import('./calculate-tool/calculate-tool.module').then(m => m.CalculateToolModule)
      },
      {
        path: 'role',
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule)
      },
      {
        path: 'management-kpi',
        loadChildren: () => import('./kpi/kpi.module').then(m => m.KpiModule)
      },
      {
        path: 'branch-unit-department',
        loadChildren: () => import('./branch-unit-department/branch-unit-department.module').then(m => m.BranchUnitDepartmentModule)
      },
      {
        path: 'action-management',
        loadChildren: () => import('./tracking-app-behavior/tracking-app-behavior.module').then(m => m.TrackingAppBehaviorModule)
      },
      {
        path: 'qa',
        loadChildren: () => import('./qa/qa.module').then(m => m.QaModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FeaturesRoutingModule { }
