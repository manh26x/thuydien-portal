import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../core/base.component';
import {LazyLoadEvent, MenuItem} from 'primeng/api';
import {concatMap, delay, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {AppTranslateService} from '../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {UtilService} from '../../core/service/util.service';
import {TrackingAppBehaviorService} from './tracking-app-behavior.service';
import {BranchService} from '../../shared/service/branch.service';
import {Branch} from '../../shared/model/branch';
import {IndicatorService} from '../../shared/indicator/indicator.service';
import {FormBuilder} from '@angular/forms';
import {TrackingOtherResponse} from './model/tracking-app-behavior';
import {PageChangeEvent} from '../../shared/model/page-change-event';
import {Paginator} from 'primeng/paginator';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'aw-tracking-app-behavior',
  templateUrl: './tracking-app-behavior.component.html',
  styles: [
  ]
})
export class TrackingAppBehaviorComponent extends BaseComponent implements OnInit {
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};
  branchList: Branch[];
  filterForm: any;
  otherTracking: TrackingOtherResponse;
  fb: FormBuilder  = new FormBuilder();
  pageSize = 10;
  totalItem: any;
  newsList: any;
  page = 0;
  pipe = new DatePipe('en-US');
  @ViewChild('newPaging') paging: Paginator;
  sortBy = 'countIndex';
  private sortOrder: string;

  constructor(private appTranslate: AppTranslateService,
              private translate: TranslateService,
              private trackingAppBehaviorService: TrackingAppBehaviorService,
              private branchService: BranchService,
              private indicator: IndicatorService,
              private util: UtilService) {
    super();
  }

  ngOnInit(): void {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb')),
      switchMap((resLang) => this.trackingAppBehaviorService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/action-management' },
          { label: res.lang[res.page] }
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/action-management' }];
      }
    });


    const now = new Date();
    const date = new Date(new Date().setDate(new Date().getDate() - 30));
    this.filterForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      branchCode: [null],
      rangesDate: [[date, now]],
      branch: [null],
      page: [0],
      pageSize: [10],
      sortBy: ['countIndex'],
      sortOrder: [null]
    });

    this.branchService.getBranchList().subscribe(res => {
      this.branchList = res;
      const branchSelected = {code: null, name: 'Tất cả'};
      this.branchList.push(branchSelected);
      this.branchList = this.branchList.reverse();
      this.filterForm.get('branch').setValue(branchSelected);
      this.filterTracking();
    });
  }


  changeBranch() {
    this.filterTracking();
    this.filterNews();
  }
  filterNews() {
    this.indicator.showActivityIndicator();
    const branchSelected = this.filterForm.get('branch').value.code;
    const rangeDate = this.filterForm.get('rangesDate').value;
    this.filterForm.get('branchCode').setValue(branchSelected);
    this.filterForm.get('fromDate').setValue(this.pipe.transform(rangeDate[0], 'dd/MM/yyyy'));
    this.filterForm.get('toDate').setValue(this.pipe.transform(rangeDate[1], 'dd/MM/yyyy'));
    this.filterForm.get('sortBy').setValue(this.sortBy);
    this.filterForm.get('sortOrder').setValue(this.sortOrder);
    this.filterForm.get('page').setValue(this.page);
    this.filterForm.get('pageSize').setValue(this.pageSize);
    this.trackingAppBehaviorService.getNewsBehavior(this.filterForm.value).subscribe(res => {
      this.newsList = res.listNews;
      this.totalItem = res.totalRecords;
      this.indicator.hideActivityIndicator();
    }, error => {
      this.indicator.hideActivityIndicator();
    });
  }

  filterTracking() {
    this.indicator.showActivityIndicator();
    let branchSelected = null;
    let rangeDate = null;
    try {
      rangeDate = this.filterForm.get('rangesDate').value;
      branchSelected = this.filterForm.get('branch').value.code;
    } catch (e) {
      this.filterForm.get('branch').setValue({code: null, name: 'Tất cả'});
    }

    this.filterForm.get('fromDate').setValue(this.pipe.transform(rangeDate[0], 'dd/MM/yyyy'));
    this.filterForm.get('toDate').setValue(this.pipe.transform(rangeDate[1], 'dd/MM/yyyy'));
    this.filterForm.get('branchCode').setValue(branchSelected);
    this.trackingAppBehaviorService.getOtherBehavior(this.filterForm.value).subscribe(res => {
      this.otherTracking = res;
      this.indicator.hideActivityIndicator();
    }, error => {
      this.indicator.hideActivityIndicator();
    });
  }
  lazyLoadBranch( evt: LazyLoadEvent) {
    this.sortBy = 'countIndex';
    this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
    this.filterNews();
  }
  changePage(evt: PageChangeEvent) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.filterNews();
  }
}
