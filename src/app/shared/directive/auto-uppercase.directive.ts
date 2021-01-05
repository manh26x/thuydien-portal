import {Directive, ElementRef, HostListener} from '@angular/core';
import {UtilService} from '../../core/service/util.service';

@Directive({
  selector: '[awAutoUppercase]'
})
export class AutoUppercaseDirective {

  constructor(private element: ElementRef, private util: UtilService) { }

  @HostListener('input', ['$event']) onInput() {
    let value = this.element.nativeElement.value;
    if (!value) { return ''; }
    value = value.toString().replace(/[^A-Z0-9]/ig, '');
    value = this.util.removeAccents(value).toUpperCase();
    this.element.nativeElement.value = value;
  }

}
