import { Injectable } from '@angular/core';
import {BaseService} from '../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department} from '../model/department';
import {map} from 'rxjs/operators';

@Injectable()
export class DepartmentService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getAllDepartment(): Observable<Department[]> {
    return this.doGet('/admin/department/list').pipe(
      map((res) => res.data || [])
    );
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'DepartmentService';
  }
}
