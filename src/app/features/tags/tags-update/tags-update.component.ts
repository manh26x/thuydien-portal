import { Component, OnInit } from '@angular/core';
import {BaseComponent} from '../../../core/base.component';
import {TagsService} from '../service/tags.service';
import {ActivatedRoute, Router} from '@angular/router';
import {concatMap, delay, finalize, map, takeUntil} from 'rxjs/operators';
import {TagsUpdateRequest, TagsUser} from '../model/tags';
import {UserInfo} from '../../user/model/user';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ApiErrorForbidden, ApiErrorResponse} from '../../../core/model/error-response';
import {UserAuth} from '../../../auth/model/user-auth';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'aw-tags-update',
  templateUrl: './tags-update.component.html',
  styles: [
  ]
})
export class TagsUpdateComponent extends BaseComponent implements OnInit {
  initValue: TagsUser;
  userLogged: UserAuth;
  constructor(
    private tagService: TagsService,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router,
    private auth: AuthService
  ) {
    super();
    this.userLogged = this.auth.getUserInfo();
  }

  ngOnInit(): void {
    this.tagService.setPage('update');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap(id => this.tagService.getDetail(id).pipe(
        delay(200),
        map(res => {
          if (!this.userLogged.isSupperAdmin && this.userLogged.userName !== res.createBy) {
            throw new ApiErrorForbidden('', '');
          }
          return res;
        }),
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.initValue = res;
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '201') {
        this.router.navigate(['public', 'not-found']);
      } else {
        throw err;
      }
    });
  }

  doUpdate(value: any) {
    this.indicator.showActivityIndicator();
    const body: TagsUpdateRequest = {
      tagId: value.id,
      tagValue: value.name,
      keyTag: value.code,
      tagType: value.type.code,
      tagStatus: value.status.code
    };
    this.tagService.updateTags(body).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.updateSuccess')
      });
      this.router.navigate(['tags']);
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '201') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('message.updateNotFound')
        });
      } else {
        throw err;
      }
    });
  }

  doCancel() {
    this.router.navigate(['tags']);
  }

}
