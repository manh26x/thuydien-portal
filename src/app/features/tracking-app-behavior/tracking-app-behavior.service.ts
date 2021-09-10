import { Injectable } from '@angular/core';
import {BaseService} from '../../core/service/base.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UserInfo} from '../user/model/user';
import {map} from 'rxjs/operators';
import {TrackingOtherResponse} from './model/tracking-app-behavior';

@Injectable({
  providedIn: 'root'
})
export class TrackingAppBehaviorService extends BaseService{
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
    return 'TrackingAppBehaviorService';
  }

  getOtherBehavior(body: any): Observable<TrackingOtherResponse> {
    return this.doPost('/tracking-behavior/behaviorIndex', body).pipe(
      map(res => res.data[0] || null)
    );
  }

  getNewsBehavior(body: any): Observable<any> {
    return this.doPost('/tracking-behavior/newsBehavior', body).pipe(
      map(res => res.data || [])
    );
  }

}

