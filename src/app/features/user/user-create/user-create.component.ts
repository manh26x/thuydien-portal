import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Branch, UserDetail, UserInfo} from '../model/user';
import {UserService} from '../service/user.service';
import {UtilService} from '../../../core/service/util.service';
import {TagsUser} from '../../tags/model/tags';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {BeforeLeave} from '../../../core/model/before-leave';

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
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.userService.setPage('create');
  }

  doSave(value) {
    const info: UserInfo = {
      userName: value.userId,
      fullName: value.fullName,
      email: value.email,
      // password: value.password,
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
    const body: UserDetail = {
      user: info,
      userBranchList: userBranch,
      listTagKPI: userKpi,
      listTagNews: userNews,
      listTagQnA: userQna,
      listTagTool: userTool
    };
    this.userService.insertUser(body).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.insertSuccess')
      });
      this.isLeave = true;
      this.router.navigate(['user']);
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
    console.log(value);
  }

  doCancel() {
    this.router.navigate(['user']);
  }

  @HostListener('window:beforeunload')
  canLeave(): boolean {
    return this.isLeave;
  }

}
