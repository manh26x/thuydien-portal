import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QnaRoutingModule } from './qna-routing.module';
import {QnaComponent} from './qna.component';


@NgModule({
  declarations: [QnaComponent],
  imports: [
    CommonModule,
    QnaRoutingModule
  ]
})
export class QnaModule { }
