import {EventEmitter} from '@angular/core';
import {map} from "lodash-es";
import {Area} from "./area";

export interface Kpi {
  area?: string;
  branchCode?: string;
  branchName?: string;
  employeeNumber?: number;
  employeePosition?: string;
  fullName?: string;
  laborContractStatus?: string;
  misCodeCBKD?: string;
  misCodeManagement?: string;
  recordData?: string;
  data?: string;
  tbpTPKDNumber?: number;
}

export interface KpiImportData {
  data?: Kpi[];
  titles?: string;
  typeReport?: string;
  term?: string;
}

export interface KpiTableComponent {
  kpiList: any[];
  titleList: any[];
  save: EventEmitter<any>;
  cancel: EventEmitter<any>;
}

export interface KpiFilterRequest {
  reportType: string;
  createDate: Date;
  modifyDate: Date;
  status: number;
  page: number;
  pageSize: number;
}

export interface KpiReport {
  id?: number;
  reportType?: string;
  recordData?: string;
  createDate?: Date;
  modifyDate?: Date;
  status?: number;
  tagName?: string;
}

export interface KpiFilterResponse {
  listKpi: KpiReport[];
  totalRecord: number;
}

export interface KpiArea {
  value: string;
  areaId: number;
  areaColor: string;
  areaName: string;
  isShow: number;
  displayOrder: number;
  targetGroup: string;
  isMainIndex: number;
}

export interface KpiDetail {
  kpi?: KpiReport;
  listKPITitle?: KpiArea[];
  targetGroups?: string[];
}

export interface KpiUpdateRequest {
  id: number;
  listKPITitle: KpiArea[];
}

export interface KpiReportDetail {
  infoAndTitle?: KpiReport;
  data?: Kpi[];
}

export interface KpiTitle {
  field: string | number;
  header: string;
}

export interface DropdownObj {
  value: string;
  label: string;
}
export interface KpiAreaMap {
  value: string;
  area: Area;
  isShow: boolean;
  displayOrder: number;
  isMainIndex: boolean;
  id: number;
  targetGroup: string;
  disabledCheckMain: boolean;
}

export interface KpiDetailMap {
  kpi?: KpiReport;
  kpiAreaList?: KpiAreaMap[];
  kpiAreaSelectedList?: KpiAreaMap[];
}
