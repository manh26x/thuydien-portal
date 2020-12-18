import {Component, HostListener, OnInit} from '@angular/core';
import {NewsService} from '../service/news.service';
import {NewsInfoRequest} from '../model/news';
import {UtilService} from '../../../core/service/util.service';
import {Tags} from '../../tags/model/tags';
import {Role} from '../../../shared/model/role';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {concatMap, finalize, map} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {BeforeLeave} from '../../../core/model/before-leave';
import {forkJoin, Observable, of} from 'rxjs';

@Component({
  selector: 'aw-news-create',
  templateUrl: './news-create.component.html',
  styles: [
  ]
})
export class NewsCreateComponent implements OnInit, BeforeLeave {
  isLeave = false;
  constructor(
    private newsService: NewsService,
    private util: UtilService,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newsService.setPage('create');
  }

  doSave(evt, draft: boolean) {
    // 0: file docs 1: file image
    const listObs: Observable<string>[] = [];
    // file docs
    if (this.util.canForEach(evt.fileDocList)) {
      const listFormData: FormData = new FormData();
      listFormData.append('file', evt.fileDocList[0], evt.fileDocList[0].name);
      listObs.push(this.newsService.uploadFile(listFormData).pipe(
        map(res => res.message.message)
      ));
    } else {
      listObs.push(of(''));
    }
    // file image
    if (evt.fileImageList && evt.fileImageList.length > 0) {
      const listFormData: FormData = new FormData();
      listFormData.append('file', evt.fileImageList[0], evt.fileImageList[0].name);
      listObs.push(this.newsService.uploadFile(listFormData).pipe(
        map(res => res.message.message)
      ));
    } else {
      listObs.push(of(''));
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
    const roleInsert: Role[] = [];
    if (this.util.canForEach(value.groupView)) {
      value.groupView.forEach(g => {
        roleInsert.push({
          id: g.id
        });
      });
    }
    const body: NewsInfoRequest = {
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
      isDraft: draft ? 1 : 0
    };
    this.indicator.showActivityIndicator();
    forkJoin(listObs).pipe(
      concatMap(fileInfo => {
        body.filePath = fileInfo[0];
        body.imgPath = fileInfo[1];
        return this.newsService.createNews(body).pipe(
          finalize(() => this.indicator.hideActivityIndicator())
        );
      })
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        detail: draft ? this.translate.instant('message.draftSuccess') : this.translate.instant('message.insertSuccess')
      });
      this.isLeave = true;
      this.router.navigate(['news']);
    });
  }

  doCancel() {
    this.router.navigate(['news']);
  }

  @HostListener('window:beforeunload')
  canLeave(): boolean {
    return this.isLeave;
  }

}
