import {AfterViewInit, Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AppTranslateService} from '../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {UtilService} from '../../core/service/util.service';
import {RoleService} from './service/role.service';
import {concatMap, delay, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'aw-role',
  templateUrl: './role.component.html'
})

export class RoleComponent implements AfterViewInit {
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};
  constructor(
    private appTranslate: AppTranslateService,
    private translate: TranslateService,
    private roleManageService: RoleService,
    private util: UtilService
  ) {
  }

  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb').pipe(
        res => res
      )),
      switchMap((resLang) => this.roleManageService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/role' },
          { label: res.lang[res.page] }
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/role' }];
      }
    });
  }
}
