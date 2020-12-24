import { Component, OnInit } from '@angular/core';
import {NewsService} from '../service/news.service';
import {NewsDetail, NewsInfoRequest} from '../model/news';
import {ActivatedRoute, Router} from '@angular/router';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {concatMap, delay, finalize, map, takeUntil} from 'rxjs/operators';
import {ApiErrorForbidden, ApiErrorResponse} from '../../../core/model/error-response';
import {BaseComponent} from '../../../core/base.component';
import {Tags} from '../../tags/model/tags';
import {Role} from '../../../shared/model/role';
import {UtilService} from '../../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../../auth/auth.service';
import {UserAuth} from '../../../auth/model/user-auth';
import {forkJoin, Observable, of} from 'rxjs';

@Component({
  selector: 'aw-news-update',
  templateUrl: './news-update.component.html',
  styles: [
  ]
})
export class NewsUpdateComponent extends BaseComponent implements OnInit {
  initValue: NewsDetail;
  userLogged: UserAuth;
  constructor(
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService,
    private auth: AuthService
  ) {
    super();
    this.userLogged = this.auth.getUserInfo();
  }

  ngOnInit(): void {
    this.newsService.setPage('update');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap(id => this.newsService.getNewsDetail(id).pipe(
        delay(200),
        map(res => {
          if (!this.userLogged.isSupperAdmin && this.userLogged.userName !== res.newsDto.createBy) {
            throw new ApiErrorForbidden('', '');
          }
          return res;
        }),
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
    // 0: file docs 1: file image
    const listObs: Observable<string>[] = [];
    // file docs
    if (evt.isChangeDoc && this.util.canForEach(evt.fileDocList)) {
      const listFormData: FormData = new FormData();
      listFormData.append('file', evt.fileDocList[0], evt.fileDocList[0].name);
      listObs.push(this.newsService.uploadFile(listFormData));
    } else {
      listObs.push(of(evt.news.docs));
    }
    // file image
    if (evt.isChangeImage && evt.fileImageList && evt.fileImageList.length > 0) {
      const listFormData: FormData = new FormData();
      listFormData.append('file', evt.fileImageList[0], evt.fileImageList[0].name);
      listObs.push(this.newsService.uploadFile(listFormData));
    } else {
      listObs.push(of(evt.news.image));
    }

    const value = evt.news;
    const tagsInsert: Tags[] = [];
    if (this.util.canForEach(value.tags)) {
      value.tags.forEach(t => {
        tagsInsert.push({
          idTag: t.tagId
        });
      });
    }
    const branchInsert: Role[] = [];
    if (this.util.canForEach(value.branch)) {
      value.branch.forEach(g => {
        branchInsert.push({
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
      listBranch: branchInsert,
      priority: value.level,
      publishTime: value.publishDate,
      sendNotification: value.isSendNotification ? 1 : 0,
      isDraft: draft ? 1 : 0
    };
    this.indicator.showActivityIndicator();
    forkJoin(listObs).pipe(
      concatMap(fileInfo => {
        body.filePath = fileInfo[0];
        body.imgPath = fileInfo[1];
        return this.newsService.updateNews(body).pipe(
          finalize(() => this.indicator.hideActivityIndicator())
        );
      })
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.updateSuccess')
      });
      this.router.navigate(['news']);
    }, err => {
      this.indicator.hideActivityIndicator();
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
