import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {concatMap, finalize, map, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../../core/base.component';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {Branch, UpdateUserRequest, UserDetail, UserInfo} from '../model/user';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TagsUser} from '../../tags/model/tags';
import {UtilService} from '../../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {ApiErrorResponse} from '../../../core/model/error-response';

@Component({
  selector: 'aw-user-update',
  templateUrl: './user-update.component.html',
  styles: [
  ]
})
export class UserUpdateComponent extends BaseComponent implements OnInit {
  initValue: UserDetail;
  formChangePass: FormGroup;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private router: Router,
    private fb: FormBuilder,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService
  ) {
    super();
    this.initFormChangePass();
  }

  ngOnInit(): void {
    this.userService.setPage('update');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap(id => this.userService.getUserInfo(id).pipe(
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.initValue = res;
    });
  }

  doSave(value) {
    if (this.formChangePass.invalid) {
      this.util.validateAllFields(this.formChangePass);
      return;
    }
    this.indicator.showActivityIndicator();
    const passValue = this.formChangePass.value;
    const info: UserInfo = {
      userName: value.userId,
      fullName: value.fullName,
      email: value.email,
      phone: value.phone,
      position: value.position,
      role: value.role.code,
      statusCode: value.status.code
    };
    const userBranch: Branch[] = [];
    if (this.util.canForEach(value.branch)) {
      value.branch.forEach(br => {
        userBranch.push({
          branchId: br.id,
          branchName: br.name,
          branchAddress: br.address,
          userId: ''
        });
      });
    }
    const userQna: TagsUser[] = [];
    if (this.util.canForEach(value.tagQna)) {
      value.tagQna.forEach(t => {
        userQna.push({
          tagId: t.tagId,
          tagValue: t.tagValue,
          tagKey: t.tagKey
        });
      });
    }
    const userNews: TagsUser[] = [];
    if (this.util.canForEach(value.tagNews)) {
      value.tagNews.forEach(t => {
        userNews.push({
          tagId: t.tagId,
          tagValue: t.tagValue,
          tagKey: t.tagKey
        });
      });
    }
    const userTool: TagsUser[] = [];
    if (this.util.canForEach(value.tagTool)) {
      value.tagTool.forEach(t => {
        userTool.push({
          tagId: t.tagId,
          tagValue: t.tagValue,
          tagKey: t.tagKey
        });
      });
    }
    const userKpi: TagsUser[] = [];
    if (this.util.canForEach(value.tagKpi)) {
      value.tagKpi.forEach(t => {
        userKpi.push({
          tagId: t.tagId,
          tagValue: t.tagValue,
          tagKey: t.tagKey
        });
      });
    }

    const body: UpdateUserRequest = {
      userPortal: info,
      userBranchList: userBranch,
      listTagKPI: userKpi,
      listTagNews: userNews,
      listTagQnA: userQna,
      listTagTool: userTool,
      isChangePassword: passValue.isChangePass ? 1 : 0,
      currentPassword: passValue.currentPass
    };
    this.userService.updateUser(body).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(() => {
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
      } else if (err instanceof ApiErrorResponse && err.code === '402') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('message.passwordNotMatch')
        });
      } else {
        throw err;
      }
    });
  }

  doCancel() {
    this.router.navigate(['user']);
  }

  initFormChangePass() {
    this.formChangePass = this.fb.group({
      isChangePass: [false],
      currentPass: [''],
      newPass: ['']
    });
  }

}
