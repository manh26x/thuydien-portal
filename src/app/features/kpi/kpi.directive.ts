import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[awKpi]'
})
export class KpiDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
