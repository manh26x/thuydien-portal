import {AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {KpiService} from '../service/kpi.service';
import {AreaEnum} from '../model/area.enum';
import {Area} from '../model/area';
import {BaseComponent} from '../../../core/base.component';
import {delay, finalize, map, startWith, takeUntil} from 'rxjs/operators';
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
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {TabView} from 'primeng/tabview';
import {AuthService} from '../../../auth/auth.service';
import {FeatureEnum} from '../../../shared/model/feature.enum';
import {RoleEnum} from '../../../shared/model/role';
import {KpiDataComponent} from '../kpi-data/kpi-data.component';
import {ApiErrorResponse} from '../../../core/model/error-response';

@Component({
  selector: 'aw-kpi-report',
  templateUrl: './kpi-report.component.html',
  styles: [
  ]
})
export class KpiReportComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild(KpiDirective) kpiPreviewHost: KpiDirective;
  @ViewChild(KpiImportComponent) kpiImport: KpiImportComponent;
  @ViewChild('tabView') tabView: TabView;
  @ViewChild(KpiDataComponent) kpiData: KpiDataComponent;
  initActiveIndex: number;
  // data
  areaList: Area[] = [];
  tagKpiList: TagDetail[] = [];
  kpiReportList: KpiReport[] = [];
  totalReportKpi = 0;
  isImportSuccess = false;
  stateFilter: any;
  isNotView: boolean;
  isNotImport: boolean;
  isHasEdit: boolean;
  isHasDel: boolean;
  constructor(
    private kpiService: KpiService,
    private indicator: IndicatorService,
    private confirmDialog: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private util: UtilService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private auth: AuthService
  ) {
    super();
    this.stateFilter = {page: 0, pageSize: 10, createDate: null, modifyDate: null, reportType: '', status: null};
    this.isNotView = !this.auth.isHasRole(FeatureEnum.KPI, RoleEnum.ACTION_VIEW);
    this.isNotImport = !this.auth.isHasRole(FeatureEnum.KPI, RoleEnum.ACTION_IMPORT);
    this.isHasEdit = this.auth.isHasRole(FeatureEnum.KPI, RoleEnum.ACTION_INSERT);
    this.isHasDel = this.auth.isHasRole(FeatureEnum.KPI, RoleEnum.ACTION_DELETE);
    if (this.isNotImport && this.kpiService.kpiReportActiveTab === 0) {
      this.initActiveIndex = 1;
    } else {
      this.initActiveIndex = this.kpiService.kpiReportActiveTab;
    }
  }

  ngOnInit(): void {
    this.kpiService.setPage('', '');
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

  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      delay(100),
      takeUntil(this.nextOnDestroy)
    ).subscribe(_ => {
      this.tabView.cd.markForCheck();
    });
  }

  refreshData() {
    switch (this.kpiService.kpiReportActiveTab) {
      case 0: { this.kpiImport.clearForm(); break; }
      case 1: {
        this.kpiData.initForm();
        this.doFilterKpiReport({page: 0, pageSize: 10, createDate: null, modifyDate: null, reportType: '', status: null});
        break;
      }
      case 2: {
        this.getAllArea();
        break;
      }
    }
  }

  doChangeTab(evt) {
    this.kpiPreviewHost.viewContainerRef.clear();
    switch (evt.index) {
      case 0: { this.kpiService.kpiReportActiveTab = 0; break; }
      case 1: {
        this.kpiService.kpiReportActiveTab = 1;
        if (this.isImportSuccess) {
          this.doFilterKpiReport(this.stateFilter);
          this.isImportSuccess = false;
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
      reportType: value.reportType ? value.reportType.keyTag : value.reportType,
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
                  case 'misCodeCBKD': { titleList.push({ field: key, header: 'Username CBKD' }); break; }
                  case 'misCodeManagement': { titleList.push({ field: key, header: 'Username của trưởng nhóm quản lý' }); break; }
                }
              });
              res.titles.split('||').forEach((titleValue, titleIndex) => {
                const titleName = titleValue.split('^')[0];
                if (titleName && titleName !== 'null') {
                  titleList.push({ field: `z${titleIndex}`, header: titleName});
                }
              });
            }
            // search value
            const searchValue = `${kpi.employeeNumber} ${kpi.fullName} ${kpi.misCodeCBKD} ${kpi.misCodeManagement} ${kpi.tbpTPKDNumber} ${kpi.laborContractStatus} ${kpi.employeePosition} ${kpi.branchCode} ${kpi.branchName} ${kpi.area}`;
            const dataMapped: any = {...kpi, searchNg: searchValue};
            kpi.recordData.split('||').forEach((dataValue, index) => {
              dataMapped[`z${index}`] = dataValue;
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
        ).subscribe((__) => {
          this.isImportSuccess = true;
          this.messageService.add({
            severity: 'success',
            detail: 'Import KPI thành công'
          });
          viewContainerRef.clear();
          this.kpiImport.clearForm();
        });
      });
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '300') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('message.importInvalid')
        });
      } else {
        throw err;
      }
    });
  }

  doDeleteKpi(kpi: KpiReport) {
    this.confirmDialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('message.confirmDel'),
      message: this.translate.instant('message.delKpi'),
      acceptLabel: this.translate.instant('message.accept'),
      rejectLabel: this.translate.instant('message.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.kpiService.deleteKpi(kpi.id).subscribe(_ => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.delSuccess')
          });
        });
        this.doFilterKpiReport(this.stateFilter);
      },
      reject: () => {}
    });
  }

  doDeleteArea(area: Area) {
    this.confirmDialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('message.confirmDel'),
      message: this.translate.instant('message.delArea', { name: area.name }),
      acceptLabel: this.translate.instant('message.accept'),
      rejectLabel: this.translate.instant('message.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.kpiService.deleteArea(area.id).subscribe((_) => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.delSuccess')
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


