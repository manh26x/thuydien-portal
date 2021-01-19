import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AppTranslateService} from '../../core/service/translate.service';
import {UtilService} from '../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {concatMap, delay, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {CalculateToolService} from './service/calculate-tool.service';
import {BaseComponent} from '../../core/base.component';

@Component({
  selector: 'aw-calculate-tool',
  templateUrl: './calculate-tool.component.html'
})

export class CalculateToolComponent extends BaseComponent implements AfterViewInit {
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};
  constructor(
    private appTranslate: AppTranslateService,
    private util: UtilService,
    private translate: TranslateService,
    private toolService: CalculateToolService
  ) {
    super();
  }

  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb')),
      switchMap((resLang) => this.toolService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/calculate-tool' },
          { label: res.lang[res.page] }
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/calculate-tool' }];
      }
    });
  }
}
