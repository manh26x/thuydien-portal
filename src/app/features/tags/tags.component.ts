import {AfterViewInit, Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AppTranslateService} from '../../core/service/translate.service';
import {concatMap, delay, map, startWith, switchMap} from 'rxjs/operators';
import {TagsService} from './service/tags.service';
import {UtilService} from '../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'aw-tags',
  templateUrl: './tags.component.html',
  styleUrls: []
})

export class TagsComponent implements AfterViewInit {
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};
  constructor(
    private appTranslate: AppTranslateService,
    private tagsService: TagsService,
    private util: UtilService,
    private translate: TranslateService
  ) {}

  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb').pipe(
        res => res
      )),
      switchMap((resLang) => this.tagsService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/tags' },
          {label: res.lang[res.page]}
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/tags' }];
      }
    });
  }
}
