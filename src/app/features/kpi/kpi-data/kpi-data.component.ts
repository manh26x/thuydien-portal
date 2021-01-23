import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {KpiEnum} from '../model/kpi.enum';
import {TagDetail} from '../../tags/model/tags';
import {PageChangeEvent} from '../../../shared/model/page-change-event';
import {Router} from '@angular/router';
import {KpiReport} from '../model/kpi';

@Component({
  selector: 'aw-kpi-data',
  templateUrl: './kpi-data.component.html',
  styles: [
  ]
})
export class KpiDataComponent implements OnInit {
  @Input() kpiList = [];
  @Input() tagKpiList: TagDetail[] = [];
  @Input() totalItem = 0;
  @Output() filter: EventEmitter<any> = new EventEmitter<any>();
  pageSize = 10;
  page = 0;
  statusList = [
    { label: 'Tất cả', value: -1 },
    { label: 'Hoạt động', value: KpiEnum.STATUS_ACTIVE },
    { label: 'Không hoạt động', value: KpiEnum.STATUS_INACTIVE }
  ];
  formFilter: FormGroup;
  kpiConst = KpiEnum;
  constructor(private fb: FormBuilder, private router: Router) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  gotoView(kpi: KpiReport) {
    this.router.navigate(['management-kpi', 'detail', kpi.id]);
  }

  doFilter() {
    this.filter.emit({ page: this.page, pageSize: this.pageSize, ...this.formFilter.value });
  }

  changePage(evt: PageChangeEvent) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.filter.emit({ page: this.page, pageSize: this.pageSize, ...this.formFilter.value });
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
