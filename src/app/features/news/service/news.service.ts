import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterNewsRequest, NewsInfoRequest, News, NewsDetail, NewsPaging} from '../model/news';
import {map} from 'rxjs/operators';

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

  createNews(body: NewsInfoRequest): Observable<any> {
    return this.doPost('/saleskit/news/insert', body).pipe(
      map(res => res.data)
    );
  }

  updateNews(body: NewsInfoRequest): Observable<any> {
    return this.doPost('/saleskit/news/update', body).pipe(
      map(res => res.data)
    );
  }

  deleteNews(id: string): Observable<any> {
    const param = new HttpParams().append('newsId', id);
    return this.doGet('/saleskit/news/delete', param).pipe(
      map(res => res.data)
    );
  }

  filterNews(request: FilterNewsRequest): Observable<NewsPaging> {
    return this.doPost('/saleskit/news/filterPortal', request).pipe(
      map(res => res.data[0])
    );
  }

  uploadFile(file: FormData) {
    return this.doPost('/saleskit/news/uploadFile', file).pipe(
      map(res => res.data)
    );
  }

  getServiceName(): string {
    return 'NewsService';
  }

  setPage(page: '' | 'create' | 'update' | 'view') {
    this.currentPage$.next(page);
  }
}
