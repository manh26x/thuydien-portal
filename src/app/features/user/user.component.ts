import {AfterViewInit, Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {UtilService} from '../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../core/service/translate.service';
import {UserService} from './service/user.service';
import {concatMap, delay, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../core/base.component';

@Component({
  selector: 'aw-user',
  templateUrl: './user.component.html',
  styleUrls: []
})

export class UserComponent extends BaseComponent implements AfterViewInit {
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};
  constructor(
    private util: UtilService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private userService: UserService
  ) {
    super();
  }
  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb')),
      switchMap((resLang) => this.userService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/user' },
          {label: res.lang[res.page]}
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/user' }];
      }
    });
  }
}
