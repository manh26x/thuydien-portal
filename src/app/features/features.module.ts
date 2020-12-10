import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FeaturesComponent} from './features.component';
import {FeaturesRoutingModule} from './features-routing.module';
import {TopBarComponent} from './topbar.component';
import {FooterComponent} from './footer.component';
import {ConfigComponent} from './config.component';
import {MenuComponent} from './menu.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputSwitchModule} from 'primeng/inputswitch';
import {FormsModule} from '@angular/forms';
import {MenuitemComponent} from './menuitem.component';
import {MenuService} from './menu.service';
import {RippleModule} from 'primeng/ripple';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {IndicatorModule} from '../shared/indicator/indicator.module';



@NgModule({
  declarations: [FeaturesComponent, TopBarComponent, FooterComponent, ConfigComponent, MenuComponent, MenuitemComponent],
    imports: [
      CommonModule,
      FeaturesRoutingModule,
      RadioButtonModule,
      InputSwitchModule,
      FormsModule,
      RippleModule,
      ButtonModule,
      MenuModule,
      IndicatorModule
    ],
  providers: [
    MenuService
  ]
})
export class FeaturesModule { }
