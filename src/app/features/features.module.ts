import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FeaturesComponent} from './features.component';
import {FeaturesRoutingModule} from './features-routing.module';
import {TopBarComponent} from './topbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuitemComponent} from './menuitem.component';
import {RippleModule} from 'primeng/ripple';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {IndicatorModule} from '../shared/indicator/indicator.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { TrackingAppBehaviorComponent } from './tracking-app-behavior/tracking-app-behavior.component';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {CalendarModule} from 'primeng/calendar';
import {TranslateModule} from '@ngx-translate/core';
import {DropdownModule} from 'primeng/dropdown';
import {CardModule} from 'primeng/card';
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';



@NgModule({
  declarations: [FeaturesComponent, TopBarComponent, MenuitemComponent, TrackingAppBehaviorComponent],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    FormsModule,
    RippleModule,
    ButtonModule,
    MenuModule,
    IndicatorModule,
    MatProgressBarModule,
    BreadcrumbModule,
    CalendarModule,
    TranslateModule,
    DropdownModule,
    CardModule,
    ReactiveFormsModule,
    PaginatorModule,
    TableModule
  ],
  providers: []
})
export class FeaturesModule { }
