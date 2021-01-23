import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {KpiEnum} from '../model/kpi.enum';

@Component({
  selector: 'aw-kpi-data',
  templateUrl: './kpi-data.component.html',
  styles: [
  ]
})
export class KpiDataComponent implements OnInit {
  @Input() kpiList = [];
  statusList = [
    { label: 'Tất cả', value: -1 },
    { label: 'Hoạt động', value: KpiEnum.STATUS_ACTIVE },
    { label: 'Không hoạt động', value: KpiEnum.STATUS_INACTIVE }
  ];
  formFilter: FormGroup;
  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm() {
    this.formFilter = this.fb.group({
      typeReport: [''],
      createDate: [],
      modifyDate: [],
      status: []
    });
  }

}
