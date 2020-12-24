import { Injectable } from '@angular/core';
import {BaseService} from '../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Branch} from '../model/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getBranchList(): Observable<Branch[]> {
    return this.doGet('/admin/branch/list').pipe(
      map(res => res.data || [])
    );
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'BranchService';
  }
}
