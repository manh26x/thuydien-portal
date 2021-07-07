import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {BranchFilterRequest} from './model/branch';
import {ApiResultResponse} from '../../../core/model/result-response';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseService{

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
    return 'BranchService';
  }

  filterBranch(request : BranchFilterRequest) {
    return this.doPost('/admin/branch/filter', request).pipe(
      map(res => res.data[0])
    )
  }

  createBranch(body: any): Observable<ApiResultResponse> {
    return this.doPost('admin/branch/create', body);
  }

  updateBranch(body: any): Observable<ApiResultResponse>  {
    return this.doPost('admin/branch/update', body);
  }
  deleteBranch(body: any): Observable<ApiResultResponse> {
    return this.doPost('admin/branch/delete', body);
  }
}
