import { Injectable } from '@angular/core';
import {BaseService} from '../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Unit} from '../model/unit';
import {map} from 'rxjs/operators';

@Injectable()
export class UnitService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getAllUnit(): Observable<Unit[]> {
    return this.doGet('/admin/unit/list').pipe(
      map(res => res.data || [])
    );
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'UnitService';
  }
}
