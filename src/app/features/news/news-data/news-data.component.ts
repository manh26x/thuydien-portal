import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NewsService} from '../service/news.service';
import {FilterNewsRequest, News, NewsDetail} from '../model/news';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {concatMap, finalize, map, startWith, takeUntil} from 'rxjs/operators';
import {NewsEnum} from '../model/news.enum';
import {ConfirmationService, LazyLoadEvent, MessageService, SelectItem} from 'primeng/api';
import {TagsUser} from '../../tags/model/tags';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {TagsService} from '../../tags/service/tags.service';
import {BaseComponent} from '../../../core/base.component';
import {UtilService} from '../../../core/service/util.service';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {PageChangeEvent} from '../../../shared/model/page-change-event';
import {AuthService} from '../../../auth/auth.service';
import {FeatureEnum} from '../../../shared/model/feature.enum';
import {RoleEnum} from '../../../shared/model/role';
import {Paginator} from 'primeng/paginator';

@Component({
  selector: 'aw-news-data',
  templateUrl: './news-data.component.html'
})
export class NewsDataComponent extends BaseComponent implements OnInit {
  @ViewChild('newPaging') paging: Paginator;
  // filter
  @Input() isApprove;
  statusList: SelectItem[] = [];
  tagsList: TagsUser[] = [];
  levelList = [];
  formFilter: FormGroup;
  // data
  newsList: News[] = [];
  newsConst = NewsEnum;
  page = 0;
  pageSize = 10;
  sortBy = 'pubDate';
  sortOrder = 'DESC';
  totalItem = 0;
  initMaxShow = 2;
  isHasInsert = false;
  isHasEdit = false;
  isHasDel = false;
  selectedNews = [];
  choosen = false;
  @ViewChild('checkAll')checkAll: any;
  constructor(
    private router: Router,
    private newsService: NewsService,
    private indicator: IndicatorService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private tagService: TagsService,
    private fb: FormBuilder,
    private util: UtilService,
    private dialog: ConfirmationService,
    private messageService: MessageService,
    private auth: AuthService
  ) {
    super();
    this.initFormFilter();
    this.isHasInsert = this.auth.isHasRole(FeatureEnum.NEWS, RoleEnum.ACTION_INSERT);
    this.isHasEdit = this.auth.isHasRole(FeatureEnum.NEWS, RoleEnum.ACTION_EDIT);
    this.isHasDel = this.auth.isHasRole(FeatureEnum.NEWS, RoleEnum.ACTION_DELETE);
  }

  ngOnInit(): void {
    this.newsService.setPage('');
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.all, value: -1 },
        { label: res.publish, value: NewsEnum.STATUS_PUBLISHED },
        { label: res.pending, value: NewsEnum.STATUS_PENDING_PUBLISH },
        { label: res.draft, value: NewsEnum.STATUS_DRAFT },
        { label: res.delete, value: NewsEnum.STATUS_DELETED }
      ];
      this.levelList = [
        { label: res.all, value: '' },
        { label: res.levelNormal, value: NewsEnum.LEVEL_NORMAL },
        { label: res.levelImportant, value: NewsEnum.LEVEL_IMPORTANT},
        { label: res.levelVeryImportant, value: NewsEnum.LEVEL_VERY_IMPORTANT}
      ];
    });

    this.tagService.getAllTagNews().subscribe(res => {
      this.tagsList = res;
    });
  }

  gotoView(id) {
    this.router.navigate(['news', 'view', id]);
  }

  gotoUpdate(id) {
    this.router.navigate(['news', 'update', id]);
  }

  doDelete(news: News) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: this.translate.instant('confirm.deleteMessage', { name: news.title }),
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.newsService.deleteNews(news.id.toString()).pipe(
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.deleteSuccess')
          });
          this.getListNews();
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
    this.getListNews();
  }

  lazyLoadNews(evt: LazyLoadEvent) {
      this.sortBy = evt.sortField;
      this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
      this.getListNews();
  }

  doFilter() {
    this.paging.changePage(0);
  }

  getListNews() {
    const filterValue = this.formFilter.value;
    const tagSearch: number[] = [];
    if (this.util.canForEach(filterValue.tags)) {
      filterValue.tags.forEach(x => {
        tagSearch.push(x.id);
      });
    }
    this.indicator.showActivityIndicator();
    const body: FilterNewsRequest = {
      keyword: filterValue.searchValue,
      page: this.page,
      pageSize: this.pageSize,
      priorityRole: filterValue.level,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      status: filterValue.status,
      tagValue: tagSearch
    };
    this.newsService.filterNews(body, this.isApprove).pipe(
      map(res => {
        if (this.util.canForEach(res.listNews)) {
          res.listNews.forEach(item => {
            item.maxShowTag = this.initMaxShow;
          });
        }
        return res;
      }),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.newsList = res.listNews;
      this.totalItem = res.totalRecord;
    });
  }

  refreshSearch() {
    this.initFormFilter();
    this.getListNews();
  }

  gotoCreate() {
    this.router.navigate(['news', 'create']);
  }

  initFormFilter() {
    this.formFilter = this.fb.group({
      searchValue: [''],
      tags: [],
      status: [-1],
      level: []
    });
  }

  checkAllRows() {
    if (this.checkAll.checked) {
      this.selectedNews = [];

    } else {
      this.selectedNews = this.newsList;
    }

  }


  gotoApprove(status) {
    if (this.selectedNews.length === 0) {
      return;
    }
    const newsApprove = [];
    this.selectedNews.forEach(e => {
      newsApprove.push({newsId: e.id, approveStatus:  status});
    });
    let msgResult = '';
    let confirmMsg = '';
    if (status === this.newsConst.APPROVED) {
      msgResult = this.translate.instant('message.approveSuccess');
      confirmMsg = this.translate.instant('confirm.approvedMessage');
    } else if (status === this.newsConst.DISAPPROVED) {
      msgResult = this.translate.instant('message.cancelSuccess');
      confirmMsg = this.translate.instant('confirm.cancelMessage');
    }
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: confirmMsg,
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.newsService.approved(newsApprove).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: msgResult
          });
          this.getListNews();
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
}
