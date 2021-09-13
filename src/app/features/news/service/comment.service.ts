import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../core/service/base.service';
import {map} from 'rxjs/operators';
import {CommentDto, CommentRequest, CommentResponsePage} from '../model/comment';
import {ApiResult, ApiResultResponse} from '../../../core/model/result-response';

@Injectable()
export class CommentService extends BaseService{
  private currentPage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentPage$: Observable<string>;
  constructor(private http: HttpClient) {
    super();
    this.currentPage$ = this.currentPage.asObservable();
  }
  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'CommentService';
  }

  setPage(page: '' | 'create'| 'view') {
    this.currentPage.next(page);
  }

  getAllComment(request: CommentRequest): Observable<CommentResponsePage> {
    return this.doPost('/comment/get', request).pipe(
      map(res => res.data[0])
    );
  }

  postComment(comment: CommentDto): Observable<ApiResultResponse> {
    return this.doPost('/comment/insert', comment);
  }

  exportCommentFile(idNews: number): Observable<any> {
    return this.postDataBlob('/comment/export', idNews);
  }
  deleteCmt(id: string): Observable<ApiResultResponse> {
    // const param = new HttpParams().append('newsId', id);
    const body = +id;
    return this.doPost('/comment/delete', body);
  }

}
