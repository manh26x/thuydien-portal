import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize, map, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../../core/base.component';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {BranchUser, UpdateUserRequest, UserDetail, UserInfo} from '../model/user';
import {TagsUser} from '../../tags/model/tags';
import {UtilService} from '../../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {TagsService} from '../../tags/service/tags.service';
import {TagsEnum} from '../../tags/model/tags.enum';
import {forkJoin} from 'rxjs';
import {xorBy} from 'lodash-es';
import {BranchService} from '../../../shared/service/branch.service';

@Component({
  selector: 'aw-user-update',
  templateUrl: './user-update.component.html',
  styles: [
  ],
  providers: [TagsService, BranchService]
})
export class UserUpdateComponent extends BaseComponent implements OnInit {
  initValue: UserDetail;
  branchList = [];
  tagNewsList: TagsUser[];
  tagKpiList: TagsUser[];
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private router: Router,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService,
    private tagService: TagsService,
    private branchService: BranchService
  ) {
    super();
  }

  ngOnInit(): void {
    this.userService.setPage('update');
    this.indicator.showActivityIndicator();
    const obsTagNews = this.filterTagByType('', TagsEnum.NEWS);
    const obsTagKpi = this.filterTagByType('', TagsEnum.KPI);
    const obsBranch = this.branchService.getBranchList();
    const obsUserInfo = this.userService.getUserInfo(
      this.route.snapshot.paramMap.get('id')
    );
    forkJoin([obsBranch, obsTagNews, obsTagKpi, obsUserInfo]).pipe(
      takeUntil(this.nextOnDestroy),
      map(res => {
        if (this.util.canForEach(res[3].listTagNews)) {
          res[1].tagsList = xorBy(res[1].tagsList, res[3].listTagNews, 'tagId');
        }
        if (this.util.canForEach(res[3].listTagKPI)) {
          res[2].tagsList = xorBy(res[2].tagsList, res[3].listTagKPI, 'tagId');
        }
        return res;
      }),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.branchList = res[0];
      this.tagNewsList = res[1].tagsList;
      this.tagKpiList = res[2].tagsList;
      this.initValue = res[3];
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
    this.userService.updateUser(body).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.insertSuccess')
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
