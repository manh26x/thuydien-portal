import { Component, OnInit } from '@angular/core';
import {KpiService} from '../service/kpi.service';
import {AreaEnum} from '../model/area.enum';
import {Area} from '../model/area';
import {BaseComponent} from '../../../core/base.component';
import {finalize, takeUntil} from 'rxjs/operators';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'aw-kpi-report',
  templateUrl: './kpi-report.component.html',
  styles: [
  ]
})
export class KpiReportComponent extends BaseComponent implements OnInit {
  areaList: Area[] = [];
  constructor(
    private kpiService: KpiService,
    private indicator: IndicatorService,
    private dialog: ConfirmationService,
    private messageService: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllArea();
  }

  getAllArea(): void {
    this.indicator.showActivityIndicator();
    this.kpiService.getAreaByStatus(AreaEnum.ALL).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.areaList = res;
    });
  }

  doDeleteArea(area: Area) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn xóa vùng dữ liệu ' + area.name,
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Hủy',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.kpiService.deleteArea(area.id).pipe(
        ).subscribe((res) => {
          this.messageService.add({
            key: 'kpi-msg',
            severity: 'success',
            detail: 'Xóa vùng dữ liệu thành công'
          });
          this.getAllArea();
        });
      },
      reject: () => {}
    });
  }

}


