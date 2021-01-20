import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'report'
  },
  {
    path: 'report',
    loadChildren: () => import('./kpi-report/kpi-report.module').then(m => m.KpiReportModule)
  },
  {
    path: 'import',
    loadChildren: () => import('./kpi-import/kpi-import.module').then(m => m.KpiImportModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiRoutingModule { }
