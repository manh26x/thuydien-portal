import {Directive, ElementRef, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[awBiggerZero]'
})
export class BiggerZeroDirective {

  constructor(private element: ElementRef, private ngControl: NgControl) { }

  @HostListener('input', ['$event']) onInput() {
    const value: string = this.element.nativeElement.value;
    if (!value) { return ''; }
    const rmMinus = value.replace('-', '');
    this.ngControl.control.setValue(rmMinus, { emitEvent: false });
  }

}
