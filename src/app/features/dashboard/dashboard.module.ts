import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {TranslateModule} from '@ngx-translate/core';
import {GMapModule} from 'primeng/gmap';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {AgmCoreModule} from '@agm/core';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TranslateModule,
    GMapModule,
    ButtonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDjP_5VaaraTeBwF-2Y8dfJZVv4IyQGBNE',
      libraries: ['places', 'geometry']
    }),
    DialogModule
  ]
})
export class DashboardModule { }
