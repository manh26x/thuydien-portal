import { Component, OnInit } from '@angular/core';
import {NewsService} from '../service/news.service';
import {NewsDetail, NewsInfoRequest} from '../model/news';
import {ActivatedRoute, Router} from '@angular/router';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {concatMap, delay, finalize, map, takeUntil} from 'rxjs/operators';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {BaseComponent} from '../../../core/base.component';
import {Tags} from '../../tags/model/tags';
import {Role} from '../../../shared/model/role';
import {UtilService} from '../../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'aw-news-update',
  templateUrl: './news-update.component.html',
  styles: [
  ]
})
export class NewsUpdateComponent extends BaseComponent implements OnInit {
  initValue: NewsDetail;
  constructor(
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.newsService.setPage('update');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap(id => this.newsService.getNewsDetail(id).pipe(
        delay(200),
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.initValue = res;
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '201') {
        this.router.navigate(['public', 'not-found']);
      } else {
        throw err;
      }
    });
  }

  doSave(evt, draft) {
    const value = evt.news;
    this.indicator.showActivityIndicator();
    const tagsInsert: Tags[] = [];
    if (this.util.canForEach(value.tags)) {
      value.tags.forEach(t => {
        tagsInsert.push({
          idTag: t.tagId
        });
      });
    }
    const roleInsert: Role[] = [];
    if (this.util.canForEach(value.groupView)) {
      value.groupView.forEach(g => {
        roleInsert.push({
          id: g.id
        });
      });
    }
    const body: NewsInfoRequest = {
      id: value.id,
      title: value.title,
      shortContent: value.shortContent,
      content: value.content,
      filePath: '',
      imgPath: '',
      listNewsTag: tagsInsert,
      listRole: roleInsert,
      priority: value.level,
      publishTime: value.publishDate,
      sendNotification: value.isSendNotification ? 1 : 0,
      isDraft: draft ? 1: 0
    };
    this.newsService.updateNews(body).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.updateSuccess')
      });
      this.router.navigate(['news']);
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '201') {
        this.messageService.add({
          severity: 'error',
          detail: draft ? this.translate.instant('message.draftSuccess') : this.translate.instant('message.updateNotFound')
        });
      } else {
        throw err;
      }
    });
  }

  doCancel() {
    this.router.navigate(['news']);
  }

}
