import { Injectable } from '@angular/core';
import {BaseService} from "../../../core/service/base.service";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService{
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
    return 'NotificationService';
  }
  setPage(page: '' | 'create' | 'update' | 'view') {
    this.currentPage.next(page);
  }

  filterNotification(body): Observable<any> {
    return this.doPost('/admin-noti/manage/filter', body).pipe(
      map(res => res.data[0])
    );
  }
  detailNotification(id): Observable<any> {
    return this.doPost('/admin-noti/manage/detail', +id).pipe(
      map(res => res.data[0])
    );
  }

  deleteNotifcation(id): Observable<any> {
    return this.doPost('/admin-noti/manage/delete', +id).pipe(
      map(res => res.data || null)
    );
  }

  checkDataImport(file: FormData): Observable<any> {
    return this.doPost('/admin-noti/manage/readExcel', file).pipe(
      map(res => res.data ? res.data[0] : {})
    );
  }
}
