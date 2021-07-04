import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalIndicatorComponent } from './global-indicator.component';
import { SectionIndicatorComponent } from './section-indicator.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ButtonModule} from 'primeng/button';


@NgModule({
  declarations: [GlobalIndicatorComponent, SectionIndicatorComponent],
    exports: [
        GlobalIndicatorComponent,
        SectionIndicatorComponent
    ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule
  ]
})
export class IndicatorModule { }
