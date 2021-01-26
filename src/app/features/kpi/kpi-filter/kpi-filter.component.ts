import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Area} from '../model/area';

@Component({
  selector: 'aw-kpi-filter',
  templateUrl: './kpi-filter.component.html',
  styles: [
  ]
})
export class KpiFilterComponent implements OnInit {
  kpiAreaFilter: FormGroup;
  areaListOption: Area[];
  readonly viewAllowOption = [
    { label: 'Tất cả', value: null },
    { label: 'Có', value: 1 },
    { label: 'Không', value: 0 }
  ];
  @Input() set areaList(data: Area[]) {
    const clone = [...data];
    clone.unshift({id: null, color: '', name: 'Tất cả'});
    this.areaListOption = clone;
  }
  @Output() filter: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm() {
    this.kpiAreaFilter = this.fb.group({
      kpiIndex: [''],
      area: [''],
      allowView: ['']
    });
  }

  doFilter() {
    this.filter.emit(this.kpiAreaFilter.value);
  }

}
