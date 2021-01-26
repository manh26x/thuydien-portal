import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'aw-kpi-preview',
  templateUrl: './kpi-preview.component.html',
  styles: [
  ]
})
export class KpiPreviewComponent implements OnInit {
  @Input() kpiList = [];
  @Input() titleList = [];
  @Input() showBtnAction = true;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() back: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  doSave() {
    this.save.emit();
  }

  doCancel() {
    this.cancel.emit();
  }

  doBack() {
    this.back.emit();
  }

}
