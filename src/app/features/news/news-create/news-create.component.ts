import {Component, HostListener, OnInit} from '@angular/core';
import {NewsService} from '../service/news.service';
import {GroupViewState, MultiSelectItem, NewsInfoRequest} from '../model/news';
import {UtilService} from '../../../core/service/util.service';
import {TagDetail, Tags} from '../../tags/model/tags';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {concatMap, finalize, map, takeUntil} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {BeforeLeave} from '../../../core/model/before-leave';
import {forkJoin, Observable, of} from 'rxjs';
import {RoleService} from '../../../shared/service/role.service';
import {UnitService} from '../../../shared/service/unit.service';
import {TagsService} from '../../tags/service/tags.service';
import {BranchService} from '../../../shared/service/branch.service';
import {BaseComponent} from '../../../core/base.component';

@Component({
  selector: 'aw-news-create',
  templateUrl: './news-create.component.html'
})
export class NewsCreateComponent extends BaseComponent implements OnInit, BeforeLeave {
  isLeave = false;
  groupViewState: GroupViewState = {branchList: [], roleList: [], unitList: []};
  tagList: TagDetail[] = [];
  groupViewList: MultiSelectItem[] = [];
  constructor(
    private newsService: NewsService,
    private util: UtilService,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router,
    private roleService: RoleService,
    private unitService: UnitService,
    private tagService: TagsService,
    private branchService: BranchService
  ) {
    super();
  }

  ngOnInit(): void {
    this.newsService.setPage('create');
    this.indicator.showActivityIndicator();
    const obsTag = this.tagService.getAllTagNews();
    const obsBranch = this.branchService.getBranchList();
    const obsRole = this.roleService.getRoleActive();
    const obsUnit = this.unitService.getAllUnit();
    forkJoin([obsTag, obsBranch, obsRole, obsUnit]).pipe(
      takeUntil(this.nextOnDestroy),
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
        return { resTag: res[0], resBranch: branchMap, resRole: roleMap, resUnit: unitMap };
      }),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.groupViewState = { unitList: res.resUnit, roleList: res.resRole, branchList: res.resBranch };
      this.tagList = res.resTag;
      this.groupViewList = res.resBranch;
    });
  }

  doSave(evt, draft: boolean) {
    // 0: file docs 1: file image
    const listObs: Observable<string>[] = [];
    // file docs
    if (this.util.canForEach(evt.fileDocList)) {
      const listFormData: FormData = new FormData();
      listFormData.append('file', evt.fileDocList[0], evt.fileDocList[0].name);
      listObs.push(this.newsService.uploadFile(listFormData));
    } else {
      listObs.push(of(''));
    }
    // file image
    if (evt.fileImageList && evt.fileImageList.length > 0) {
      const listFormData: FormData = new FormData();
      listFormData.append('file', evt.fileImageList[0], evt.fileImageList[0].name);
      listObs.push(this.newsService.uploadFile(listFormData));
    } else {
      listObs.push(of(''));
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
        return this.newsService.createNews(body).pipe(
          finalize(() => this.indicator.hideActivityIndicator())
        );
      })
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        detail: draft ? this.translate.instant('message.draftSuccess') : this.translate.instant('message.insertSuccess')
      });
      this.isLeave = true;
      this.router.navigate(['news']);
    }, err => {
      this.indicator.hideActivityIndicator();
      throw err;
    });
  }

  doCancel() {
    this.router.navigate(['news']);
  }

  @HostListener('window:beforeunload')
  canLeave(): boolean {
    return this.isLeave;
  }

}
