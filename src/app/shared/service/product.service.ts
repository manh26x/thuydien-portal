import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BaseService} from '../../core/service/base.service';
import {Observable} from 'rxjs';
import {Product} from '../model/product';

@Injectable()
export class ProductService extends BaseService{
  constructor(private http: HttpClient) {
    super();
  }
  getHttp(): HttpClient {
    return this.http;
  }

  getGroupProduct(): Observable<Product[]> {
    return this.doGet('/saleskit/product/group').pipe(
      map(res => res.data)
    );
  }

  getServiceName(): string {
    return 'ProductService';
  }

}
