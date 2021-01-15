import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[awAutoUppercase]'
})
export class AutoUppercaseDirective {

  constructor(private element: ElementRef) { }

  @HostListener('input', ['$event']) onInput() {
    const value = this.element.nativeElement.value;
    if (!value) { return ''; }
    this.element.nativeElement.value = value.toUpperCase();
  }

}
