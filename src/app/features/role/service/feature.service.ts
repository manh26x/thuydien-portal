import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FeatureMenu} from '../model/feature';
import {map} from 'rxjs/operators';

@Injectable()
export class FeatureService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getAllMenu(): Observable<FeatureMenu[]> {
    return this.doGet('/admin/menu/getAllMenuRight').pipe(
      map(res => res.data || [])
    );
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'FeatureService';
  }
}
