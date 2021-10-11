import {Component, OnInit, ViewChild} from '@angular/core';
import {QaConst} from "../model/qa";
import {Router} from "@angular/router";
import {BaseComponent} from "../../../core/base.component";
import {FeatureEnum} from "../../../shared/model/feature.enum";
import {RoleEnum} from "../../../shared/model/role";
import {AuthService} from "../../../auth/auth.service";
import {QaService} from "../service/qa.service";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {IndicatorService} from "../../../shared/indicator/indicator.service";
import {map, startWith, switchMap, takeUntil} from "rxjs/operators";
import {KpiEnum} from "../../kpi/model/kpi.enum";
import {QaEnum} from "../qa";
import {FormBuilder, Validators} from "@angular/forms";
import {Paginator} from "primeng/paginator";
import {ApiErrorResponse} from "../../../core/model/error-response";

@Component({
  selector: 'aw-qa-data',
  templateUrl: './qa-data.component.html',
  styles: [
  ]
})
export class QaDataComponent extends BaseComponent implements OnInit {
  @ViewChild('qaPaging') paging: Paginator;
  formFilter: any;
  statusList = [];
  qnaList = [];
  qaConst = QaConst;
  isHasDel = false;
  isHasEdit = false;
  isHasInsert = false;
  pageSize = 10;
  page = 0;
  totalItem = 14;

  constructor(
    private auth: AuthService,
    private router: Router,
    private qaService: QaService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private confirmDialog: ConfirmationService,
    private messageService: MessageService,
    private indicator: IndicatorService,
    private fb: FormBuilder

  ) {
    super();
    this.initForm();
    this.isHasInsert = this.auth.isHasRole(FeatureEnum.QA, RoleEnum.ACTION_INSERT);
    this.isHasEdit = this.auth.isHasRole(FeatureEnum.QA, RoleEnum.ACTION_EDIT);
    this.isHasDel = this.auth.isHasRole(FeatureEnum.QA, RoleEnum.ACTION_DELETE);
    this.isHasDel = this.auth.isHasRole(FeatureEnum.QA, RoleEnum.ACTION_DELETE);
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      switchMap(lang => this.translate.get('const').pipe(
        map(resConst => ({ lang, resConst }))
      ))
    ).subscribe(({lang, resConst}) => {

      this.statusList = [
        { label: resConst.all, value: null },
        { label: resConst.active, value: QaEnum.ACTIVE },
        { label: resConst.inactive, value: QaEnum.INACTIVE }
      ];
    });
  }

  ngOnInit(): void {
    this.getListQa();
  }
  doFilter() {
    this.paging.changePage(0);
  }

  getListQa() {

    const filterObj = {
      keyword: this.formFilter.get('keyword').value,
      status: this.formFilter.get('status').value.value,
      page: this.page,
      pageSize: this.pageSize
    };
    this.qaService.filterQa(filterObj).subscribe(res => {
      this.qnaList = res.listQnA;
      this.totalItem = res.totalRecord;
    });
  }

  hasErrorFilter(searchValue: string, pattern: string) {
    return false;
  }

  gotoCreate() {
    this.router.navigate(['qa', 'create']);
  }

  lazyLoadUser($event: any) {

  }

  doDelete(qa: any) {
    this.confirmDialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('qa.confirm.delete'),
      message: this.translate.instant('qa.confirm.deleteMessage', { question: qa.question }),
      acceptLabel: this.translate.instant('qa.confirm.accept'),
      rejectLabel: this.translate.instant('qa.confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.qaService.delete(qa.id).pipe(
          switchMap(async () => this.getListQa())
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('qa.message.deleteSuccess')
          });
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('qa.message.deleteNotFound')
            });
          } else {
            throw err;
          }
        }, () => this.indicator.hideActivityIndicator());
      },
    });
  }

  gotoUpdate(id) {
    this.router.navigate(['qa', 'update', id]);
  }

  gotoView(id) {
    this.router.navigate(['qa', 'view', id]);
  }

  changePage(evt) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.getListQa();
  }

  private initForm() {
    this.formFilter = this.fb.group({
      keyword: [''],
      status: [{value:null}]
    });
  }
}
