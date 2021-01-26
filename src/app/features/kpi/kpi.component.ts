import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../core/base.component';
import {MenuItem} from 'primeng/api';
import {AppTranslateService} from '../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {UtilService} from '../../core/service/util.service';
import {KpiService} from './service/kpi.service';
import {concatMap, delay, map, startWith, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'aw-kpi',
  templateUrl: './kpi.component.html'
})

export class KpiComponent extends BaseComponent implements OnInit, AfterViewInit {
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};
  constructor(
    private appTranslate: AppTranslateService,
    private translate: TranslateService,
    private kpiService: KpiService,
    private util: UtilService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb')),
      switchMap((resLang) => this.kpiService.currentPage$.pipe(
        delay(100),
        map(resBrc => {
          return {lang: resLang, brc: resBrc};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.brc.main)) {
        this.items = [
          { label: res.lang[res.brc.main], routerLink: '/management-kpi/report' },
          { label: res.lang[res.brc.page] }
        ];
      } else {
        this.items = [{ label: res.lang.kpi, routerLink: '/management-kpi/report' }];
      }
    });
  }
}
