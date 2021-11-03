import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {FormBuilder, Validators} from "@angular/forms";
import {concatMap, finalize, startWith, takeUntil} from "rxjs/operators";
import {BaseComponent} from "../../../core/base.component";
import {BranchService} from "../../../shared/service/branch.service";
import {InsuranceService} from "../service/insurance.service";
import {Paginator} from "primeng/paginator";
import {IndicatorService} from "../../../shared/indicator/indicator.service";
import { saveAs } from 'file-saver';
import {UtilService} from "../../../core/service/util.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'aw-insurance-data',
  templateUrl: './insurance-data.component.html',
  styles: [
  ]
})
export class InsuranceDataComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('paging') paging: Paginator;
  formFilter: any;
  statusList: any;
  isHasEdit = true;
  isHasDel = true;
  pageSize = 10;
  branchList = [];
  insuranceList = [];
  totalItems = 0;
  page = 0;
  initMaxShow = 2;
  displayExport = false;
  exportForm: any;
  readonly yearSelect = `${new Date().getFullYear() - 100}:${new Date().getFullYear() + 100}`;
  pipe = new DatePipe('en-US');
  constructor(
    private router: Router,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private branchService: BranchService,
    private fb: FormBuilder,
    private insuranceService: InsuranceService,
    private indicator: IndicatorService,
    private util: UtilService
  ) {
    super();

  }

  ngOnInit(): void {
    this.indicator.showActivityIndicator();
    this.formFilter = this.fb.group({
      searchValue: [''],
      status: [{code: null}],
      branch: [{code: null}]
    });
    this.exportForm = this.fb.group({
      branchCode: [null],
      fromDate: [new Date(), [Validators.required]],
      toDate: [new Date(), [Validators.required]]
    });
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.all, code: null },
        { label: 'Xóa', code: 0 },
        { label: 'Nháp', code: 1 },
        { label: 'Đang lấy phí', code: 2 },
        { label: 'Chưa gửi thông tin', code: 3 },
        { label: 'Chưa thanh toán', code: 4 },
        { label: 'Đang tao giấy chứng nhận', code: 5 },
        { label: 'Hoàn thành', code: 6 }
      ];
      this.branchService.postBranchListOfUser().subscribe(branchList => {
        this.branchList = branchList;
        this.branchList.unshift({name: res.all, code: null});
      });
    });


  }

  doFilter() {
    this.paging.changePage(0);
  }

  hasErrorFilter(searchValue: string, pattern: string) {

  }
  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.exportForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }
  lazyLoadUser(evt) {

  }

  gotoCreate() {
    this.router.navigate(['notification', 'create']);
  }

  gotoView(id) {
    this.router.navigate(['insurance', 'insurance', 'view', id]);
  }

  gotoUpdate(id) {
    this.router.navigate(['insurance', 'insurance', 'update', id]);
  }

  doDelete(notification: any) {

  }

  changePage(evt) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.getListInsurance();
  }

  doExport() {
    if (this.exportForm.invalid) {
      this.util.validateAllFields(this.exportForm);
    }
    const body = this.exportForm.value;
    body.fromDate = this.pipe.transform(body.fromDate, 'dd/MM/yyyy');
    body.toDate = this.pipe.transform(body.toDate, 'dd/MM/yyyy');
    this.indicator.showActivityIndicator();

    this.insuranceService.export(body).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      const myBlob: Blob = new Blob([res], { type: 'application/ms-excel' });
      saveAs(myBlob, 'insurance_export.xlsx');
    });
  }

  lazyLoadInsurance($event: any) {

  }


  private getListInsurance() {
    this.indicator.showActivityIndicator();
    const body = {
      customerName: this.formFilter.get('searchValue').value,
      status: this.formFilter.get('status').value.code,
      branchCode: this.formFilter.get('branch').value.code,
      page: this.page,
      pageSize: this.pageSize
    };
    this.insuranceService.getListInsurance(body)
      .pipe(finalize(() => this.indicator.hideActivityIndicator()))
      .subscribe(res => {

      this.insuranceList = res.listInsurance;
      this.totalItems = res.totalRecords;
      this.insuranceList.forEach(e => e.maxShowBranch = this.initMaxShow);
    });
  }

  ngAfterViewInit(): void {
    this.getListInsurance();
  }
}
