import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FeaturesComponent} from './features.component';
import {FeaturesRoutingModule} from './features-routing.module';
import {TopBarComponent} from './topbar.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputSwitchModule} from 'primeng/inputswitch';
import {FormsModule} from '@angular/forms';
import {MenuitemComponent} from './menuitem.component';
import {RippleModule} from 'primeng/ripple';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {IndicatorModule} from '../shared/indicator/indicator.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';



@NgModule({
  declarations: [FeaturesComponent, TopBarComponent, MenuitemComponent],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    RadioButtonModule,
    InputSwitchModule,
    FormsModule,
    RippleModule,
    ButtonModule,
    MenuModule,
    IndicatorModule,
    MatProgressBarModule
  ],
  providers: []
})
export class FeaturesModule { }
