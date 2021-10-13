import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {FormBuilder} from "@angular/forms";
import {concatMap, startWith, takeUntil} from "rxjs/operators";
import {BaseComponent} from "../../../core/base.component";
import {BranchService} from "../../../shared/service/branch.service";

@Component({
  selector: 'aw-insurance-data',
  templateUrl: './insurance-data.component.html',
  styles: [
  ]
})
export class InsuranceDataComponent extends BaseComponent implements OnInit {

  formFilter: any;
  statusList: any;
  isHasEdit = true;
  isHasDel = true;
  pageSize = 10;
  branchList = [];
  insuranceList = [
    {id: 1, customerName: 'Mike'}
  ];
  totalItems = 12;
  page = 0;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private branchService: BranchService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.formFilter = this.fb.group({
      searchValue: [''],
      status: [null],
      tags: [null]
    });
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.all, code: null },
      ];
      this.branchService.postBranchListOfUser().subscribe(brandList => {
        this.branchList = brandList;
        this.branchList.unshift({name: res.all, code: null});
      });
    });


  }

  doFilter() {

  }

  hasErrorFilter(searchValue: string, pattern: string) {

  }

  lazyLoadUser($event: any) {

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

  changePage($event: any) {

  }

  doExport() {

  }

  lazyLoadInsurance($event: any) {

  }

  deleteInsurance(insurance: any) {

  }
}
