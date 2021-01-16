import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {CalculateTool, SearchToolRequest} from '../model/calculate-tool';
import {map} from 'rxjs/operators';
import {ApiResultResponse} from '../../../core/model/result-response';

@Injectable()
export class CalculateToolService extends BaseService{
  currentPage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {
    super();
  }

  changeStatus(idTool: number, statusTool: number): Observable<ApiResultResponse> {
    const body = { id: idTool, status: statusTool };
    return this.doPost('/saleskit/tools/changeStatus', body);
  }

  getToolList(request: SearchToolRequest): Observable<CalculateTool[]> {
    return this.doPost('/saleskit/tools/portalList', request).pipe(
      map(res => res.data || [])
    );
  }

  setPage(page: '') {
    this.currentPage$.next(page);
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'CalculateToolService';
  }
}
