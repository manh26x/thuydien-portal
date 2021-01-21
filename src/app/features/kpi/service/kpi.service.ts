import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ApiResultResponse} from '../../../core/model/result-response';
import {TagDetail} from '../../tags/model/tags';
import {Area} from '../model/area';

@Injectable()
export class KpiService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  getAreaDetail(id: number): Observable<Area> {
    return this.doPost('/kpi/areaData/detail', id).pipe(
      map(res => res.data ? res.data[0] : {})
    );
  }

  insertArea(area: Area): Observable<ApiResultResponse> {
    return this.doPost('/kpi/areaData/insert', area);
  }

  updateArea(area: Area): Observable<ApiResultResponse> {
    return this.doPost('/kpi/areaData/update', area);
  }

  checkDataImport(file: FormData): Observable<ApiResultResponse> {
    return this.doPost('/kpi/portal/importKPI', file).pipe(
      map(res => res)
    );
  }

  getTagKpi(): Observable<TagDetail[]> {
    return this.doPost('/kpi/portal/getTypeReport', null).pipe(
      map(res => res.data || [])
    );
  }

  getAreaByStatus(status: number): Observable<Area[]> {
    return this.doPost('/kpi/areaData/getAll', status).pipe(
      map(res => res.data || [])
    );
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getServiceName(): string {
    return 'KpiService';
  }
}
