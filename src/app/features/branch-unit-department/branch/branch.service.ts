import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {BranchFilterRequest} from './model/branch';
import {ApiResultResponse} from '../../../core/model/result-response';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'BranchService';
  }

  filterBranch(request: BranchFilterRequest) {
    return this.doPost('/admin/branch/filter', request).pipe(
      map(res => res.data ? res.data[0] : [])
    );
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
