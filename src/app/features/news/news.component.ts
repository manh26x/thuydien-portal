import {AfterViewInit, Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {concatMap, delay, map, startWith, switchMap} from 'rxjs/operators';
import {AppTranslateService} from '../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {NewsService} from './service/news.service';
import {UtilService} from '../../core/service/util.service';

@Component({
  selector: 'aw-news',
  templateUrl: './news.component.html',
  styleUrls: []
})

export class NewsComponent implements AfterViewInit {
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};

  constructor(
    private appTranslate: AppTranslateService,
    private translate: TranslateService,
    private newsService: NewsService,
    private util: UtilService
  ) {
  }

  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb').pipe(
        res => res
      )),
      switchMap((resLang) => this.newsService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/news' },
          { label: res.lang[res.page] }
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/news' }];
      }
    });
  }
}
