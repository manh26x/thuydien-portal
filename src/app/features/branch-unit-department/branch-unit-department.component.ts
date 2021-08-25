import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {concatMap, delay, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {AppTranslateService} from '../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {BaseComponent} from '../../core/base.component';
import {UtilService} from '../../core/service/util.service';
import {BranchComponent} from './branch/branch.component';
import {TabView} from 'primeng/tabview';
import {BranchUnitDepartmentService} from './service/branch-unit-department.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'aw-branch-unit-department',
  templateUrl: './branch-unit-department.component.html',
  styles: [
  ]
})
export class BranchUnitDepartmentComponent extends BaseComponent implements AfterViewInit {
  @ViewChild(BranchComponent) branchComponent: BranchComponent;
  @ViewChild('tabView') tabView: TabView;
  tabEmitter$: BehaviorSubject<TabView>;
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};
  constructor(    private appTranslate: AppTranslateService,
                  private translate: TranslateService,
                  private branchUnitDepartmentService: BranchUnitDepartmentService,
                  private util: UtilService) {
    super();
  }

  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb')),
      switchMap((resLang) => this.branchUnitDepartmentService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/branch-unit-department' },
          { label: res.lang[res.page] }
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/branch-unit-department' }];
      }
    });
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      delay(500),
      takeUntil(this.nextOnDestroy)
    ).subscribe(_ => {
      this.tabView.cd.markForCheck();
    });
    setTimeout(() => {
      this.tabView.updateInkBar();
    }, 500);
    this.tabEmitter$ = new BehaviorSubject<TabView>(this.tabView);
  }

}
