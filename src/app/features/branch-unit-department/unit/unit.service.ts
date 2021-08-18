import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiResultResponse} from '../../../core/model/result-response';

import {map} from 'rxjs/operators';
import {UnitFilterRequest} from './model/unit';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends BaseService {

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
    return 'UnitService';
  }

  createUnit(body: any): Observable<ApiResultResponse> {
    return this.doPost('/admin/unit/create', body);
  }

  updateUnit(body: any): Observable<ApiResultResponse> {
    return this.doPost('/admin/unit/update', body);
  }

  filterUnit(brandRequestSearch: UnitFilterRequest) {
    return this.doPost('/admin/unit/filter', brandRequestSearch).pipe(
        map(res => res.data ? res.data[0] : [])
    );
  }

  deleteUnit(id): Observable<ApiResultResponse> {
    return this.doPost('/admin/unit/delete', id);
  }
}
