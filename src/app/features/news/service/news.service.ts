import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class NewsService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'NewsService';
  }

  test() {
    return this.doPost('/saleskit/product/filter', {
      fromDate: '',
      toDate: '',
      menuId: null,
      page: 0,
      pageSize: 8
    });
  }
}
