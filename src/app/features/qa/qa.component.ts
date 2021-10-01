import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../core/base.component";
import {AppTranslateService} from "../../core/service/translate.service";
import {concatMap, delay, map, startWith, switchMap, takeUntil} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {UtilService} from "../../core/service/util.service";
import {QaService} from "./service/qa.service";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'aw-qa',
  templateUrl: './qa.component.html',
  styles: [
  ]
})
export class QaComponent extends BaseComponent implements AfterViewInit  {
  items: MenuItem[];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/'};


  constructor(
    private appTranslate: AppTranslateService,
    private translate: TranslateService,
    private util: UtilService,
    private qaService: QaService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('breadcrumb')),
      switchMap((resLang) => this.qaService.currentPage$.pipe(
        delay(100),
        map(resPage => {
          return {lang: resLang, page: resPage};
        })
      ))
    ).subscribe(res => {
      if (!this.util.isNullOrEmpty(res.page)) {
        this.items = [
          { label: res.lang.home, routerLink: '/qa' },
          { label: res.lang[res.page] }
        ];
      } else {
        this.items = [{ label: res.lang.home, routerLink: '/qa' }];
      }
    });
  }
}
