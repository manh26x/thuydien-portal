import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BaseComponent} from '../../../core/base.component';
import {RoleService} from '../../../shared/service/role.service';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, finalize, startWith, takeUntil} from 'rxjs/operators';
import {ConfirmationService, MessageService, SelectItem} from 'primeng/api';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {Router} from '@angular/router';
import {Role, RoleEnum} from '../../../shared/model/role';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {ExportService} from '../../../shared/service/export.service';
import {UtilService} from '../../../core/service/util.service';
import {AuthService} from '../../../auth/auth.service';
import {FeatureEnum} from '../../../shared/model/feature.enum';

@Component({
  selector: 'aw-role-data',
  templateUrl: './role-data.component.html',
  styles: [
  ]
})
export class RoleDataComponent extends BaseComponent implements OnInit {
  formFilter: FormGroup;
  statusList: SelectItem[] = [];
  roleList: Role[] = [];
  roleConst = RoleEnum;
  page = 0;
  isHasInsert = false;
  isHasEdit = false;
  isHasDel = false;
  isHasExport = false;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private indicator: IndicatorService,
    private router: Router,
    private dialog: ConfirmationService,
    private messageService: MessageService,
    private exportService: ExportService,
    private util: UtilService,
    private auth: AuthService
  ) {
    super();
    this.initForm();
    this.isHasInsert = this.auth.isHasRole(FeatureEnum.ROLE, RoleEnum.ACTION_INSERT);
    this.isHasEdit = this.auth.isHasRole(FeatureEnum.ROLE, RoleEnum.ACTION_EDIT);
    this.isHasDel = this.auth.isHasRole(FeatureEnum.ROLE, RoleEnum.ACTION_DELETE);
    this.isHasExport = this.auth.isHasRole(FeatureEnum.ROLE, RoleEnum.ACTION_EXPORT);
  }

  ngOnInit(): void {
    this.roleService.setPage('');
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.all, value: null },
        { label: res.active, value: RoleEnum.STATUS_ACTIVE },
        { label: res.inactive, value: RoleEnum.STATUS_INACTIVE }
      ];
    });
    this.searchRole();
  }

  doRefresh() {
    this.initForm();
    this.searchRole();
  }

  searchRole() {
    this.indicator.showActivityIndicator();
    const value = this.formFilter.value;
    this.roleService.getRoleList(value.name, value.status).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.page = 0;
      this.roleList = res;
    });
  }

  doExportExcel() {
    if (this.isHasExport) {
      this.indicator.showActivityIndicator();
      this.roleService.exportRole().pipe(
        takeUntil(this.nextOnDestroy),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe(res => {
        const myBlob: Blob = new Blob([res], { type: 'application/ms-excel' });
      });
    }
  }

  initForm() {
    this.formFilter = this.fb.group({
      name: [''],
      status: [null]
    });
  }

  gotoCreate() {
    this.router.navigate(['role', 'create']);
  }

  gotoUpdate(role: Role) {
    this.router.navigate(['role', 'update', role.id]);
  }

  doDelete(role: Role) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('message.delete'),
      message: this.translate.instant('message.confirmDelete', { name: role.name }),
      acceptLabel: this.translate.instant('btn.yes'),
      rejectLabel: this.translate.instant('btn.no'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.roleService.deleteRole(role.id).subscribe(_ => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.deleteSuccess')
          });
          this.searchRole();
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('message.notFound')
            });
          } else if (err instanceof ApiErrorResponse && err.code === '205') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('message.notPermission')
            });
          } else {
            throw err;
          }
        });
      }
    });
  }

}
