import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterUserRequest, UserDetail, UserBranch, UpdateUserRequest, UserInfo} from '../model/user';
import {map} from 'rxjs/operators';
import {ApiResultResponse} from '../../../core/model/result-response';

@Injectable()
export class UserService extends BaseService{
  currentPage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {
    super();
  }

  getUserInfo(userId: string): Observable<UserDetail> {
    const param = new HttpParams().append('userId', userId);
    return this.doGet('/admin/userPortal/detail', param).pipe(
      map(res => res.data[0])
    );
  }

  filterUser(request: FilterUserRequest): Observable<UserBranch[]> {
    request.userType = '';
    return this.doPost('/admin/userPortal/filter', request).pipe(
      map(res => res.data || [])
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

  insertUser(request: UserDetail): Observable<any> {
    return this.doPost('/admin/userPortal/update', request).pipe(
      map(res => res)
    );
  }

  updateUser(request: UpdateUserRequest): Observable<ApiResultResponse> {
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
