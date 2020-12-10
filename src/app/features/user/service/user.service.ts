import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterUserRequest, UserDetail, UserBranch, UpdateUserRequest} from '../model/user';
import {map} from 'rxjs/operators';

@Injectable()
export class UserService extends BaseService{
  currentPage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {
    super();
  }

  getUserInfo(userId: string): Observable<UserDetail> {
    const param = new HttpParams().append('userPortalId', userId);
    return this.doGet('/admin/userPortal/detail', param).pipe(
      map(res => res.data[0])
    );
  }

  filterUser(request: FilterUserRequest): Observable<UserBranch[]> {
    return this.doPost('/admin/userPortal/filter', request).pipe(
      map(res => res.data)
    );
  }

  getAllUser(): Observable<UserBranch[]> {
    const request: FilterUserRequest = { status: -1, role: '', keyword: '' };
    return this.doPost('/admin/userPortal/filter', request).pipe(
      map(res => res.data)
    );
  }

  getBranchList(): Observable<any> {
    return this.doGet('/admin/branch/list').pipe(
      map(res => res.data)
    );
  }

  insertUser(request: UserDetail): Observable<any> {
    return this.doPost('/admin/userPortal/add', request).pipe(
      map(res => res.data)
    );
  }

  updateUser(request: UpdateUserRequest): Observable<any> {
    return this.doPost('/admin/userPortal/update', request).pipe(
      map(res => res.data)
    );
  }

  deleteUser(userId: string) {
    const param = new HttpParams().append('userId', userId);
    return this.doGet('/admin/userPortal/delete', param).pipe(
      map(res => res.data)
    );
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
