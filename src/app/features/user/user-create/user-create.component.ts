import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BranchUser, UserData, UserInfo} from '../model/user';
import {UserService} from '../service/user.service';
import {UtilService} from '../../../core/service/util.service';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {BeforeLeave} from '../../../core/model/before-leave';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {finalize} from 'rxjs/operators';
import {Role, RoleEnum, UserRole} from '../../../shared/model/role';
import {forkJoin} from 'rxjs';
import {RoleService} from '../../../shared/service/role.service';
import {UnitService} from '../../../shared/service/unit.service';
import {BranchService} from '../../../shared/service/branch.service';
import {DepartmentService} from '../../../shared/service/department.service';
import {Unit} from '../../../shared/model/unit';
import {Department} from '../../../shared/model/department';

@Component({
  selector: 'aw-user-create',
  templateUrl: './user-create.component.html',
  styles: [
  ],
  providers: [RoleService, UnitService, BranchService, DepartmentService]
})
export class UserCreateComponent implements OnInit, BeforeLeave {
  isLeave = false;
  roleList: Role[] = [];
  unitList: Unit[] = [];
  departmentList: Department[] = [];
  branchList = [];
  constructor(
    private router: Router,
    private userService: UserService,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService,
    private indicator: IndicatorService,
    private roleService: RoleService,
    private unitService: UnitService,
    private branchService: BranchService,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.userService.setPage('create');
    this.indicator.showActivityIndicator();
    const obsUnit = this.unitService.getAllUnit();
    const obsBranch = this.branchService.getBranchList();
    const obsDepartment = this.departmentService.getAllDepartment();
    const obsRole = this.roleService.getRoleList('', RoleEnum.STATUS_ACTIVE);
    forkJoin([obsUnit, obsBranch, obsDepartment, obsRole]).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // const firstUnitOption: Unit = { id: null, name: this.translate.instant('selectUnit') };
      this.unitList = res[0];
      this.branchList = res[1];
      // const firstDepartmentOption = { id: null, name: this.translate.instant('selectDepartment') };
      this.departmentList = res[2];
      this.roleList = res[3];
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
      role: 'Admin',
      userType: value.typeUser
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
    this.userService.insertUser(body).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.insertSuccess')
      });
      this.isLeave = true;
      this.router.navigate(['user'], { queryParams: {index: 1}});
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '202') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('message.insertExisted')
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
