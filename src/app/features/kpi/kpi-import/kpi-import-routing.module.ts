import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {KpiImportComponent} from './kpi-import.component';


const routes: Routes = [
  {
    path: '',
    component: KpiImportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiImportRoutingModule { }
