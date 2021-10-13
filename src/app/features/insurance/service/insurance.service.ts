import { Injectable } from '@angular/core';
import {BaseService} from "../../../core/service/base.service";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class InsuranceService extends BaseService {
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
    return 'InsuranceService';
  }

  setPage(page: '' | 'viewInsurance' | 'updateInsurance' | 'createCarBrand' | 'updateCarBrand' | 'createCarModal' | 'updateCarModal') {
    this.currentPage.next(page);
  }
}
