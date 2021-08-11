import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {KpiService} from '../service/kpi.service';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {finalize, map, switchMap, takeUntil} from 'rxjs/operators';
import {DropdownObj, KpiArea, KpiAreaMap, KpiDetailMap, KpiReport} from '../model/kpi';
import {BaseComponent} from '../../../core/base.component';
import {Area} from '../model/area';
import {AreaEnum} from '../model/area.enum';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {UtilService} from '../../../core/service/util.service';
import {Table} from 'primeng/table';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

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
  targetSelection: DropdownObj[] = [];
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
      this.kpiAreaSelectedList = res[0].kpiAreaSelectedList;
      this.areaList = res[1];
      this.loadMainIndex(null);
    });
  }

  loadMainIndex(item: any) {
    this.kpiAreaList.forEach(kpi => kpi.disabledCheckMain = this.checkMainIndex(kpi));
    if(item  && item.isMainIndex) {
      item.targetGroup= item.value;
      this.targetSelection.push({value: item.targetGroup, label:item.targetGroup});
    } else if(item && !item.isMainIndex) {
      this.targetSelection = this.targetSelection.filter(e => e.value !== item.targetGroup);
    }
  }

  doSave() {
    this.indicator.showActivityIndicator();
    const kpiAreaUnMap: KpiArea[] = [];
    if (this.util.canForEach(this.kpiAreaList)) {
      this.kpiAreaList.forEach(item => {
        kpiAreaUnMap.push({
          value: item.value,
          isShow:  item.isShow ? 1 : 0,
          areaName: item.area.name,
          areaColor: item.area.color,
          areaId: item.area.id,
          displayOrder: item.displayOrder,
          targetGroup: item.targetGroup,
          isMainIndex: item.isMainIndex ? 1: 0
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

  goBack() {
    this.router.navigate(['management-kpi', 'report']);
  }

  checkMainIndex(item) {
    return (item.isMainIndex && this.kpiAreaList
      .filter(e => e.targetGroup === item.targetGroup
        && !e.isMainIndex).length > 0 );
  }

  cboChange(evt: KpiReport[]) {
    this.kpiAreaList.forEach(item => {
      if (evt.find(x => x.id === item.id)) {
        item.isShow = true;
      } else {
        item.isShow = false;
      }
    });
  }

  clickCheckBoxShow(item: KpiArea) {
    if(item.isMainIndex && item.isShow) {
      this.kpiAreaList.filter(kpi => kpi.targetGroup === item.targetGroup).forEach(kpi => kpi.isShow = true);
    } else if(item.isMainIndex){
      this.kpiAreaList.filter(kpi => kpi.targetGroup === item.targetGroup).forEach(kpi => kpi.isShow = false);
    }
  }
}
