import { Injectable } from '@angular/core';
import {DepartmentFilterRequest} from './model/department';
import {BaseService} from '../../../core/service/base.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ApiResultResponse} from '../../../core/model/result-response';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends BaseService {

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
    return 'DepartmentService';
  }

  createDepartment(body: any): Observable<ApiResultResponse> {
    return this.doPost('/admin/department/create', body);
  }

  updateDepartment(body: any): Observable<ApiResultResponse> {
    return this.doPost('/admin/department/update', body);
  }

  filterDepartment(brandRequestSearch: DepartmentFilterRequest) {
    return this.doPost('admin/department/filter', brandRequestSearch).pipe(
        map(res => res.data ? res.data[0] : [])
    );
  }

  deleteDepartment(id): Observable<ApiResultResponse> {
    return this.doPost('/admin/department/delete', id);
  }
}
