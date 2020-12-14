import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CalculateToolComponent} from './calculate-tool.component';
import {AuthGuard} from '../../auth/auth.guard';
import {CalculateToolDataComponent} from './calculate-tool-data/calculate-tool-data.component';

const routes: Routes = [
  {
    path: '',
    component: CalculateToolComponent,
    children: [
      {
        path: '',
        component: CalculateToolDataComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculateToolRoutingModule { }
