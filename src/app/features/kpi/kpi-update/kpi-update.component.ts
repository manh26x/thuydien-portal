import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {KpiService} from '../service/kpi.service';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {finalize, map, switchMap, takeUntil} from 'rxjs/operators';
import {KpiArea, KpiReport} from '../model/kpi';
import {BaseComponent} from '../../../core/base.component';
import {Area} from '../model/area';
import {AreaEnum} from '../model/area.enum';
import {forkJoin, Observable} from 'rxjs';
import {UtilService} from '../../../core/service/util.service';
import {Table} from 'primeng/table';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

interface KpiAreaMap {
  value: string;
  area: Area;
  isShow: number;
  displayOrder: number;
  id: number;
}

interface KpiDetailMap {
  kpi?: KpiReport;
  kpiAreaList?: KpiAreaMap[];
  kpiAreaSelectedList?: KpiAreaMap[];
}

@Component({
  selector: 'aw-kpi-update',
  templateUrl: './kpi-update.component.html',
  styles: []
})
export class KpiUpdateComponent extends BaseComponent implements OnInit {
  kpiData: KpiReport = {};
  kpiAreaList: KpiAreaMap[] = [];
  kpiAreaSelectedList: KpiAreaMap[] = [];
  areaList: Area[] = [];
  isSelectedAll = false;
  @ViewChild('tableKpi') tableKpi: Table;
  constructor(
    private route: ActivatedRoute,
    private kpiService: KpiService,
    private indicator: IndicatorService,
    private util: UtilService,
    private messageService: MessageService,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.kpiService.setPage('kpi', 'kpiUpdate');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      switchMap((id) => {
        const obsKpiDetail: Observable<KpiDetailMap> = this.kpiService.getKpiDetail(+id).pipe(
          map(({kpi, listKPITitle}) => {
            const kpiArea: KpiAreaMap[] = [];
            const kpiAreaSelected: KpiAreaMap[] = [];
            if (this.util.canForEach(listKPITitle)) {
              listKPITitle.forEach((item, index) => {
                const itemMap = {
                  value: item.value, displayOrder: item.displayOrder, isShow: item.isShow,
                  area: { id: item.areaId, color: item.areaColor, name: item.areaName},
                  id: index
                };
                kpiArea.push(itemMap);
                if (item.isShow === 1) { kpiAreaSelected.push(itemMap); }
              });
            }
            return {kpi, kpiAreaList: kpiArea, kpiAreaSelectedList: kpiAreaSelected};
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
      this.kpiAreaSelectedList = res[0].kpiAreaSelectedList;
      this.areaList = res[1];
    });
  }

  doSave() {
    this.indicator.showActivityIndicator();
    const kpiAreaUnMap: KpiArea[] = [];
    if (this.util.canForEach(this.kpiAreaList)) {
      this.kpiAreaList.forEach(item => {
        kpiAreaUnMap.push({
          value: item.value,
          isShow:  this.kpiAreaSelectedList.find(x => x.id === item.id) ? 1 : 0,
          areaName: item.area.name,
          areaColor: item.area.color,
          areaId: item.area.id,
          displayOrder: item.displayOrder
        });
      });
    }
    this.kpiService.updateKpi({ id: this.kpiData.id, listKPITitle: kpiAreaUnMap }).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(_ => {
      this.messageService.add({
        severity: 'success',
        summary: '',
        detail: this.translate.instant('message.updateSuccess')
      });
      this.router.navigate(['management-kpi', 'report']);
    });
  }

  doFilter(evt) {
    this.kpiService.logDebug(evt);
    this.tableKpi.filter(`${evt.kpiIndex}`, 'value', 'contains');
    this.tableKpi.filter(evt.allowView, 'isShow', 'equals');
    this.tableKpi.filter(evt.area.id, 'area.id', 'equals');
  }

  cboChange(evt: KpiReport[]) {
    this.kpiAreaList.forEach(item => {
      if (evt.find(x => x.id === item.id)) {
        item.isShow = 1;
      } else {
        item.isShow = 0;
      }
    });
  }

  goBack() {
    this.router.navigate(['management-kpi', 'report']);
  }

}
