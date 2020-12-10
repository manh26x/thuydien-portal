import {AfterViewInit, Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {UtilService} from '../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../core/service/translate.service';
import {UserService} from './service/user.service';
import {concatMap, delay, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'aw-tags',
  templateUrl: './user.component.html',
  styleUrls: []
})

export class UserComponent implements AfterViewInit {
  items: MenuItem[];
  home: MenuItem;
  constructor(
    private util: UtilService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private userService: UserService
  ) {
  }
  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb').pipe(
        res => res
      )),
      switchMap((resLang) => this.userService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      this.home = { label: res.lang.home, routerLink: '/user' };
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [{label: res.lang[res.page]}];
      } else {
        this.items = [];
      }
    });
  }
}
