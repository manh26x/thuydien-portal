import {Component, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: ''
})

export abstract class BaseComponent implements OnDestroy {
  public nextOnDestroy = new Subject();

  protected constructor() {}

  ngOnDestroy() {
    this.nextOnDestroy.next();
    this.nextOnDestroy.complete();
    this.destroy();
  }

  destroy() {}
}
