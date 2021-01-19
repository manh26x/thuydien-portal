import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiRoutingModule } from './kpi-routing.module';
import { KpiImportComponent } from './kpi-import/kpi-import.component';
import {KpiComponent} from './kpi.component';


@NgModule({
  declarations: [KpiComponent, KpiImportComponent],
  imports: [
    CommonModule,
    KpiRoutingModule
  ]
})
export class KpiModule { }
