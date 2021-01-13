import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoUppercaseDirective } from './directive/auto-uppercase.directive';
import { EllipsisPipe } from './pipe/ellipsis.pipe';

/**
 * @author: TruongNH
 * date: 16/12/2020
 * module include custom pipe and directive
 */
@NgModule({
  declarations: [AutoUppercaseDirective, EllipsisPipe],
  imports: [
    CommonModule
  ],
  exports: [AutoUppercaseDirective, EllipsisPipe]
})
export class SharedModule { }
