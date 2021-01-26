 import { Component, OnInit } from '@angular/core';
 import {KpiService} from '../service/kpi.service';
 import {ActivatedRoute, Router} from '@angular/router';
 import {finalize, map, switchMap, takeUntil} from 'rxjs/operators';
 import {BaseComponent} from '../../../core/base.component';
 import {IndicatorService} from '../../../shared/indicator/indicator.service';
 import {Area} from '../model/area';
 import {MessageService} from 'primeng/api';
 import {TranslateService} from '@ngx-translate/core';

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
    private router: Router,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.kpiService.setPage('area', 'areaUpdate');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      switchMap((id) => this.kpiService.getAreaDetail(+id).pipe(
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
        severity: 'success',
        detail: this.translate.instant('area.updateSuccess')
      });
      this.router.navigate(['management-kpi', 'report']);
    });
  }

}
