import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KpiImportComponent} from './kpi-import.component';
import {KpiImportRoutingModule} from './kpi-import-routing.module';



@NgModule({
  declarations: [KpiImportComponent],
  imports: [
    CommonModule,
    KpiImportRoutingModule
  ]
})
export class KpiImportModule { }
