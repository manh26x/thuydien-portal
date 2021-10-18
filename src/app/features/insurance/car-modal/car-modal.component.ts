import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Paginator} from "primeng/paginator";
import {concatMap, startWith, switchMap} from "rxjs/operators";
import {InsuranceConst} from "../model/insurance";
import {CarBrandConst} from "../model/car-brand";
import {InsuranceService} from "../service/insurance.service";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {IndicatorService} from "../../../shared/indicator/indicator.service";
import {FormBuilder} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {FeatureEnum} from "../../../shared/model/feature.enum";
import {RoleEnum} from "../../../shared/model/role";
import {AuthService} from "../../../auth/auth.service";
import {ApiErrorResponse} from "../../../core/model/error-response";

@Component({
  selector: 'aw-car-modal',
  templateUrl: './car-modal.component.html',
  styles: [
  ]
})
export class CarModalComponent implements OnInit {
  @ViewChild('paging') paging: Paginator;
  formFilter: any;
  statusList = [];
  carModalList = [
    {id: 1, name: 'Mike'}
  ];
  isHasInsert = false;
  isHasEdit = false;
  isHasDel = false;
  page = 0;
  pageSize = 10;
  totalItems = 1;
  carConst = CarBrandConst;
  constructor(
    private router: Router,
    private insuranceService: InsuranceService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private indicator: IndicatorService,
    private fb: FormBuilder,
    private confirmDialog: ConfirmationService,
    private messageService: MessageService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.isHasInsert = this.auth.isHasRole(FeatureEnum.ROLE, RoleEnum.ACTION_INSERT);
    this.isHasEdit = this.auth.isHasRole(FeatureEnum.ROLE, RoleEnum.ACTION_EDIT);
    this.isHasDel = this.auth.isHasRole(FeatureEnum.ROLE, RoleEnum.ACTION_DELETE);

    this.indicator.showActivityIndicator();
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        {label: res.all, code: InsuranceConst.ALL},
        {label: res.active, code: CarBrandConst.ACTIVE},
        {label: res.inactive, code: CarBrandConst.INACTIVE}
      ];
      this.indicator.hideActivityIndicator();
    });
    this.initFormSearch();
    this.getListCarModal();
  }

  initFormSearch() {
    this.formFilter = this.fb.group({
      keySearch: [''],
      status: [{code: InsuranceConst.ALL}]
    });
  }


  getListCarModal() {
    this.indicator.showActivityIndicator();
    const body = {
      keySearch: this.formFilter.get('keySearch').value,
      status: this.formFilter.get('status').value.code,
      page: this.page,
      pageSize: this.pageSize
    };
    this.insuranceService.carModalFilter(body).subscribe(
      res => {
        this.carModalList = res.listModel;
        this.totalItems = res.totalRecords;
      },
      () => {},
      () => this.indicator.hideActivityIndicator()
    );

  }
  doFilter() {
    this.paging.changePage(0);
  }

  hasErrorFilter(searchValue: string, pattern: string) {

  }

  lazyLoadCarModal($event: any) {

  }

  gotoUpdate(id) {
    this.router.navigate(['insurance', 'car-modal', 'update', id]);
  }

  deleteCarModal(carModal: any) {
    this.confirmDialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: this.translate.instant('confirm.deleteMessage', { name: carModal.model }),
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.insuranceService.deleteCarModel(carModal.id).pipe(
          switchMap(async () => this.getListCarModal())
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.deleteSuccess')
          });
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('message.deleteNotFound')
            });
          } else {
            throw err;
          }
        }, () => this.indicator.hideActivityIndicator());
      },
    });
  }

  changePage(evt) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.getListCarModal();
  }

  gotoCreate() {
    this.router.navigate(['insurance', 'car-modal', 'create']);
  }
}
