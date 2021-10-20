import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewsComponent} from './news.component';
import {AuthGuard} from '../../auth/auth.guard';
import {NewsDataComponent} from './news-data/news-data.component';
import {NewsCreateComponent} from './news-create/news-create.component';
import {NewsUpdateComponent} from './news-update/news-update.component';
import {NewsViewComponent} from './news-view/news-view.component';
import {FormLeaveGuard} from '../../core/form-leave.guard';
import {RoleEnum} from '../../shared/model/role';
import {FeatureGuard} from '../feature.guard';
import {FeatureEnum} from '../../shared/model/feature.enum';
import {NewsTabComponent} from "./news-tab/news-tab.component";

const routes: Routes = [
  { path: '',
    component: NewsComponent,
    children: [
      {
        path: '',
        component: NewsTabComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: {feature: FeatureEnum.NEWS, role: RoleEnum.ACTION_VIEW}
      },
      {
        path: 'create',
        component: NewsCreateComponent,
        canActivate: [AuthGuard, FeatureGuard],
        canDeactivate: [FormLeaveGuard],
        data: {feature: FeatureEnum.NEWS, role: RoleEnum.ACTION_INSERT}
      },
      {
        path: 'update/:id',
        component: NewsUpdateComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: {feature: FeatureEnum.NEWS, role: RoleEnum.ACTION_EDIT}
      },
      {
        path: 'view/:id',
        component: NewsViewComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: {feature: FeatureEnum.NEWS, role: RoleEnum.ACTION_VIEW}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
