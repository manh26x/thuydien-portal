import { Injectable } from '@angular/core';
import {BaseService} from "../../../core/service/base.service";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {CarBrand, CarModel} from "../model/car-brand";
import {UserData} from "../../user/model/user";
import {ApiResultResponse} from "../../../core/model/result-response";

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

  carBrandFilter(body: any): Observable<any> {
    return this.doPost('/insurance/car/brand/filter', body).pipe(map(res => res.data[0] || []));
  }
  carBrandActive(): Observable<any> {
    return this.doPost('/insurance/car/brand/listActive', null).pipe(map(res => res.data || []));
  }
  carModalFilter(body: any): Observable<any> {
    return this.doPost('/insurance/car/model/filter', body).pipe(map(res => res.data[0] || []));
  }

  carBrandDetail(id: any): Observable<CarBrand> {
    const body = +id;
    return this.doPost('/insurance/car/brand/detail', body).pipe(map(res => res.data[0] || null));
  }

  carModelDetail(id: any): Observable<CarModel> {
    const body = +id;
    return this.doPost('/insurance/car/model/detail', body).pipe(map(res => res.data[0] || null));
  }

  updateCarBrand(request: any): Observable<ApiResultResponse> {
    return this.doPost('/insurance/car/brand/update', request);
  }

  updateCarModel(request: any): Observable<ApiResultResponse> {
    return this.doPost('/insurance/car/model/update', request);
  }

  createCarBrand(request: any): Observable<ApiResultResponse> {
    return this.doPost('/insurance/car/brand/create', request);
  }

  createCarModel(request: any): Observable<ApiResultResponse> {
    return this.doPost('/insurance/car/model/create', request);
  }

  deleteCarBrand(id: number): Observable<ApiResultResponse> {
    return this.doPost('/insurance/car/brand/delete', id);
  }
  deleteCarModel(id: number): Observable<ApiResultResponse> {
    return this.doPost('/insurance/car/model/delete', id);
  }
}
