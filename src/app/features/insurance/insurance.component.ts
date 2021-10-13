import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../core/base.component';
import {BranchComponent} from '../branch-unit-department/branch/branch.component';
import {TabView} from 'primeng/tabview';
import {BehaviorSubject} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {AppTranslateService} from '../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {BranchUnitDepartmentService} from '../branch-unit-department/service/branch-unit-department.service';
import {UtilService} from '../../core/service/util.service';
import {concatMap, delay, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {InsuranceService} from "./service/insurance.service";
import {InsuranceDataComponent} from "./insurance-data/insurance-data.component";

@Component({
  selector: 'aw-insurance',
  templateUrl: './insurance.component.html',
  styles: [
  ]
})
export class InsuranceComponent extends BaseComponent implements AfterViewInit {

  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};
  constructor(    private appTranslate: AppTranslateService,
                  private translate: TranslateService,
                  private insuranceService: InsuranceService,
                  private util: UtilService) {
    super();
  }

  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb')),
      switchMap((resLang) => this.insuranceService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/insurance' },
          { label: res.lang[res.page] }
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/insurance' }];
      }
    });

  }
}
