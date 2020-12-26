import {Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'aw-section-indicator',
  template: `
    <div class="indicator" [ngClass]="{'load-failed': isFailed}" *ngIf="isLoading">
      <p-progressSpinner strokeWidth="3" [style]="{width: '70px', height: '70px'}"></p-progressSpinner>
      <button *ngIf="isFailed" (click)="emitCallback()" pButton>{{retryLabel}}</button>
    </div>
  `,
  styles: [`:host{top: 0;bottom: 0;left: 0;right: 0;margin: auto;position: absolute;}`]
})
export class SectionIndicatorComponent implements OnInit, OnChanges {
  @Input() isLoading: boolean;
  @Input() isFailed: boolean;
  @Input() retryLabel = 'Thử lại';
  @Output() tryAgain: EventEmitter<any> = new EventEmitter();
  @HostBinding('class.invisible') isHidden = true;
  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isLoading) {
      this.isHidden = !changes.isLoading.currentValue;
    }
  }

  emitCallback() {
    this.tryAgain.emit();
  }

}
