import { Component, OnInit } from '@angular/core';
import {NewsService} from '../service/news.service';
import {concatMap, delay, finalize, map, takeUntil} from 'rxjs/operators';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from '../../../core/base.component';
import {NewsDetail} from '../model/news';
import {IndicatorService} from '../../../shared/indicator/indicator.service';

@Component({
  selector: 'aw-news-view',
  templateUrl: './news-view.component.html',
  styles: [
  ]
})
export class NewsViewComponent extends BaseComponent implements OnInit {
  initValue: NewsDetail;
  constructor(
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute,
    private indicator: IndicatorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.indicator.showActivityIndicator();
    this.newsService.setPage('view');
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap(id => this.newsService.getNewsDetail(id).pipe(
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

  doCancel() {
    this.router.navigate(['news']);
  }

}
