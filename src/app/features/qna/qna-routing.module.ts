import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {QnaComponent} from './qna.component';

const routes: Routes = [
  {
    path: '',
    component: QnaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QnaRoutingModule { }
