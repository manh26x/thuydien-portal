import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoUppercaseDirective } from './directive/auto-uppercase.directive';

/**
 * @author: TruongNH
 * date: 16/12/2020
 * module include custom pipe and directive
 */
@NgModule({
  declarations: [AutoUppercaseDirective],
  imports: [
    CommonModule
  ],
  exports: [AutoUppercaseDirective]
})
export class SharedModule { }
