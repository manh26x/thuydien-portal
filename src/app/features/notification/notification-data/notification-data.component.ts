import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../core/base.component';
import {NotificationConst} from '../notification';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, startWith, takeUntil} from 'rxjs/operators';
import {TagsService} from '../../tags/service/tags.service';
import {FormBuilder} from '@angular/forms';
import {NotificationService} from '../service/notification.service';
import {Paginator} from 'primeng/paginator';
import {PageChangeEvent} from '../../../shared/model/page-change-event';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {UtilService} from '../../../core/service/util.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {AuthService} from '../../../auth/auth.service';
import {ApiErrorResponse} from '../../../core/model/error-response';

@Component({
  selector: 'aw-notification-data',
  templateUrl: './notification-data.component.html',
  styles: [
  ]
})
export class NotificationDataComponent extends BaseComponent implements OnInit {
  formFilter: any;
  @ViewChild('paging') paging: Paginator;
  statusList: any;
  isHasEdit = true;
  isHasDel = true;
  notificationConst = NotificationConst;
  pageSize = 10;
  totalItem = 0;
  tagsList = [];
  notificationList = [];
  sortBy: any;
  sortOrder: string;
  page = 0;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private tagService: TagsService,
    private fb: FormBuilder,
    private indicator: IndicatorService,
    private util: UtilService,
    private dialog: ConfirmationService,
    private messageService: MessageService,
    private auth: AuthService,
    private notificationService: NotificationService

  ) {
    super();
  }

  ngOnInit(): void {
    this.indicator.showActivityIndicator();
    this.notificationService.setPage('');
    this.formFilter = this.fb.group({
      searchValue: [''],
      status: [{code: null}],
      tags: [{id: null}]
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
      this.indicator.hideActivityIndicator();
    });


  }

  doFilter() {
    this.paging.changePage(0);
  }

  hasErrorFilter(searchValue: string, pattern: string) {

  }

  lazyLoadUser(evt) {
    this.sortBy = evt.sortField;
    this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
    this.getListNotifications();
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

  doDelete(notification) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: this.translate.instant('confirm.deleteMessage', { name: notification.title }),
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.notificationService.deleteNotifcation(notification.id.toString()).pipe(
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.deleteSuccess')
          });
          this.getListNotifications();
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('message.deleteNotFound')
            });
          } else {
            throw err;
          }
        });
      },
      reject: () => {}
    });
  }

  changePage(evt: PageChangeEvent) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.getListNotifications();
  }

  private getListNotifications() {
    const filterValue = this.formFilter.value;
    const tagSearch: number[] = [];
    this.indicator.showActivityIndicator();
    const body = {
      keyword: filterValue.searchValue,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      status: filterValue.status.code,
      tagId: filterValue.tags.id
    };
    this.notificationService.filterNotification(body).subscribe(res => {
      res.listNoti.forEach(e => e.tagList = e.tagList.map(tag => tag.tagValue));
      this.notificationList = res.listNoti;
      this.totalItem = res.totalRecords;
    },
        () => this.indicator.hideActivityIndicator(),
        () => this.indicator.hideActivityIndicator());
  }
}
