import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResultResponse } from '../model/result-response';
import {environment} from '../../../environments/environment';
import {timeout} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  private baseUrl = '';
  private basePath = '';

  constructor() {
    this.baseUrl = environment.baseUrl;
    this.basePath = environment.basePath;
  }

  abstract getHttp(): HttpClient;

  abstract getServiceName(): string;

  protected doGet(url: string, httpParams?: HttpParams, httpHeaders?: HttpHeaders): Observable<ApiResultResponse> {
    const requestUrl = `${this.baseUrl}${this.basePath}${url}`;
    return this.getHttp().get<ApiResultResponse>(requestUrl, { headers: httpHeaders, params: httpParams })
      .pipe(timeout(environment.clientTimeout));
  }

  protected doPost(url: string, body: any, httpParams?: HttpParams, httpHeaders?: HttpHeaders): Observable<ApiResultResponse> {
    const requestUrl = `${this.baseUrl}${this.basePath}${url}`;
    return this.getHttp().post<ApiResultResponse>(requestUrl, body || {}, {
      headers: httpHeaders,
      params: httpParams
    }).pipe(timeout(environment.clientTimeout));
  }

  protected postDataBlob(url: string, body: any, header?: HttpHeaders, inputParams?: HttpParams): Observable<any> {
    const requestUrl = `${this.baseUrl}${this.basePath}${url}`;
    return this.getHttp().post<any>(requestUrl, body, { headers: header, params: inputParams, responseType: 'blob' as 'json' })
      .pipe(timeout(environment.clientTimeout));
  }

  protected doDelete(url: string, httpParams?: HttpParams, httpHeaders?: HttpHeaders) {
    const requestUrl = `${this.baseUrl}${this.basePath}${url}`;
    return this.getHttp().delete<ApiResultResponse>(requestUrl, { headers: httpHeaders, params: httpParams })
      .pipe(timeout(environment.clientTimeout));
  }

  public logDebug(value: any) {
    if (!environment.production) {
      console.log(`${this.getServiceName()} [Debug]:`, value);
    }
  }
}
