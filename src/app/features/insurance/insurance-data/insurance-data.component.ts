import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {FormBuilder} from "@angular/forms";
import {concatMap, finalize, startWith, takeUntil} from "rxjs/operators";
import {BaseComponent} from "../../../core/base.component";
import {BranchService} from "../../../shared/service/branch.service";
import {InsuranceService} from "../service/insurance.service";
import {Paginator} from "primeng/paginator";
import {IndicatorService} from "../../../shared/indicator/indicator.service";

@Component({
  selector: 'aw-insurance-data',
  templateUrl: './insurance-data.component.html',
  styles: [
  ]
})
export class InsuranceDataComponent extends BaseComponent implements OnInit {
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

  constructor(
    private router: Router,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private branchService: BranchService,
    private fb: FormBuilder,
    private insuranceService: InsuranceService,
    private indicator: IndicatorService
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
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.all, code: null },
      ];
      this.branchService.postBranchListOfUser().subscribe(branchList => {
        this.branchList = branchList;
        this.branchList.unshift({name: res.all, code: null});
      });
      this.doFilter();
    });


  }

  doFilter() {
    this.paging.changePage(0);
  }

  hasErrorFilter(searchValue: string, pattern: string) {

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

  }

  lazyLoadInsurance($event: any) {

  }

  deleteInsurance(insurance: any) {

  }

  private getListInsurance() {
    const body = {
      customerName: this.formFilter.get('searchValue').value,
      status: this.formFilter.get('status').value.code,
      branchCode: this.formFilter.get('branch').value.code,
      page: this.page,
      pageSize: this.pageSize
    };
    this.indicator.showActivityIndicator();
    this.insuranceService.getListInsurance(body)
      .pipe(finalize(() => this.indicator.hideActivityIndicator()))
      .subscribe(res => {
      this.insuranceList = res.listInsurance;
      this.totalItems = res.totalRecords;
    });
  }
}
