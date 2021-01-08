import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BranchUser, UserDetail, UserInfo} from '../model/user';
import {UserService} from '../service/user.service';
import {UtilService} from '../../../core/service/util.service';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {BeforeLeave} from '../../../core/model/before-leave';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {finalize} from 'rxjs/operators';
import {UserRole} from '../../../shared/model/role';

@Component({
  selector: 'aw-user-create',
  templateUrl: './user-create.component.html',
  styles: [
  ]
})
export class UserCreateComponent implements OnInit, BeforeLeave {
  isLeave = false;
  constructor(
    private router: Router,
    private userService: UserService,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService,
    private indicator: IndicatorService
  ) { }

  ngOnInit(): void {
    this.userService.setPage('create');
  }

  doSave(value) {
    this.indicator.showActivityIndicator();
    const info: UserInfo = {
      id: value.userId,
      userName: value.userId,
      fullName: value.fullName,
      email: value.email,
      phone: value.phone,
      position: value.position,
      status: value.status.code,
      departmentId: value.department.id,
      unitId: value.unit.id,
      role: 'Admin'
    };
    const userBranch: BranchUser[] = [];
    if (this.util.canForEach(value.branch)) {
     value.branch.forEach(br => {
       userBranch.push({
         branchId: br.code,
       });
     });
    }
    const roleList: UserRole[] = [];
    if (this.util.canForEach(value.role)) {
      value.role.forEach(item => {
        roleList.push({ roleId: item.id });
      });
    }
    const body: UserDetail = {
      user: info,
      userBranchList: userBranch,
      userRoleList: roleList
    };
    this.userService.insertUser(body).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.updateSuccess')
      });
      this.isLeave = true;
      this.router.navigate(['user']);
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '201') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('message.updateNotFound')
        });
      } else if (err instanceof ApiErrorResponse && err.code === '205') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('message.updateNotPermission')
        });
      } else {
        throw err;
      }
    });
  }

  doCancel() {
    this.router.navigate(['user']);
  }

  @HostListener('window:beforeunload')
  canLeave(): boolean {
    return this.isLeave;
  }

}
