import { Component, OnInit } from '@angular/core';
import {KpiService} from '../service/kpi.service';
import {AreaEnum} from '../model/area.enum';
import {Area} from '../model/area';
import {BaseComponent} from '../../../core/base.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'aw-kpi-report',
  templateUrl: './kpi-report.component.html',
  styles: [
  ]
})
export class KpiReportComponent extends BaseComponent implements OnInit {
  areaList: Area[] = [];
  constructor(private kpiService: KpiService) {
    super();
  }

  ngOnInit(): void {
    this.getAllArea();
  }

  getAllArea(): void {
    this.kpiService.getAreaByStatus(AreaEnum.ALL).pipe(
      takeUntil(this.nextOnDestroy)
    ).subscribe(res => {
      this.areaList = res;
    });
  }

}


