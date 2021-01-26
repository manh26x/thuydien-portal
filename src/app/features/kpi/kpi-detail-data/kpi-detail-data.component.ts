import { Component, OnInit } from '@angular/core';
import {KpiService} from '../service/kpi.service';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from '../../../core/base.component';
import {finalize, map, switchMap, takeUntil} from 'rxjs/operators';
import {UtilService} from '../../../core/service/util.service';
import {KpiReport} from '../model/kpi';

@Component({
  selector: 'aw-kpi-detail-data',
  templateUrl: './kpi-detail-data.component.html',
  styles: [
  ]
})
export class KpiDetailDataComponent extends BaseComponent implements OnInit {
  kpiData: KpiReport = {};
  kpiResult: any[] = [];
  kpiResultTitle: any[] = [];
  constructor(
    private kpiService: KpiService,
    private indicator: IndicatorService,
    private route: ActivatedRoute,
    private util: UtilService,
    private router: Router
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
                    case 'area': { titleList.push({ field: key, header: 'Khu vực' }); break; }
                    case 'branchCode': { titleList.push({ field: key, header: 'Mã chi nhánh' }); break; }
                    case 'branchName': { titleList.push({ field: key, header: 'Tên chi nhánh' }); break; }
                    case 'employeeNumber': { titleList.push({ field: key, header: 'SHNV' }); break; }
                    case 'employeePosition': { titleList.push({ field: key, header: 'Chức danh/ Bộ phân' }); break; }
                    case 'fullName': { titleList.push({ field: key, header: 'Họ & tên' }); break; }
                    case 'laborContractStatus': { titleList.push({ field: key, header: 'Trạng thái hợp đồng' }); break; }
                    case 'misCodeCBKD': { titleList.push({ field: key, header: 'Miscode CBKD' }); break; }
                    case 'misCodeManagement': { titleList.push({ field: key, header: 'Miscode của trưởng nhóm quản lý' }); break; }
                  }
                });
                res.infoAndTitle.recordData.split('||').forEach((titleValue, titleIndex) => {
                  const titleName = titleValue.split('^')[0];
                  if (titleName && titleName !== 'null') {
                    titleList.push({ field: titleIndex, header: titleName});
                  }
                });
              }
              const dataMapped: any = {...kpi};
              kpi.data.split('||').forEach((dataValue, index) => {
                dataMapped[index] = dataValue;
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

  gotoReport(): void {
    this.router.navigate(['management-kpi', 'report']);
  }

}
