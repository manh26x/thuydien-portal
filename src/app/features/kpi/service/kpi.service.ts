import { Injectable } from '@angular/core';
import {BaseService} from '../../../core/service/base.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiResultResponse} from '../../../core/model/result-response';
import {TagDetail} from '../../tags/model/tags';
import {Area} from '../model/area';
import {KpiDetail, KpiFilterRequest, KpiFilterResponse, KpiImportData, KpiReport, KpiReportDetail, KpiUpdateRequest} from '../model/kpi';

export interface KpiBreadcrumb {
  main: string;
  page: string;
}

@Injectable()
export class KpiService extends BaseService {
  kpiReportActiveTab = 0;
  currentPage$: BehaviorSubject<KpiBreadcrumb> = new BehaviorSubject<KpiBreadcrumb>({main: '', page: ''});
  constructor(private http: HttpClient) {
    super();
  }

  getKpiReportDetail(id: number): Observable<KpiReportDetail> {
    return this.doPost('/kpi/portal/getKPIData', id).pipe(
      map(res => res.data ? res.data[0] : {})
    );
  }

  deleteKpi(id: number): Observable<ApiResultResponse> {
    return this.doPost('/kpi/portal/deleteKPI', id);
  }

  updateKpi(request: KpiUpdateRequest): Observable<ApiResultResponse> {
    return this.doPost('/kpi/portal/updateKpiDashboard', request);
  }

  getKpiDetail(id: number): Observable<KpiDetail> {
    return this.doPost('/kpi/portal/kpiDashboard', id).pipe(
      map(res => res.data ? res.data[0] : {})
    );
  }

  filterKpiReport(request: KpiFilterRequest): Observable<KpiFilterResponse> {
    return this.doPost('/kpi/portal/filterKPIReport', request).pipe(
      map(res => res.data ? res.data[0] : {})
    );
  }

  saveKpiImport(data: KpiImportData): Observable<ApiResultResponse> {
    return this.doPost('/kpi/portal/saveKPIReport', data);
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

  deleteArea(id: number): Observable<ApiResultResponse> {
    return this.doPost('/kpi/areaData/delete', id);
  }

  checkDataImport(file: FormData): Observable<KpiImportData> {
    return this.doPost('/kpi/portal/importKPI', file).pipe(
      map(res => res.data ? res.data[0] : {})
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

  setPage(main: '' | 'kpi' | 'area', page: '' | 'kpiDetail' | 'kpiUpdate' | 'kpiReportDetail' | 'areaCreate' | 'areaUpdate') {
    this.currentPage$.next({main, page});
  }
}
