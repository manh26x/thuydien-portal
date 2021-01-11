import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterUserRequest, UserData, UserInfo, PreviewUser, FilterUserResponse, UserDetail} from '../model/user';
import {map} from 'rxjs/operators';
import {ApiResultResponse} from '../../../core/model/result-response';

@Injectable()
export class UserService extends BaseService{
  currentPage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {
    super();
  }

  batchInsert(data: PreviewUser[]): Observable<ApiResultResponse> {
    return this.doPost('/admin/userPortal/addList', data);
  }

  readImportFile(file: FormData): Observable<PreviewUser[]> {
    return this.doPost('/admin/userPortal/readUserWithExcel', file).pipe(
      map(res => res.data || [])
    );
  }

  getUserInfo(userId: string): Observable<UserDetail> {
    const param = new HttpParams().append('userId', userId);
    return this.doGet('/admin/userPortal/detail', param).pipe(
      map(res => res.data[0])
    );
  }

  filterUser(request: FilterUserRequest): Observable<FilterUserResponse> {
    request.userType = '';
    return this.doPost('/admin/userPortal/filter', request).pipe(
      map(res => res.data[0] || {})
    );
  }

  getUserByUsername(username: string): Observable<string[]> {
    const pr: HttpParams = new HttpParams().append('keyword', username);
    return this.doGet('/admin/userPortal/search', pr ).pipe(
      map((res) => res.data || [])
    );
  }

  getAllUser(): Observable<UserInfo[]> {
    return this.doGet('/admin/userPortal/listAll').pipe(
      map(res => res.data || [])
    );
  }

  insertUser(request: UserData): Observable<any> {
    return this.doPost('/admin/userPortal/add', request).pipe(
      map(res => res)
    );
  }

  updateUser(request: UserData): Observable<ApiResultResponse> {
    return this.doPost('/admin/userPortal/update', request);
  }

  deleteUser(userId: string): Observable<ApiResultResponse> {
    const param = new HttpParams().append('userId', userId);
    return this.doGet('/admin/userPortal/delete', param);
  }

  setPage(page: '' | 'create' | 'update' | 'view') {
    this.currentPage$.next(page);
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'UserService';
  }
}
