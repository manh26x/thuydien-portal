import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterNewsRequest, NewsInfoRequest, NewsDetail, NewsPaging} from '../model/news';
import {map} from 'rxjs/operators';
import {ApiResultResponse} from '../../../core/model/result-response';

@Injectable()
export class NewsService extends BaseService{
  currentPage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {
    super();
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getNewsDetail(id): Observable<NewsDetail> {
    const param = new HttpParams().append('newsId', id);
    return this.doGet('/saleskit/news/detail', param).pipe(
      map(res => res.data[0])
    );
  }

  createNews(body: NewsInfoRequest): Observable<ApiResultResponse> {
    return this.doPost('/saleskit/news/insert', body);
  }

  updateNews(body: NewsInfoRequest): Observable<ApiResultResponse> {
    return this.doPost('/saleskit/news/update', body);
  }

  deleteNews(id: string): Observable<ApiResultResponse> {
    const param = new HttpParams().append('newsId', id);
    return this.doGet('/saleskit/news/delete', param);
  }

  filterNews(request: FilterNewsRequest): Observable<NewsPaging> {
    return this.doPost('/saleskit/news/filterPortal', request).pipe(
      map(res => res.data[0])
    );
  }

  uploadFile(file: FormData): Observable<string> {
    return this.doPost('/saleskit/news/uploadFile', file).pipe(
      map(res => res.data[0] || '')
    );
  }

  getServiceName(): string {
    return 'NewsService';
  }

  setPage(page: '' | 'create' | 'update' | 'view') {
    this.currentPage$.next(page);
  }
}
