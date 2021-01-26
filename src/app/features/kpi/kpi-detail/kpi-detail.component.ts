import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {KpiService} from '../service/kpi.service';
import {BaseComponent} from '../../../core/base.component';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {finalize, map, switchMap, takeUntil} from 'rxjs/operators';
import {KpiArea, KpiReport} from '../model/kpi';
import {AreaEnum} from '../model/area.enum';
import {forkJoin} from 'rxjs';
import {Area} from '../model/area';
import {Table} from 'primeng/table';
import {UtilService} from '../../../core/service/util.service';

@Component({
  selector: 'aw-kpi-detail',
  templateUrl: './kpi-detail.component.html',
  styles: [
  ]
})
export class KpiDetailComponent extends BaseComponent implements OnInit {
  kpiData: KpiReport = {};
  kpiAreaList: KpiArea[] = [];
  kpiAreaSelectedList: KpiArea[] = [];
  areaList: Area[] = [];
  @ViewChild('tableKpi') tableKpi: Table;
  constructor(
    private route: ActivatedRoute,
    private kpiService: KpiService,
    private indicator: IndicatorService,
    private router: Router,
    private util: UtilService
  ) {
    super();
  }

  ngOnInit(): void {
    this.kpiService.setPage('kpi', 'kpiDetail');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      switchMap((id) => {
        const obsKpiDetail = this.kpiService.getKpiDetail(+id).pipe(
          map(res => {
            const selectedList: KpiArea[] = [];
            if (this.util.canForEach(res.listKPITitle)) {
              res.listKPITitle.forEach(item => {
                if (item.isShow === 1) {
                  selectedList.push(item);
                }
              });
            }
            return { ...res, kpiSelected: selectedList };
          })
        );
        const obsArea = this.kpiService.getAreaByStatus(AreaEnum.STATUS_ACTIVE);
        return forkJoin([obsKpiDetail, obsArea]).pipe(
          takeUntil(this.nextOnDestroy),
          finalize(() => this.indicator.hideActivityIndicator())
        );
      })
    ).subscribe((res) => {
      this.kpiData = res[0].kpi;
      this.kpiAreaList = res[0].listKPITitle;
      this.kpiAreaSelectedList = res[0].kpiSelected;
      this.areaList = res[1];
    });
  }

  doFilter(evt) {
    this.tableKpi.filter(`${evt.kpiIndex}`, 'value', 'contains');
    this.tableKpi.filter(evt.allowView, 'isShow', 'equals');
    this.tableKpi.filter(evt.area.id, 'areaId', 'equals');
  }

  gotoReport() {
    this.router.navigate(['management-kpi', 'report']);
  }

}
