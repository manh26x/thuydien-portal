import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[awAutoUppercase]'
})
export class AutoUppercaseDirective {

  constructor(private element: ElementRef) { }

  @HostListener('input', ['$event']) onInput() {
    const value: string = this.element.nativeElement.value;
    if (!value) { return ''; }
    const rmSpace = value.replace(/\s/g, '');
    this.element.nativeElement.value = rmSpace.toUpperCase();
  }

}
