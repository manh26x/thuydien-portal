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
        path: 'qna',
        loadChildren: () => import('./qna/qna.module').then(m => m.QnaModule)
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
        path: 'kpi',
        loadChildren: () => import('./kpi/kpi.module').then(m => m.KpiModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FeaturesRoutingModule { }
