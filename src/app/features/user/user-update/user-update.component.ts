import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize, map, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../../core/base.component';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {BranchUser, UserDetail, UserData, UserInfo} from '../model/user';
import {TagDetail, TagsUser} from '../../tags/model/tags';
import {UtilService} from '../../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {TagsService} from '../../tags/service/tags.service';
import {BranchService} from '../../../shared/service/branch.service';
import {Role, RoleEnum, UserRole} from '../../../shared/model/role';
import {Unit} from '../../../shared/model/unit';
import {Department} from '../../../shared/model/department';
import {RoleService} from '../../../shared/service/role.service';
import {UnitService} from '../../../shared/service/unit.service';
import {DepartmentService} from '../../../shared/service/department.service';
import {forkJoin} from 'rxjs';
import {xorBy} from 'lodash-es';

@Component({
  selector: 'aw-user-update',
  templateUrl: './user-update.component.html',
  styles: [
  ],
  providers: [RoleService, UnitService, BranchService, DepartmentService]
})
export class UserUpdateComponent extends BaseComponent implements OnInit {
  initValue: UserDetail;
  roleList: Role[] = [];
  unitList: Unit[] = [];
  departmentList: Department[] = [];
  branchList = [];
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private router: Router,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService,
    private roleService: RoleService,
    private unitService: UnitService,
    private branchService: BranchService,
    private departmentService: DepartmentService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.userService.setPage('update');
    const obsUserInfo = this.userService.getUserInfo(
      this.route.snapshot.paramMap.get('id')
    );

    this.indicator.showActivityIndicator();
    const obsUnit = this.unitService.getAllUnit();
    const obsBranch = this.branchService.getBranchList();
    const obsDepartment = this.departmentService.getAllDepartment();
    const obsRole = this.roleService.getRoleList('', RoleEnum.STATUS_ACTIVE);
    forkJoin([obsUnit, obsBranch, obsDepartment, obsRole, obsUserInfo]).pipe(
      map(res => {
        if (this.util.canForEach(res[3]) && this.util.canForEach(res[4].userRoleList)) {
          res[3] = xorBy(res[3], res[4].userRoleList, 'id');
        }
        return res;
      }),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      this.unitList = res[0];
      this.branchList = res[1];
      this.departmentList = res[2];
      this.roleList = res[3];
      this.initValue = res[4];
    });
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
    const body: UserData = {
      user: info,
      userBranchList: userBranch,
      userRoleList: roleList
    };
    this.userService.updateUser(body).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.updateSuccess')
      });
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


}
