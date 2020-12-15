import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewsComponent} from './news.component';
import {AuthGuard} from '../../auth/auth.guard';
import {NewsDataComponent} from './news-data/news-data.component';
import {NewsCreateComponent} from './news-create/news-create.component';
import {NewsUpdateComponent} from './news-update/news-update.component';
import {NewsViewComponent} from './news-view/news-view.component';
import {FormLeaveGuard} from '../../core/form-leave.guard';

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
        component: NewsCreateComponent,
        canDeactivate: [FormLeaveGuard]
      },
      {
        path: 'update/:id',
        component: NewsUpdateComponent
      },
      {
        path: 'view/:id',
        component: NewsViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
