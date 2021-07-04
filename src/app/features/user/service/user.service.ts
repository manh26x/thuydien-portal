import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterUserRequest, UserData, UserInfo, PreviewUser, FilterUserResponse, UserDetail} from '../model/user';
import {map} from 'rxjs/operators';
import {ApiResultResponse} from '../../../core/model/result-response';

@Injectable()
export class UserService extends BaseService{
  private currentPage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentPage$: Observable<string>;
  constructor(private http: HttpClient) {
    super();
    this.currentPage$ = this.currentPage.asObservable();
  }

  exportUser(request: FilterUserRequest): Observable<any> {
    return this.postDataBlob('/admin/userPortal/exportUserExcel', request);
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
    // const param = new HttpParams().append('userId', userId);
    const body = userId;
    return this.doPost('/admin/userPortal/detail', body).pipe(
      map(res => res.data[0])
    );
  }

  filterUser(request: FilterUserRequest): Observable<FilterUserResponse> {
    request.userType = '';
    return this.doPost('/admin/userPortal/filter', request).pipe(
      map(res => res.data ? res.data[0] : { listUser: [], totalRecord: 0 })
    );
  }

  getUserByUsername(username: string): Observable<string[]> {
    // const pr: HttpParams = new HttpParams().append('keyword', username);
    const body = username;
    return this.doPost('/admin/userPortal/search', body ).pipe(
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
    // const param = new HttpParams().append('userId', userId);
    const body = userId;
    return this.doPost('/admin/userPortal/delete', body);
  }

  setPage(page: '' | 'create' | 'update' | 'view') {
    this.currentPage.next(page);
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'UserService';
  }
}
