import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BaseComponent} from '../../../core/base.component';
import {RoleService} from '../service/role.service';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, finalize, startWith, takeUntil} from 'rxjs/operators';
import {ConfirmationService, MessageService, SelectItem} from 'primeng/api';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {Router} from '@angular/router';
import {Role, RoleEnum} from '../../../shared/model/role';
import {ApiErrorResponse} from '../../../core/model/error-response';

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
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private indicator: IndicatorService,
    private router: Router,
    private dialog: ConfirmationService,
    private messageService: MessageService
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    this.roleService.setPage('');
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.all, value: '' },
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
      this.roleList = res;
    });
  }

  initForm() {
    this.formFilter = this.fb.group({
      name: [''],
      status: ['']
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
