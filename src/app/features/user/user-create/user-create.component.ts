import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BranchUser, UserDetail, UserInfo} from '../model/user';
import {UserService} from '../service/user.service';
import {UtilService} from '../../../core/service/util.service';
import {TagsUser} from '../../tags/model/tags';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {BeforeLeave} from '../../../core/model/before-leave';
import {TagsEnum} from '../../tags/model/tags.enum';
import {forkJoin} from 'rxjs';
import {TagsService} from '../../tags/service/tags.service';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {finalize} from 'rxjs/operators';
import {BranchService} from '../../../shared/service/branch.service';

@Component({
  selector: 'aw-user-create',
  templateUrl: './user-create.component.html',
  styles: [
  ],
  providers: [TagsService, BranchService]
})
export class UserCreateComponent implements OnInit, BeforeLeave {
  isLeave = false;
  branchList = [];
  tagNewsList: TagsUser[];
  tagKpiList: TagsUser[];
  constructor(
    private router: Router,
    private userService: UserService,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService,
    private tagService: TagsService,
    private indicator: IndicatorService,
    private branchService: BranchService
  ) { }

  ngOnInit(): void {
    this.userService.setPage('create');
    this.indicator.showActivityIndicator();
    const obsTagNews = this.filterTagByType('', TagsEnum.NEWS);
    const obsTagKpi = this.filterTagByType('', TagsEnum.KPI);
    const obsBranch = this.branchService.getBranchList();
    forkJoin([obsBranch, obsTagNews, obsTagKpi]).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.branchList = res[0];
      this.tagNewsList = res[1].tagsList;
      this.tagKpiList = res[2].tagsList;
    });
  }

  filterTagByType(query, type) {
    return this.tagService.searchTagExp({tagType: [type], sortOrder: 'ASC', sortBy: 'id', page: 0, pageSize: 500, searchValue: query });
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
      role: value.role.code,
      status: value.status.code,
      userType: '',
      avatar: ''
    };
    const userBranch: BranchUser[] = [];
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
      listTagNews: userNews
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
