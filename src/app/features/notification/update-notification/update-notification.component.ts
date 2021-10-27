import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {NotificationService} from "../service/notification.service";
import {GroupViewState, MultiSelectItem} from "../../news/model/news";
import {UtilService} from "../../../core/service/util.service";
import {IndicatorService} from "../../../shared/indicator/indicator.service";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RoleService} from "../../../shared/service/role.service";
import {UnitService} from "../../../shared/service/unit.service";
import {TagsService} from "../../tags/service/tags.service";
import {BranchService} from "../../../shared/service/branch.service";
import {forkJoin, Observable, of} from "rxjs";
import {concatMap, finalize, map, switchMap, takeUntil} from "rxjs/operators";
import {NewsEnum} from "../../news/model/news.enum";
import {NotificationConst} from "../notification";

@Component({
  selector: 'aw-update-notification',
  templateUrl: './update-notification.component.html',
  styles: [
  ]
})
export class UpdateNotificationComponent extends BaseComponent implements OnInit {
  groupViewState: GroupViewState = {branchList: [], roleList: [], unitList: []};
  groupViewList: MultiSelectItem[];
  tagList = [];
  initValue: any;
  constructor(
    private notificationService: NotificationService,
    private util: UtilService,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router,
    private roleService: RoleService,
    private unitService: UnitService,
    private tagService: TagsService,
    private branchService: BranchService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationService.setPage('update');
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
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      switchMap(id => this.notificationService.detailNotification(id).pipe(
        concatMap((resNoti) => forkJoin([obsTag, obsBranch, obsRole, obsUnit]).pipe(
          map((res) => {
            const branchMap: MultiSelectItem[] = [];
            const roleMap: MultiSelectItem[] = [];
            const unitMap: MultiSelectItem[] = [];
            const userMap: string[] = [];
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
            const groupViewOfNotification: MultiSelectItem[] = [];
            console.log(resNoti);
            let listAnyId = [];
            switch (resNoti.notificationDetailDto.userViewType) {

              case NotificationConst.GROUP_VIEW_PERSON:
                listAnyId = resNoti.listAnyId;
                break;

              default:
                resNoti.listAnyId.forEach(e => {
                  groupViewOfNotification.push({
                    id: e.tagId, code: e.tagValue,
                    name: e.tagValue, display: `${e.tagId} - ${e.tagValue}`
                  });
                });
            }
            resNoti.newsDto.groupViewValue = groupViewOfNotification;
            return {
              resTag: res[0],
              resBranch: branchMap,
              resRole: roleMap,
              resUnit: unitMap,
              notiData: resNoti,
              resGroupView: groupViewOfNotification,
              listUser: listAnyId
            };
          })
        )),
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.groupViewState = { unitList: res.resUnit, roleList: res.resRole, branchList: res.resBranch };
      this.tagList = res.resTag;
      this.groupViewList = res.resGroupView;
      this.initValue = res.notiData;
    });

  }

  doSave(evt) {
    console.log(evt);
    // 0: file docs 1: file image
    const listObs: Observable<string>[] = [];
    // file image
    if (evt.fileImageList && evt.fileImageList.length > 0) {
      const listFormData: FormData = new FormData();
      listFormData.append('file', evt.fileImageList[0], evt.fileImageList[0].name);
      listObs.push(this.notificationService.uploadFile(listFormData));
    } else {
      listObs.push(of(''));
    }
    const value = evt.notification;
    const tagsInsert = [];
    if (this.util.canForEach(value.tags)) {
      value.tags.forEach(e => tagsInsert.push({tagId: e.id, tagValue: e.value}));
    }
    let groupView = [];
    if (this.util.canForEach(value.groupViewValue)) {
      value.groupViewValue.forEach(g => {
        groupView.push({idAny: g.id, anyValue: g.name});
      });
    } else {
      groupView = value.listAnyId.split(';').map(e => ({idAny: e, anyValue: e}));
    }
    value.listTags = tagsInsert;
    console.log(value);
    console.log(groupView);
    const body = {
      title: value.title,
      content: value.content,
      status: value.status.code,
      publishDate: value.publishDate,
      isDraft: evt.draft,
      userViewType: value.groupViewType,
      listAnyId: groupView,
      listTag: tagsInsert,
      coverImage: undefined
    };
    this.indicator.showActivityIndicator();
    forkJoin(listObs).pipe(
      concatMap(fileInfo => {
        body.coverImage = fileInfo[0];
        return this.notificationService.createNotification(body).pipe(
          finalize(() => this.indicator.hideActivityIndicator())
        );
      })
    ).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        detail: evt.draft ? this.translate.instant('message.draftSuccess') : this.translate.instant('message.insertSuccess')
      });
      this.router.navigate(['notification']);
    }, err => {
      this.indicator.hideActivityIndicator();
      throw err;
    });
  }

}
