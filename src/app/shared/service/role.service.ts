import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BaseService} from '../../core/service/base.service';
import {Observable} from 'rxjs';
import {Role} from '../model/role';

@Injectable()
export class RoleService extends BaseService{
  constructor(private http: HttpClient) {
    super();
  }
  getHttp(): HttpClient {
    return this.http;
  }

  searchRole(valueSearch: string): Observable<Role[]> {
    const param = new HttpParams().append('keySearch', valueSearch);
    return this.doGet('/admin/role/search', param).pipe(
      map(res => res.data)
    );
  }

  getServiceName(): string {
    return 'RoleService';
  }

}
