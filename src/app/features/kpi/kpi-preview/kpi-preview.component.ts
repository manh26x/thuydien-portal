import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'aw-kpi-preview',
  templateUrl: './kpi-preview.component.html',
  styles: [
  ]
})
export class KpiPreviewComponent implements OnInit {
  searchValue: FormControl = new FormControl('');
  @ViewChild('tableKpi', {static: true}) tableKpi: Table;
  @Input() kpiList = [];
  @Input() titleList = [];
  @Input() showBtnAction = true;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() back: EventEmitter<any> = new EventEmitter<any>();
  @Output() export: EventEmitter<any> = new EventEmitter<any>();
  constructor(
  ) { }

  ngOnInit(): void {
  }

  doExport() {
    this.export.emit({titleList: this.titleList, kpiList: this.kpiList});
  }

  doFilter() {
    console.log(this.kpiList);
    this.tableKpi.filterGlobal(this.searchValue.value, 'contains');
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
