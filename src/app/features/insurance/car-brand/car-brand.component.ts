import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {InsuranceService} from '../service/insurance.service';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {concatMap, startWith, switchMap} from 'rxjs/operators';
import {InsuranceConst} from '../model/insurance';
import {CarBrandConst} from '../model/car-brand';
import {FormBuilder} from '@angular/forms';
import {Paginator} from 'primeng/paginator';
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import {ApiErrorResponse} from "../../../core/model/error-response";
import {ConfirmDialog} from "primeng/confirmdialog";

@Component({
  selector: 'aw-car-brand',
  templateUrl: './car-brand.component.html',
  styles: [
  ]
})
export class CarBrandComponent implements OnInit {
  @ViewChild('paging') paging: Paginator;
  statusList = [];
  formFilter: any;
  totalItems = 1;
  carBrandList = [];
  page = 0;
  pageSize = 10;
  isHasInsert = true;
  carBrandConst = CarBrandConst;
  constructor(
    private router: Router,
    private insuranceService: InsuranceService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private indicator: IndicatorService,
    private fb: FormBuilder,
    private confirmDialog: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.initFormSearch();
  }

  ngOnInit(): void {
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

    this.getListCarBrand();
  }

  initFormSearch() {
    this.formFilter = this.fb.group({
      keySearch: [''],
      status: [{code: InsuranceConst.ALL}]
    });
  }

  getListCarBrand() {
    this.indicator.showActivityIndicator();
    const body = {
      keySearch: this.formFilter.get('keySearch').value,
      status: this.formFilter.get('status').value.code,
      page: this.page,
      pageSize: this.pageSize
    };
    this.insuranceService.carBrandFilter(body).subscribe(
      res => {
        this.carBrandList = res.listBrand;
        this.totalItems = res.totalRecords;

      },
    () => {},
      () => this.indicator.hideActivityIndicator()
    );

  }

  hasErrorFilter(controlName: string, errorName: string): boolean {
    const control = this.formFilter.get(controlName);
    if (control == null) {
      return false;
    }

    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  doFilter() {
    this.paging.changePage(0);
  }

  lazyLoadCarBrand(evt: LazyLoadEvent) {

  }

  gotoUpdate(id) {
    this.router.navigate(['insurance', 'car-brand', 'update', id]);
  }

  deleteCarBrand(carBrand: any) {
    this.confirmDialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: this.translate.instant('confirm.deleteMessage', { name: carBrand.brand }),
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.insuranceService.deleteCarBrand(carBrand.id).pipe(
          switchMap(async () => this.getListCarBrand())
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

  gotoCreate() {
    this.router.navigate(['insurance', 'car-brand', 'create']);
  }

  changePage(evt) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.getListCarBrand();
  }
}
