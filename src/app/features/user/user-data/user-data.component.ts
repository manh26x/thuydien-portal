import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../core/base.component';
import {UserService} from '../service/user.service';
import {FilterUserRequest, UserBranch} from '../model/user';
import {Router} from '@angular/router';
import {UserEnum} from '../model/user.enum';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, delay, finalize, startWith, takeUntil} from 'rxjs/operators';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ApiErrorResponse} from '../../../core/model/error-response';

@Component({
  selector: 'aw-user-data',
  templateUrl: './user-data.component.html',
  styles: [`
    .supper-admin {
      color: #ffffff;
      background: #FEAC3E;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: inline-flex;
      justify-content: center;
      padding: 4px;
      font-size: 11px;
    }
  `]
})
export class UserDataComponent extends BaseComponent implements OnInit {
  public userConst = UserEnum;
  userList: UserBranch[] = [];
  searchForm: FormGroup;
  roleList = [];
  statusList = [];
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private dialog: ConfirmationService,
  ) {
    super();
    this.initSearchForm();
  }

  ngOnInit(): void {
    this.userService.setPage('');
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('const').pipe(res => res))
    ).subscribe(res => {
      this.statusList = [
        {code: -1, name: res.all},
        {code: UserEnum.ACTIVE, name: res.active},
        {code: UserEnum.INACTIVE, name: res.inactive}
      ];
      this.roleList = [
        {code: '', name: res.all},
        {code: UserEnum.ADMIN, name: res.roleAdmin},
        {code: UserEnum.SUPPER_ADMIN, name: res.supperAdmin},
      ];
    });
    this.getUserList();
  }

  getUserList() {
    this.indicator.showActivityIndicator();
    const request: FilterUserRequest = {
      keyword: this.searchForm.value.keySearch,
      role: this.searchForm.value.role.code,
      status: this.searchForm.value.status.code,
    };
    this.userService.filterUser(request).pipe(
      delay(300),
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.userList = res;
    });
  }

  gotoView(userId: string) {
    this.router.navigate(['user', 'view', userId]);
  }

  gotoUpdate(userId: string) {
    this.router.navigate(['user', 'update', userId]);
  }

  doDelete(user: UserBranch) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: this.translate.instant('confirm.deleteMessage', { name: user.userPortal.fullName }),
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.userService.deleteUser(user.userPortal.userId).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.deleteSuccess')
          });
          this.getUserList();
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('message.deleteNotFound')
            });
          } else {
            throw err;
          }
        });
      },
      reject: () => {}
    });
  }

  refreshSearch() {
    this.initSearchForm();
    this.getUserList();
  }

  gotoCreate() {
    this.router.navigate(['user', 'create']);
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      keySearch: [''], // username and fullname
      role: [{code: ''}],
      status: [{code: -1}]
    });
  }

}
