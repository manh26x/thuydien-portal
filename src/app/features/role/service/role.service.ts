import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class RoleService extends BaseService{
  currentPage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(
    private http: HttpClient
  ) {
    super();
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'RoleManageService';
  }
}
