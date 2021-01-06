import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../core/base.component';
import {UserService} from '../service/user.service';
import {FilterUserData, FilterUserRequest, FilterUserResponse, UserBranch} from '../model/user';
import {Router} from '@angular/router';
import {UserEnum} from '../model/user.enum';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, delay, finalize, startWith, takeUntil} from 'rxjs/operators';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {UserAuth} from '../../../auth/model/user-auth';
import {AuthService} from '../../../auth/auth.service';
import {DialogService} from 'primeng/dynamicdialog';
import {DialogPreviewComponent} from '../dialog-preview/dialog-preview.component';
import {PageChangeEvent} from '../../../shared/model/page-change-event';

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
  `],
  providers: [DialogService]
})
export class UserDataComponent extends BaseComponent implements OnInit {
  public userConst = UserEnum;
  userList: FilterUserData[] = [];
  searchForm: FormGroup;
  roleList = [];
  statusList = [];
  userLogged: UserAuth;
  fileImport: any[];
  sortBy = 'pubDate';
  sortOrder = 'DESC';
  page = 0;
  pageSize = 10;
  totalItem = 0;
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private auth: AuthService,
    private dialogService: DialogService
  ) {
    super();
    this.userLogged = this.auth.getUserInfo();
    this.initSearchForm();
  }

  ngOnInit(): void {
    this.userService.setPage('');
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const').pipe(res => res))
    ).subscribe(res => {
      this.statusList = [
        {code: null, name: res.all},
        {code: UserEnum.ACTIVE, name: res.active},
        {code: UserEnum.INACTIVE, name: res.inactive}
      ];
      this.roleList = [
        {code: '', name: res.all},
        {code: UserEnum.ADMIN, name: res.roleAdmin},
        {code: UserEnum.SUPPER_ADMIN, name: res.supperAdmin},
      ];
    });
    // this.getUserList();
  }

  doChangeFile(files) {
    this.fileImport = files;
  }

  doCheckFile() {
    if (this.fileImport) {
      const fileFormData: FormData = new FormData();
      fileFormData.append('file', this.fileImport[0], this.fileImport[0].name);
      this.userService.readImportFile(fileFormData).subscribe(res => {
        this.userService.logDebug(res);
        this.dialogService.open(DialogPreviewComponent, {
          data: res,
          header: 'Danh sách tài khoản',
          width: '90%',
          styleClass: 'large-dialog'
        });
      });
    }
  }

  lazyLoadUser(evt: LazyLoadEvent) {
    this.sortBy = evt.sortField;
    this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
    this.getUserList();
  }

  changePage(evt: PageChangeEvent) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.getUserList();
  }

  getUserList() {
    this.indicator.showActivityIndicator();
    const request: FilterUserRequest = {
      keyword: this.searchForm.value.keySearch,
      role: this.searchForm.value.role.code,
      status: this.searchForm.value.status.code,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      page: this.page,
      pageSize: this.pageSize
    };
    this.userService.filterUser(request).pipe(
      delay(300),
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.userList = res.listUser;
      this.totalItem = res.totalRecord;
    });
  }

  gotoView(userId: string) {
    this.router.navigate(['user', 'view', userId]);
  }

  gotoUpdate(userId: string) {
    this.router.navigate(['user', 'update', userId]);
  }

  doDelete(user: UserBranch) {
    this.confirmationService.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: this.translate.instant('confirm.deleteMessage', { name: user.user.fullName }),
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.userService.deleteUser(user.user.fullName).subscribe(() => {
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
      keySearch: [''], // username and fullName
      role: [{code: ''}],
      status: [{code: UserEnum.STATUS_ALL}]
    });
  }

}
