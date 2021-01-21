 import { Component, OnInit } from '@angular/core';
 import {KpiService} from '../../service/kpi.service';
 import {ActivatedRoute, Router} from '@angular/router';
 import {concatMap, finalize, map, takeUntil} from 'rxjs/operators';
 import {BaseComponent} from '../../../../core/base.component';
 import {IndicatorService} from '../../../../shared/indicator/indicator.service';
 import {Area} from '../../model/area';
 import {MessageService} from 'primeng/api';

@Component({
  selector: 'aw-area-update',
  templateUrl: './area-update.component.html',
  styles: [
  ]
})
export class AreaUpdateComponent extends BaseComponent implements OnInit {
  areaDetail: Area = {};
  constructor(
    private kpiService: KpiService,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap((id) => this.kpiService.getAreaDetail(+id).pipe(
        takeUntil(this.nextOnDestroy),
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe((res) => {
      this.areaDetail = res;
    });
  }

  doSave(value) {
    this.indicator.showActivityIndicator();
    const area: Area = {
      id: value.id,
      name: value.name,
      priority: value.priority,
      color: value.color
    };
    this.kpiService.updateArea(area).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      this.messageService.add({
        key: 'area-msg',
        severity: 'success',
        summary: '',
        detail: 'Cập mhật phân vùng dữ liệu thành công'
      });
      this.router.navigate(['management-kpi', 'report']);
    });
  }

}
