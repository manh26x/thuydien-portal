import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {KpiService} from '../service/kpi.service';
import {BaseComponent} from '../../../core/base.component';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {finalize, map, switchMap, takeUntil} from 'rxjs/operators';
import {DropdownObj, KpiArea, KpiAreaMap, KpiDetailMap, KpiReport} from '../model/kpi';
import {AreaEnum} from '../model/area.enum';
import {forkJoin, Observable} from 'rxjs';
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
  kpiAreaList: KpiAreaMap[] = [];
  kpiAreaSelectedList: KpiArea[] = [];
  areaList: Area[] = [];
  targetSelection: DropdownObj[] = [];
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
        const obsKpiDetail: Observable<KpiDetailMap> = this.kpiService.getKpiDetail(+id).pipe(
          map(({kpi, listKPITitle, targetGroups}) => {
            const kpiArea: KpiAreaMap[] = [];
            const kpiAreaSelected: KpiAreaMap[] = [];
            if (this.util.canForEach(listKPITitle)) {
              listKPITitle.forEach((item, index) => {
                const itemMap = {
                  value: item.value, displayOrder: item.displayOrder,
                  area: { id: item.areaId, color: item.areaColor, name: item.areaName},
                  id: index,
                  targetGroup: item.targetGroup,
                  isMainIndex: item.isMainIndex === 1,
                  disabledCheckMain: false,
                  isShow: item.isShow === 1
                };
                kpiArea.push(itemMap);
                if (item.isShow) { kpiAreaSelected.push(itemMap); }
              });
            }
            this.targetSelection = targetGroups.map(value => {return {value: value, label:value}});
            return {kpi, kpiAreaList: kpiArea, kpiAreaSelectedList: kpiAreaSelected, groupTargetMap: targetGroups};
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
      this.kpiAreaList = res[0].kpiAreaList;
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
