import { Component, OnInit } from '@angular/core';
import {CalculateToolService} from '../service/calculate-tool.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {BaseComponent} from '../../../core/base.component';
import {concatMap, finalize, map, mergeMap, startWith, takeUntil, tap} from 'rxjs/operators';
import {CalculateToolEnum} from '../model/calculate-tool.enum';
import {ProductService} from '../../../shared/service/product.service';
import {Product} from '../../../shared/model/product';
import {CalculateTool, SearchToolRequest} from '../model/calculate-tool';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {UtilService} from '../../../core/service/util.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UserAuth} from '../../../auth/model/user-auth';
import {AuthService} from '../../../auth/auth.service';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {FeatureEnum} from '../../../shared/model/feature.enum';
import {RoleEnum} from '../../../shared/model/role';

@Component({
  selector: 'aw-calculate-tool-data',
  templateUrl: './calculate-tool-data.component.html',
  styles: [
  ],
  providers: [ProductService]
})
export class CalculateToolDataComponent extends BaseComponent implements OnInit {
  formFilter: FormGroup;
  statusList = [];
  levelList = [];
  customerTypeList: Product[] = [];
  toolList: CalculateTool[] = [];
  toolConst = CalculateToolEnum;
  userLogged: UserAuth;
  isHasOnOff = false;
  constructor(
    private toolService: CalculateToolService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private productService: ProductService,
    private fb: FormBuilder,
    private indicator: IndicatorService,
    private util: UtilService,
    private messageService: MessageService,
    private auth: AuthService,
    private confirmService: ConfirmationService
  ) {
    super();
    this.userLogged = this.auth.getUserInfo();
    this.isHasOnOff = this.auth.isHasRole(FeatureEnum.TOOL, RoleEnum.ACTION_ON_OFF);
    this.initForm();
  }

  ngOnInit(): void {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      mergeMap(() => this.translate.get('const').pipe(
        concatMap(resLang => this.productService.getGroupProduct().pipe(
          map(prod => {
            return { lang: resLang, resProd: prod };
          })
        ))
      ))
    ).subscribe(res => {
      this.customerTypeList = [{ id: '', title: res.lang.all }, ...res.resProd];
      this.statusList = [
        { name: res.lang.all, code: -1 },
        { name: res.lang.active, code: CalculateToolEnum.STATUS_ACTIVE },
        { name: res.lang.inactive, code: CalculateToolEnum.STATUS_INACTIVE }
      ];
      this.levelList = [
        { name: res.lang.all, value: '' },
        { name: res.lang.levelNormal, code: CalculateToolEnum.LEVEL_NORMAL },
        { name: res.lang.levelImportant, code: CalculateToolEnum.LEVEL_IMPORTANT},
        { name: res.lang.levelVeryImportant, code: CalculateToolEnum.LEVEL_VERY_IMPORTANT}
      ];
    });
    this.searchListTool();
  }

  doChangeStatus(index: number) {
    const data = this.toolList[index];
    const newStatus = data.isActive ? 1 : 0;
    const msg = data.isActive ? 'message.confirmOn' : 'message.confirmOff';
    this.confirmService.confirm({
      key: 'globalDialog',
      header: this.translate.instant('message.notification'),
      message: this.translate.instant(msg),
      acceptVisible: true,
      rejectVisible: true,
      acceptLabel: this.translate.instant('message.accept'),
      rejectLabel: this.translate.instant('message.reject'),
      defaultFocus: 'reject',
      accept: () => this.changeStatus(index, newStatus),
      reject: () => { this.toolList[index].isActive = !data.isActive; }
    });
  }

  changeStatus(index, newStatus) {
    const data = this.toolList[index];
    this.toolService.changeStatus(data.id, newStatus).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.updateSuccess')
      });
    }, err => {
      this.toolList[index].isActive = !data.isActive;
      throw err;
    });
  }

  searchListTool() {
    this.indicator.showActivityIndicator();
    const filterValue = this.formFilter.value;
    const request: SearchToolRequest = {
      customerType: filterValue.customerType.id + '',
      keysearch: filterValue.searchValue,
      priority: filterValue.level.code,
      status: filterValue.status.code
    };
    this.toolService.getToolList(request).pipe(
      map(res => {
        if (this.util.canForEach(res)) {
          res.forEach(tool => {
            tool.isActive = tool.status === 1;
          });
        }
        return res;
      }),
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.toolList = res;
    });
  }

  refreshSearch() {
    this.initForm();
    this.searchListTool();
  }

  initForm() {
    this.formFilter = this.fb.group({
      searchValue: [''],
      status: [{code: -1}],
      customerType: [{id: ''}],
      level: [{code: ''}]
    });
  }

}
