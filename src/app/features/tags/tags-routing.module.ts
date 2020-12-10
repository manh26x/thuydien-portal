import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TagsComponent} from './tags.component';
import {TagsDataComponent} from './tags-data/tags-data.component';
import {TagsCreateComponent} from './tags-create/tags-create.component';
import {TagsUpdateComponent} from './tags-update/tags-update.component';
import {AuthGuard} from '../../auth/auth.guard';
import {FormLeaveGuard} from '../../core/form-leave.guard';
import {TagsViewComponent} from './tags-view/tags-view.component';

const routes: Routes = [
  {
    path: '',
    component: TagsComponent,
    children: [
      {
        path: '',
        component: TagsDataComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create',
        component: TagsCreateComponent,
        canActivate: [AuthGuard],
        canDeactivate: [FormLeaveGuard]
      },
      {
        path: 'update/:id',
        component: TagsUpdateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'view/:id',
        component: TagsViewComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule { }
