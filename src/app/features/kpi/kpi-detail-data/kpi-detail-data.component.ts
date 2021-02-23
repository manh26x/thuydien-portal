import { Component, OnInit } from '@angular/core';
import {KpiService} from '../service/kpi.service';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from '../../../core/base.component';
import {finalize, map, switchMap, takeUntil} from 'rxjs/operators';
import {UtilService} from '../../../core/service/util.service';
import {KpiReport} from '../model/kpi';
import {ExportService} from '../../../shared/service/export.service';

@Component({
  selector: 'aw-kpi-detail-data',
  templateUrl: './kpi-detail-data.component.html',
  styles: [
  ],
  providers: [ExportService]
})
export class KpiDetailDataComponent extends BaseComponent implements OnInit {
  kpiData: KpiReport = {};
  kpiResult: any[] = [];
  kpiResultTitle: any[] = [];
  kpiTitleExport: any = {stt: 'STT'};
  constructor(
    private kpiService: KpiService,
    private indicator: IndicatorService,
    private route: ActivatedRoute,
    private util: UtilService,
    private router: Router,
    private exportService: ExportService
  ) {
    super();
  }

  ngOnInit(): void {
    this.kpiService.setPage('kpi', 'kpiReportDetail');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      switchMap((id) => this.kpiService.getKpiReportDetail(+id).pipe(
        map((res) => {
          const titleList = [];
          const dataMappedList: any[] = [];
          if (this.util.canForEach(res.data)) {
            res.data.forEach((kpi, kpiIndex) => {
              if (kpiIndex === 0) {
                Object.keys(kpi).forEach(key => {
                  switch (key) {
                    case 'area': {
                      this.kpiTitleExport[key] = 'Khu vực';
                      titleList.push({ field: key, header: 'Khu vực' });
                      break;
                    }
                    case 'branchCode': {
                      this.kpiTitleExport[key] = 'Mã chi nhánh';
                      titleList.push({ field: key, header: 'Mã chi nhánh' });
                      break;
                    }
                    case 'branchName': {
                      this.kpiTitleExport[key] = 'Tên chi nhánh';
                      titleList.push({ field: key, header: 'Tên chi nhánh' });
                      break;
                    }
                    case 'employeeNumber': {
                      this.kpiTitleExport[key] = 'SHNV';
                      titleList.push({ field: key, header: 'SHNV' });
                      break;
                    }
                    case 'employeePosition': {
                      this.kpiTitleExport[key] = 'Chức danh/ Bộ phân';
                      titleList.push({ field: key, header: 'Chức danh/ Bộ phân' });
                      break;
                    }
                    case 'fullName': {
                      this.kpiTitleExport[key] = 'Họ & tên';
                      titleList.push({ field: key, header: 'Họ & tên' });
                      break;
                    }
                    case 'laborContractStatus': {
                      this.kpiTitleExport[key] = 'Trạng thái hợp đồng';
                      titleList.push({ field: key, header: 'Trạng thái hợp đồng' });
                      break;
                    }
                    case 'miscodeCBKD': {
                      this.kpiTitleExport[key] = 'Username CBKD';
                      titleList.push({ field: key, header: 'Username CBKD' });
                      break;
                    }
                    case 'miscodeManagement': {
                      this.kpiTitleExport[key] = 'Username của trưởng nhóm quản lý';
                      titleList.push({ field: key, header: 'Username của trưởng nhóm quản lý' });
                      break;
                    }
                    case 'tbpTPKDNumber': {
                      this.kpiTitleExport[key] = 'SHNV GĐ mảng, TBP, TPKD quản lý';
                      titleList.push({ field: key, header: 'SHNV GĐ mảng, TBP, TPKD quản lý' });
                      break;
                    }
                  }
                });
                res.infoAndTitle.recordData.split('||').forEach((titleValue, titleIndex) => {
                  const titleName = titleValue.split('^')[0];
                  if (titleName && titleName !== 'null') {
                    this.kpiTitleExport[`z${titleIndex}`] = titleName;
                    titleList.push({ field: `z${titleIndex}`, header: titleName});
                  }
                });
              }
              // search value
              const searchValue = `${kpi.employeeNumber} ${kpi.fullName} ${kpi.misCodeCBKD} ${kpi.misCodeManagement} ${kpi.tbpTPKDNumber} ${kpi.laborContractStatus} ${kpi.employeePosition} ${kpi.branchCode} ${kpi.branchName} ${kpi.area}`;
              const dataMapped: any = {...kpi, searchNg: searchValue};
              kpi.data.split('||').forEach((dataValue, index) => {
                dataMapped[`z${index}`] = dataValue;
              });
              dataMappedList.push(dataMapped);
            });
          }
          return {root: res, resultTitle: titleList, result: dataMappedList};
        }),
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.kpiData = res.root.infoAndTitle;
      this.kpiResultTitle = res.resultTitle;
      this.kpiResult = res.result;
    });
  }

  doExport(data: any) {
    if (this.util.canForEach(data.kpiList)) {
      this.indicator.showActivityIndicator();
      const dataExportList = [
        {}, {}, {}, {}, {}, {}, {}, {}, {}
      ];
      dataExportList.push(this.kpiTitleExport);
      data.kpiList.forEach((kpi, index) => {
        const dataExport = {};
        Object.keys(this.kpiTitleExport).forEach((key: string) => {
          dataExport[key] = kpi[key];
        });
        dataExport['stt'] = index + 1;
        dataExportList.push(dataExport);
      });
      this.exportService.exportAsExcelFile(dataExportList, 'kpi_data');
      this.indicator.hideActivityIndicator();
    }
  }

  gotoReport(): void {
    this.router.navigate(['management-kpi', 'report']);
  }

}
