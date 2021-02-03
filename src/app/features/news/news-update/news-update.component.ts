import { Component, OnInit } from '@angular/core';
import {NewsService} from '../service/news.service';
import {GroupViewState, MultiSelectItem, NewsDetail, NewsInfoRequest} from '../model/news';
import {ActivatedRoute, Router} from '@angular/router';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {concatMap, finalize, map, switchMap, takeUntil} from 'rxjs/operators';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {BaseComponent} from '../../../core/base.component';
import {TagDetail, Tags} from '../../tags/model/tags';
import {UtilService} from '../../../core/service/util.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../../auth/auth.service';
import {UserAuth} from '../../../auth/model/user-auth';
import {forkJoin, Observable, of} from 'rxjs';
import {NewsEnum} from '../model/news.enum';
import {RoleService} from '../../../shared/service/role.service';
import {UnitService} from '../../../shared/service/unit.service';
import {TagsService} from '../../tags/service/tags.service';
import {BranchService} from '../../../shared/service/branch.service';

@Component({
  selector: 'aw-news-update',
  templateUrl: './news-update.component.html'
})
export class NewsUpdateComponent extends BaseComponent implements OnInit {
  initValue: NewsDetail;
  userLogged: UserAuth;
  groupViewState: GroupViewState = {branchList: [], roleList: [], unitList: []};
  tagList: TagDetail[] = [];
  groupViewList: MultiSelectItem[] = [];
  constructor(
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService,
    private auth: AuthService,
    private roleService: RoleService,
    private unitService: UnitService,
    private tagService: TagsService,
    private branchService: BranchService
  ) {
    super();
    this.userLogged = this.auth.getUserInfo();
  }

  ngOnInit(): void {
    this.newsService.setPage('update');
    this.indicator.showActivityIndicator();
    const obsTag = this.tagService.getAllTagNews();
    const obsBranch = this.branchService.getBranchList();
    const obsRole = this.roleService.getRoleActive();
    const obsUnit = this.unitService.getAllUnit();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      switchMap(id => this.newsService.getNewsDetail(id).pipe(
        concatMap((resNews) => forkJoin([obsTag, obsBranch, obsRole, obsUnit]).pipe(
          map((res) => {
            const branchMap: MultiSelectItem[] = [];
            const roleMap: MultiSelectItem[] = [];
            const unitMap: MultiSelectItem[] = [];
            if (this.util.canForEach(res[1])) {
              res[1].forEach((branch) => {
                branchMap.push({id: branch.code, code: branch.code, name: branch.name, display: `${branch.code} - ${branch.name}`});
              });
            }
            if (this.util.canForEach(res[2])) {
              res[2].forEach((role) => {
                roleMap.push({id: role.id, code: '', name: role.name, display: role.name});
              });
            }
            if (this.util.canForEach(res[3])) {
              res[3].forEach((unit) => {
                unitMap.push({id: unit.id.toString(), code: '', name: unit.name, display: unit.name});
              });
            }
            // get group view
            const groupViewOfNews: MultiSelectItem[] = [];
            let groupViewCurrent: MultiSelectItem[] = [];
            switch (resNews.newsDto.userViewType) {
              case NewsEnum.GROUP_VIEW_BRANCH:
                if (this.util.canForEach(resNews.listBranch)) {
                  resNews.listBranch.forEach(branch => {
                    groupViewOfNews.push({
                      id: branch.code, code: branch.code,
                      name: branch.name, display: `${branch.code} - ${branch.name}`
                    });
                  });
                }
                groupViewCurrent = branchMap;
                break;
              case NewsEnum.GROUP_VIEW_ROLE:
                if (this.util.canForEach(resNews.listRole)) {
                  resNews.listRole.forEach(role => {
                    groupViewOfNews.push({id: role.id, code: '', name: role.name, display: role.name});
                  });
                }
                groupViewCurrent = roleMap;
                break;
              case NewsEnum.GROUP_VIEW_UNIT:
                if (this.util.canForEach(resNews.listUnit)) {
                  resNews.listUnit.forEach(unit => {
                    groupViewOfNews.push({id: unit.id.toString(), code: '', name: unit.name, display: unit.name});
                  });
                }
                groupViewCurrent = unitMap;
                break;
            }
            resNews.newsDto.groupViewValue = groupViewOfNews;
            return {
              resTag: res[0],
              resBranch: branchMap,
              resRole: roleMap,
              resUnit: unitMap,
              newsData: resNews,
              resGroupView: groupViewCurrent
            };
          })
        )),
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.groupViewState = { unitList: res.resUnit, roleList: res.resRole, branchList: res.resBranch };
      this.tagList = res.resTag;
      this.groupViewList = res.resGroupView;
      this.initValue = res.newsData;
    });
  }

  doSave(evt, draft) {
    // 0: file docs 1: file image
    const listObs: Observable<string>[] = [];
    // file docs
    if (evt.isChangeDoc && this.util.canForEach(evt.fileDocList)) {
      const listFormData: FormData = new FormData();
      listFormData.append('file', evt.fileDocList[0], evt.fileDocList[0].name);
      listObs.push(this.newsService.uploadFile(listFormData));
    } else {
      listObs.push(of(evt.news.docs));
    }
    // file image
    if (evt.isChangeImage && evt.fileImageList && evt.fileImageList.length > 0) {
      const listFormData: FormData = new FormData();
      listFormData.append('file', evt.fileImageList[0], evt.fileImageList[0].name);
      listObs.push(this.newsService.uploadFile(listFormData));
    } else {
      listObs.push(of(evt.news.image));
    }

    const value = evt.news;
    const tagsInsert: Tags[] = [];
    if (this.util.canForEach(value.tags)) {
      value.tags.forEach(t => {
        tagsInsert.push({
          idTag: t.id
        });
      });
    }
    const groupView: string[] = [];
    if (this.util.canForEach(value.groupViewValue)) {
      value.groupViewValue.forEach(g => {
        groupView.push(g.id);
      });
    }
    const body: NewsInfoRequest = {
      id: value.id,
      title: value.title,
      shortContent: value.shortContent,
      content: value.content,
      filePath: '',
      imgPath: '',
      listNewsTag: tagsInsert,
      listAnyId: groupView,
      priority: value.level,
      publishTime: value.publishDate,
      sendNotification: value.isSendNotification ? 1 : 0,
      isDraft: draft ? 1 : 0,
      userViewType: value.groupViewType
    };
    this.indicator.showActivityIndicator();
    forkJoin(listObs).pipe(
      concatMap(fileInfo => {
        body.filePath = fileInfo[0];
        body.imgPath = fileInfo[1];
        return this.newsService.updateNews(body).pipe(
          finalize(() => this.indicator.hideActivityIndicator())
        );
      })
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.updateSuccess')
      });
      this.router.navigate(['news']);
    }, err => {
      this.indicator.hideActivityIndicator();
      if (err instanceof ApiErrorResponse && err.code === '201') {
        this.messageService.add({
          severity: 'error',
          detail: draft ? this.translate.instant('message.draftSuccess') : this.translate.instant('message.updateNotFound')
        });
      } else {
        throw err;
      }
    });
  }

  doCancel() {
    this.router.navigate(['news']);
  }

}
