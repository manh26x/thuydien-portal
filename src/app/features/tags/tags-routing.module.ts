import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TagsComponent} from './tags.component';
import {TagsDataComponent} from './tags-data/tags-data.component';
import {TagsCreateComponent} from './tags-create/tags-create.component';
import {TagsUpdateComponent} from './tags-update/tags-update.component';
import {AuthGuard} from '../../auth/auth.guard';
import {FormLeaveGuard} from '../../core/form-leave.guard';
import {TagsViewComponent} from './tags-view/tags-view.component';
import {FeatureGuard} from '../feature.guard';
import {RoleEnum} from '../../shared/model/role';
import {FeatureEnum} from '../../shared/model/feature.enum';

const routes: Routes = [
  {
    path: '',
    component: TagsComponent,
    children: [
      {
        path: '',
        component: TagsDataComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: {feature: FeatureEnum.TAG, role: RoleEnum.ACTION_VIEW}
      },
      {
        path: 'create',
        component: TagsCreateComponent,
        canActivate: [AuthGuard, FeatureGuard],
        canDeactivate: [FormLeaveGuard],
        data: {feature: FeatureEnum.TAG, role: RoleEnum.ACTION_INSERT}
      },
      {
        path: 'update/:id',
        component: TagsUpdateComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: { role: RoleEnum.ACTION_EDIT }
      },
      {
        path: 'view/:id',
        component: TagsViewComponent,
        canActivate: [AuthGuard, FeatureGuard],
        data: {feature: FeatureEnum.TAG, role: RoleEnum.ACTION_VIEW}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule { }
