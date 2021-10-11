import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";
import {NewsDetail, NewsInfoRequest} from "../../news/model/news";
import {ApiResultResponse} from "../../../core/model/result-response";

@Injectable({
  providedIn: 'root'
})
export class QaService extends BaseService{

  private currentPage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentPage$: Observable<string>;

  constructor(private http: HttpClient) {
    super();
    this.currentPage$ = this.currentPage.asObservable();
  }

  getHttp(): HttpClient {
    return this.http;
  }

  setPage(page: '' | 'create' | 'update' | 'view') {
    this.currentPage.next(page);
  }

  getServiceName(): string {
    return 'QaService';
  }

  checkDataImport(file: FormData): Observable<any> {
    return this.doPost('/qna/readExcel', file).pipe(
      map(res => res.data ? res.data[0].listQnA : {})
    );
  }

  saveList(listQnA: any): Observable<any> {
    return this.doPost('/qna/insertList', {listQnA});
  }

  filterQa(filter: any): Observable<any> {
    return this.doPost('/qna/filter', filter).pipe(map(res => res.data ? res.data[0] : null ));
  }

  getQaDetail(id): Observable<any> {
    const body = +id;
    return this.doPost('/qna/detail', body).pipe(
      map(res => res.data[0])
    );
  }

  createQa(body: any): Observable<ApiResultResponse> {
    return this.doPost('/qna/insert', body);
  }

  updateQa(body: any): Observable<ApiResultResponse> {
    return this.doPost('/qna/update', body);
  }

}
