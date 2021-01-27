import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Area} from '../model/area';
import {BaseComponent} from '../../../core/base.component';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {startWith, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'aw-kpi-filter',
  templateUrl: './kpi-filter.component.html',
  styles: [
  ]
})
export class KpiFilterComponent extends BaseComponent implements OnInit {
  kpiAreaFilter: FormGroup;
  areaListOption: Area[];
  viewAllowOption = [];
  @Input() set areaList(data: Area[]) {
    const clone = [...data];
    clone.unshift({id: null, color: '', name: this.translate.instant('kpi.const.all')});
    this.areaListOption = clone;
  }
  @Output() filter: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private appTranslate: AppTranslateService
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      switchMap(_ => this.translate.get('kpi.const'))
    ).subscribe(res => {
      this.viewAllowOption = [
        { label: res.all, value: null },
        { label: res.yes, value: 1 },
        { label: res.no, value: 0 }
      ];
    });
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
