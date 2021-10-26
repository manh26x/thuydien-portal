import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {NotificationService} from "../service/notification.service";
import {GroupViewState, MultiSelectItem} from "../../news/model/news";
import {forkJoin} from "rxjs";
import {finalize, map, takeUntil} from "rxjs/operators";
import {UtilService} from "../../../core/service/util.service";
import {IndicatorService} from "../../../shared/indicator/indicator.service";
import {RoleService} from "../../../shared/service/role.service";
import {UnitService} from "../../../shared/service/unit.service";
import {TagsService} from "../../tags/service/tags.service";
import {BranchService} from "../../../shared/service/branch.service";

@Component({
  selector: 'aw-create-notifcation',
  templateUrl: './create-notification.component.html',
  styles: [
  ]
})
export class CreateNotificationComponent extends BaseComponent implements OnInit {
  groupViewState: GroupViewState = {branchList: [], roleList: [], unitList: []};
  groupViewList: MultiSelectItem[];
  tagList = [];
  constructor(
    private notificationService: NotificationService,
    private util: UtilService,
    private indicator: IndicatorService,
    private roleService: RoleService,
    private unitService: UnitService,
    private tagService: TagsService,
    private branchService: BranchService
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationService.setPage('create');
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

}
