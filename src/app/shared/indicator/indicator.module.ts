import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalIndicatorComponent } from './global-indicator.component';
import { SectionIndicatorComponent } from './section-indicator.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';


@NgModule({
  declarations: [GlobalIndicatorComponent, SectionIndicatorComponent],
  exports: [
    GlobalIndicatorComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule
  ]
})
export class IndicatorModule { }
