import { Injectable } from '@angular/core';
import {BaseService} from '../../core/service/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {InsertRoleRequest, Role, RoleDetail} from '../model/role';
import {map} from 'rxjs/operators';
import {ApiResultResponse} from '../../core/model/result-response';
import {AbstractControl} from '@angular/forms';
import {UserAuthDetail} from '../../auth/model/user-auth';

@Injectable()
export class RoleService extends BaseService{
  currentPage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(
    private http: HttpClient
  ) {
    super();
  }

  insertRole(role: InsertRoleRequest): Observable<ApiResultResponse> {
    return this.doPost('/admin/role/insert', role);
  }

  updateRole(role: InsertRoleRequest): Observable<ApiResultResponse> {
    return this.doPost('/admin/role/update', role);
  }

  deleteRole(id: string): Observable<ApiResultResponse> {
//    const param: HttpParams = new HttpParams()
//      .append('deleteId', id);
    const body = id;
    return this.doPost('/admin/role/delete', body);
  }

  getRoleList(name: string, statusCode: string): Observable<Role[]> {
//    const param: HttpParams = new HttpParams()
//      .append('keySearch', name)
//      .append('status', status);
    const body = {keySearch: name, status: statusCode};
    return this.doPost('/admin/role/search', body).pipe(
      map(res => res.data || [])
    );
  }

  getRoleDetail(id: string): Observable<RoleDetail> {
//    const param: HttpParams = new HttpParams()
//      .append('roleId', id);
    const body = id;
    return this.doPost('/admin/role/detail', body).pipe(
      map(res => res.data[0])
    );
  }

  getUserRole(): Observable<UserAuthDetail> {
    return this.doGet('/admin/role/getRole').pipe(
      map(res => res.data[0] || {})
    );
  }

  getRoleActive(): Observable<Role[]> {
    return this.doPost('/admin/role/getActiveRole', null).pipe(
      map(res => res.data || [])
    );
  }

  clientMatcher(abstract: AbstractControl): { [key: string]: boolean } | null {
    const isPortal = abstract.get('isAdminPortal');
    const isMobile = abstract.get('isMobileApp');
    if (isPortal === null || isMobile === null) {
      return null;
    }
    if (isPortal.disabled || isMobile.disabled) {
      return null;
    }
    if (isPortal.value === false && isMobile.value === false) {
      isMobile.setErrors({ clientRequired: true });
      isPortal.setErrors({ clientRequired: true });
      return { match: true };
    }
    isMobile.setErrors(null);
    isPortal.setErrors(null);
    return null;
  }

  setPage(page: '' | 'create' | 'update' | 'view') {
    this.currentPage$.next(page);
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'RoleManageService';
  }
}
