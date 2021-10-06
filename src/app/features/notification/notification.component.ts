import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../core/base.component';
import {MenuItem} from 'primeng/api';
import {UtilService} from '../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../core/service/translate.service';
import {concatMap, delay, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {NotificationService} from './service/notification.service';

@Component({
  selector: 'aw-notification',
  templateUrl: './notification.component.html',
  styles: [
  ]
})
export class NotificationComponent extends BaseComponent implements AfterViewInit {
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};
  constructor(
    private util: UtilService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private notiService: NotificationService
  ) {
    super();
  }
  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb')),
      switchMap((resLang) => this.notiService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/notification' },
          {label: res.lang[res.page]}
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/notification' }];
      }
    });
  }

}
