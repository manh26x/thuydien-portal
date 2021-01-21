import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KpiImportComponent} from './kpi-import.component';
import {KpiImportRoutingModule} from './kpi-import-routing.module';
import {PanelModule} from 'primeng/panel';
import {CustomFileUploadModule} from '../../../shared/custom-file-upload/custom-file-upload.module';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {KpiService} from '../service/kpi.service';
import {DropdownModule} from 'primeng/dropdown';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [KpiImportComponent],
  imports: [
    CommonModule,
    KpiImportRoutingModule,
    PanelModule,
    CustomFileUploadModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    ReactiveFormsModule
  ],
  providers: [KpiService]
})
export class KpiImportModule { }
