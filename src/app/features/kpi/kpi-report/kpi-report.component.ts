import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {KpiService} from '../service/kpi.service';
import {AreaEnum} from '../model/area.enum';
import {Area} from '../model/area';
import {BaseComponent} from '../../../core/base.component';
import {finalize, map, takeUntil} from 'rxjs/operators';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TagDetail} from '../../tags/model/tags';
import {DialogService} from 'primeng/dynamicdialog';
import {KpiPreviewComponent} from '../kpi-preview/kpi-preview.component';
import {UtilService} from '../../../core/service/util.service';
import {KpiDirective} from '../kpi.directive';
import {KpiPreviewItem} from '../model/kpi-preview-item';
import {KpiReport, KpiTableComponent} from '../model/kpi';
import {KpiImportComponent} from '../kpi-import/kpi-import.component';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'aw-kpi-report',
  templateUrl: './kpi-report.component.html',
  styles: [
  ]
})
export class KpiReportComponent extends BaseComponent implements OnInit {
  @ViewChild(KpiDirective, {static: true}) kpiPreviewHost: KpiDirective;
  @ViewChild(KpiImportComponent, {static: true}) kpiImport: KpiImportComponent;
  initActiveIndex = this.kpiService.kpiReportActiveTab;
  // data
  areaList: Area[] = [];
  tagKpiList: TagDetail[] = [];
  kpiReportList: KpiReport[] = [];
  totalReportKpi = 0;
  isImportSuccess = false;
  stateFilter: any;
  constructor(
    private kpiService: KpiService,
    private indicator: IndicatorService,
    private confirmDialog: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private util: UtilService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super();
    this.stateFilter = {page: 0, pageSize: 10, createDate: null, modifyDate: null, reportType: '', status: null};
  }

  ngOnInit(): void {
    this.indicator.showActivityIndicator();
    const obsTagKpi = this.kpiService.getTagKpi();
    const obsKpiReport = this.kpiService.filterKpiReport(this.stateFilter);
    const obsArea =  this.kpiService.getAreaByStatus(AreaEnum.ALL);
    forkJoin([obsTagKpi, obsKpiReport, obsArea]).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      this.tagKpiList = res[0];
      this.kpiReportList = res[1].listKpi;
      this.totalReportKpi = res[1].totalRecord;
      this.areaList = res[2];
    });
  }

  doChangeTab(evt) {
    const viewContainerRef = this.kpiPreviewHost.viewContainerRef;
    viewContainerRef.clear();
    switch (evt.index) {
      case 0: { this.kpiService.kpiReportActiveTab = 0; break; }
      case 1: {
        this.kpiService.kpiReportActiveTab = 1;
        if (this.isImportSuccess) {
          this.doFilterKpiReport(this.stateFilter);
        }
        break;
      }
      case 2: { this.kpiService.kpiReportActiveTab = 2; break; }
    }
  }

  doFilterKpiReport(value) {
    this.indicator.showActivityIndicator();
    this.stateFilter = {
      page: value.page,
      pageSize: value.pageSize,
      createDate: value.createDate,
      modifyDate: value.modifyDate,
      reportType: value.typeReport.keyTag,
      status: value.status
    };
    this.kpiService.filterKpiReport(this.stateFilter).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      this.kpiReportList = res.listKpi;
      this.totalReportKpi = res.totalRecord;
    });
  }

  doCheckFile(evt) {
    this.indicator.showActivityIndicator();
    const value: TagDetail = evt.reportType;
    const fileFormData: FormData = new FormData();
    fileFormData.append('file', evt.file[0], evt.file[0].name);
    fileFormData.append('typeReport', value.keyTag);
    this.kpiService.checkDataImport(fileFormData).pipe(
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
              res.titles.split('||').forEach((titleValue, titleIndex) => {
                const titleName = titleValue.split('^')[0];
                if (titleName && titleName !== 'null') {
                  titleList.push({ field: titleIndex, header: titleName});
                }
              });
            }
            const dataMapped: any = {...kpi};
            kpi.recordData.split('||').forEach((dataValue, index) => {
              dataMapped[index] = dataValue;
            });
            dataMappedList.push(dataMapped);
          });
        }
        return {root: res, resultTitle: titleList, result: dataMappedList};
      }),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      const kpiPreviewItem: KpiPreviewItem = new KpiPreviewItem(KpiPreviewComponent, res.result, res.resultTitle);
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(kpiPreviewItem.component);
      const viewContainerRef = this.kpiPreviewHost.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent<KpiTableComponent>(componentFactory);
      componentRef.instance.kpiList = kpiPreviewItem.kpiList;
      componentRef.instance.titleList = kpiPreviewItem.titleList;
      componentRef.instance.cancel.subscribe(_ => { viewContainerRef.clear(); this.kpiImport.clearForm(); });
      componentRef.instance.save.subscribe(_ => {
        this.indicator.showActivityIndicator();
        this.kpiService.saveKpiImport(res.root).pipe(
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe((saveRes) => {
          this.isImportSuccess = true;
          this.messageService.add({
            key: 'kpi-msg',
            severity: 'success',
            detail: 'Import KPI thành công'
          });
          viewContainerRef.clear();
          this.kpiImport.clearForm();
        });
      });
    });
  }

  doDeleteArea(area: Area) {
    this.confirmDialog.confirm({
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

  getAllArea(): void {
    this.indicator.showActivityIndicator();
    this.kpiService.getAreaByStatus(AreaEnum.ALL).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.areaList = res;
    });
  }

}


