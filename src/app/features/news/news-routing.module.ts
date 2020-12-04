import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewsComponent} from './news.component';
import {AuthGuard} from '../../auth/auth.guard';
import {NewsDataComponent} from './news-data/news-data.component';
import {NewsCreateComponent} from './news-create/news-create.component';

const routes: Routes = [
  { path: '',
    component: NewsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: NewsDataComponent
      },
      {
        path: 'create',
        component: NewsCreateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
