import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NewsService} from '../service/news.service';
import {FilterNewsRequest, News} from '../model/news';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {concatMap, delay, finalize, startWith} from 'rxjs/operators';
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

@Component({
  selector: 'aw-news-data',
  templateUrl: './news-data.component.html',
  styles: [
  ],
  providers: [TagsService]
})
export class NewsDataComponent extends BaseComponent implements OnInit {
  // filter
  statusList: SelectItem[] = [];
  tagsList: TagsUser[] = [];
  levelList = [];
  formFilter: FormGroup;
  // data
  newsList: News[] = [];
  newsConst = NewsEnum;
  page = 0;
  pageSize = 10;
  sortBy = 'id';
  sortOrder = 'DESC';
  totalItem = 0;
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
    private messageService: MessageService
  ) {
    super();
    this.initFormFilter();
  }

  ngOnInit(): void {
    this.newsService.setPage('');
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('const').pipe(
        res => res
      ))
    ).subscribe(res => {
      this.statusList = [
        { label: res.all, value: -1 },
        { label: res.active, value: NewsEnum.STATUS_ACTIVE },
        { label: res.inactive, value: NewsEnum.STATUS_INACTIVE }
      ];
      this.levelList = [
        { label: res.all, value: '' },
        { label: res.levelNormal, value: NewsEnum.LEVEL_NORMAL },
        { label: res.levelImportant, value: NewsEnum.LEVEL_IMPORTANT},
        { label: res.levelVeryImportant, value: NewsEnum.LEVEL_VERY_IMPORTANT}
      ];
    });

    this.tagService.getAllTag().subscribe(res => {
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
    console.log(news);
  }

  lazyLoadTags(evt: LazyLoadEvent) {
    this.page = evt.first === 0 ? 0 : evt.first / evt.rows;
    this.pageSize = evt.rows;
    this.sortBy = evt.sortField;
    this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
    this.getListNews();
  }

  getListNews() {
    const filterValue = this.formFilter.value;
    const tagSearch: number[] = [];
    if (this.util.canForEach(filterValue.tags)) {
      filterValue.tags.forEach(x => {
        tagSearch.push(x.tagId);
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
    this.newsService.filterNews(body).pipe(
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

}
