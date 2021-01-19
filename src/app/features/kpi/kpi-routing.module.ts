import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {KpiComponent} from './kpi.component';
import {KpiImportComponent} from './kpi-import/kpi-import.component';

const routes: Routes = [
  {
    path: '',
    component: KpiComponent,
    children: [
      {
        path: 'import',
        component: KpiImportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiRoutingModule { }
