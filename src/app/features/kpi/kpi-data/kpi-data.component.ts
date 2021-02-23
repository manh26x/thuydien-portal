import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {KpiEnum} from '../model/kpi.enum';
import {TagDetail} from '../../tags/model/tags';
import {PageChangeEvent} from '../../../shared/model/page-change-event';
import {Router} from '@angular/router';
import {KpiReport} from '../model/kpi';
import {BaseComponent} from '../../../core/base.component';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {map, startWith, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'aw-kpi-data',
  templateUrl: './kpi-data.component.html',
  styles: [
  ]
})
export class KpiDataComponent extends BaseComponent implements OnInit {
  @Input() kpiList = [];
  @Input() set tagKpiList(data: TagDetail[]) {
    const clone = [...data];
    clone.unshift({keyTag: '', value: this.appTranslate.getTranslate('const.all')});
    this.tagKpi = clone;
  }
  tagKpi: TagDetail[] = [];
  @Input() totalItem = 0;
  @Output() filter: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  pageSize = 10;
  page = 0;
  statusList = [];
  formFilter: FormGroup;
  kpiConst = KpiEnum;
  @Input() isHasEdit: boolean;
  @Input() isHasDel: boolean;
  readonly yearSelect = `${new Date().getFullYear() - 10}:${new Date().getFullYear()}`;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private appTranslate: AppTranslateService
  ) {
    super();
    this.initForm();
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      switchMap(lang => this.translate.get('kpi.const').pipe(
        map(resConst => ({ lang, resConst }))
      ))
    ).subscribe(({lang, resConst}) => {
      if (lang) {
        const clone = [...this.tagKpi];
        clone.shift();
        clone.unshift({ keyTag: '', value: resConst.all });
        this.tagKpi = clone;
      }
      this.statusList = [
        { label: resConst.all, value: null },
        { label: resConst.active, value: KpiEnum.STATUS_ACTIVE },
        { label: resConst.inactive, value: KpiEnum.STATUS_INACTIVE }
      ];
    });
  }

  ngOnInit(): void {
  }

  gotoDetailData(kpi: KpiReport) {
    this.router.navigate(['management-kpi', 'detail-data', kpi.id]);
  }

  doDelete(kpi: KpiReport) {
    this.delete.emit(kpi);
  }

  gotoView(kpi: KpiReport) {
    this.router.navigate(['management-kpi', 'detail', kpi.id]);
  }

  gotoUpdate(kpi: KpiReport) {
    this.router.navigate(['management-kpi', 'update', kpi.id]);
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
      reportType: [''],
      createDate: [],
      modifyDate: [],
      status: []
    });
  }

}
