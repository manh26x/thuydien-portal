import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {NotificationConst} from "../notification";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {concatMap, startWith, takeUntil} from "rxjs/operators";
import {NewsEnum} from "../../news/model/news.enum";
import {TagsService} from "../../tags/service/tags.service";
import {FormBuilder} from "@angular/forms";
import {NotificationService} from "../service/notification.service";

@Component({
  selector: 'aw-notification-data',
  templateUrl: './notification-data.component.html',
  styles: [
  ]
})
export class NotificationDataComponent extends BaseComponent implements OnInit {
  formFilter: any;
  statusList: any;
  isHasEdit = true;
  isHasDel = true;
  notificationConst = NotificationConst;
  pageSize = 10;
  totalItem = 12;
  tagsList = [];
  notificationList = [
    {id: 1, title: 'Thông báo số 1', status: '1', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 2', status: '0', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 3', status: '1', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 4', status: '2', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 5', status: '2', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 6', status: '0', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 7', status: '1', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 8', status: '1', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 9', status: '1', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 10', status: '1', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 11', status: '1', time: new Date(), tags: 'kpi'},
    {id: 1, title: 'Thông báo số 12', status: '1', time: new Date(), tags: 'kpi'},

  ];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private tagService: TagsService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationService.setPage('');
    this.formFilter = this.fb.group({
      searchValue: [''],
      status: [null],
      tags: [null]
    });
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.all, code: null },
        { label: res.sent, code: NotificationConst.SENT },
        { label: res.nosend, code: NotificationConst.WAIT_SEND },
        { label: res.inactive, code:  NotificationConst.INACTIVE },
      ];
      this.tagService.getAllTagNews().subscribe(tagsList => {
        this.tagsList = tagsList;
        this.tagsList.unshift({id: null, value: res.all});
      });
    });


  }

  doFilter() {

  }

  hasErrorFilter(searchValue: string, pattern: string) {

  }

  lazyLoadUser($event: any) {

  }

  gotoCreate() {
    this.router.navigate(['notification', 'create']);
  }

  gotoView(id) {
    this.router.navigate(['notification', 'view', id]);
  }

  gotoUpdate(id) {
    this.router.navigate(['notification', 'update', id]);
  }

  doDelete(notification: any) {

  }

  changePage($event: any) {

  }
}
