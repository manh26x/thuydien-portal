import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../core/base.component';
import {UserService} from '../service/user.service';
import {UserDetail, FilterUserRequest, UserBranch} from '../model/user';
import {Router} from '@angular/router';
import {UserEnum} from '../model/user.enum';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, delay, filter, finalize, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {AuthService} from '../../../auth/auth.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DialogPreviewComponent} from '../dialog-preview/dialog-preview.component';
import {PageChangeEvent} from '../../../shared/model/page-change-event';
import {RoleService} from '../../../shared/service/role.service';
import {Role, RoleEnum} from '../../../shared/model/role';
import {FeatureEnum} from '../../../shared/model/feature.enum';
import {UtilService} from '../../../core/service/util.service';
import { saveAs } from 'file-saver';
import {Paginator} from 'primeng/paginator';
import {BranchService} from '../../../shared/service/branch.service';

@Component({
  selector: 'aw-user-data',
  templateUrl: './user-data.component.html',
  styles: [],
  providers: [DialogService, RoleService, BranchService]
})
export class UserDataComponent extends BaseComponent implements OnInit {
  @ViewChild('userPaging') paging: Paginator;
  @Input('isApprove') isApprove: boolean;
  @ViewChild('checkAll')checkAll: any;

  userConst = UserEnum;
  userList: UserDetail[] = [];
  searchForm: FormGroup;
  roleList: Role[] = [];
  statusList = [];
  fileImport: any[];
  sortBy = 'pubDate';
  sortOrder = 'DESC';
  page = 0;
  pageSize = 10;
  totalItem = 0;
  isHasInsert = false;
  isHasImport = false;
  isHasExport = false;
  isHasEdit = false;
  isHasDel = false;
  maxShowBranchInit = 3;
  dialogRef: DynamicDialogRef = null;
  isHasApprove = true;
  selectedUser: UserDetail[];
  choosen = false;
  branchList = [];
  typeUserList = [];
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
    private dialogService: DialogService,
    private roleService: RoleService,
    private util: UtilService,
    private branchService: BranchService
  ) {
    super();
    this.isHasInsert = this.auth.isHasRole(FeatureEnum.USER, RoleEnum.ACTION_INSERT);
    this.isHasImport = this.auth.isHasRole(FeatureEnum.USER, RoleEnum.ACTION_IMPORT);
    this.isHasExport = this.auth.isHasRole(FeatureEnum.USER, RoleEnum.ACTION_EXPORT);
    this.isHasEdit = this.auth.isHasRole(FeatureEnum.USER, RoleEnum.ACTION_EDIT);
    this.isHasApprove = this.auth.isHasApproved(FeatureEnum.USER, RoleEnum.ACTION_APPROVE);
    this.isHasDel = this.auth.isHasRole(FeatureEnum.USER, RoleEnum.ACTION_DELETE);
    this.initSearchForm();
  }

  ngOnInit(): void {
    this.indicator.showActivityIndicator();
    this.userService.setPage('');
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const').pipe(
        map(res => res)
      )),
      switchMap(lang => this.roleService.getRoleActive().pipe(
        map((roles) => ({ resLang: lang, resRole: roles }))
      ))
    ).subscribe(res => {
      this.statusList = [
        {code: null, name: res.resLang.all},
        {code: UserEnum.ACTIVE, name: res.resLang.active},
        {code: UserEnum.INACTIVE, name: res.resLang.inactive}
      ];
      if (this.isApprove) {
        this.statusList = [
          {code: null, name: res.resLang.all},
          {code: UserEnum.ACTIVE, name: res.resLang.approved},
          {code: UserEnum.WAIT_APPROVE, name: res.resLang.waitApprove},
          {code: UserEnum.CANCEL, name: res.resLang.cancel},
          this.typeUserList = [
            {code: 'AlL', name: res.resLang.all}, // back-end quy dinh - anhlnd.pn
            {code: null, name: res.resLang.other},
            {code: UserEnum.CB, name: res.resLang.cb},
            {code: UserEnum.RB, name: res.resLang.rb},
          ]
        ];
      } else {
        this.statusList = [
          {code: null, name: res.resLang.all},
          {code: UserEnum.ACTIVE, name: res.resLang.active},
          {code: UserEnum.INACTIVE, name: res.resLang.inactive}
        ];

      }
      this.branchService.postBranchListOfUser().subscribe(branches => {
        this.branchList = branches;
        this.branchList.unshift({code: '', name: res.resLang.all});
      });
      this.roleList = res.resRole;
      this.roleList.unshift({
        id: null, name: res.resLang.all
      });
    });

  }

  doChangeFile(files) {
    this.fileImport = files;
  }

  doCheckFile() {
    if (this.fileImport) {
      this.indicator.showActivityIndicator();
      const fileFormData: FormData = new FormData();
      fileFormData.append('file', this.fileImport[0], this.fileImport[0].name);
      this.userService.readImportFile(fileFormData).pipe(
        takeUntil(this.nextOnDestroy),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe(res => {
        this.userService.logDebug(res);
        this.dialogRef = this.dialogService.open(DialogPreviewComponent, {
          data: res,
          header: this.translate.instant('list'),
          width: '90%',
          styleClass: 'large-dialog',
        });
        this.dialogRef.onClose.pipe(
          filter((result: boolean) => result)
        ).subscribe(_ => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.importSuccess')
          });
          this.getUserList();
        });
      });
    }
  }

  doFilterUser() {
    this.paging.changePage(0);
  }

  doExportUser() {
    this.indicator.showActivityIndicator();
    const request: FilterUserRequest = {
      keyword: this.searchForm.value.keySearch,
      role: this.searchForm.value.role.id,
      status: this.searchForm.value.status.code,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      page: this.page,
      pageSize: this.totalItem,
      userType: this.searchForm.value.userType.code
    };
    this.userService.exportUser(request).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      const myBlob: Blob = new Blob([res], { type: 'application/ms-excel' });
      saveAs(myBlob, 'user_list.xlsx');
    });
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
    debugger
    this.indicator.showActivityIndicator();
    const request: FilterUserRequest = {
      keyword: this.searchForm.value.keySearch,
      role: this.searchForm.value.role.id,
      status: this.searchForm.value.status.code,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      page: this.page,
      pageSize: this.pageSize,
      branchId: this.searchForm.value.branch.code,
      userType: this.searchForm.value.userType.code
    };

    this.userService.filterUser(request, this.isApprove).pipe(
      delay(300),
      takeUntil(this.nextOnDestroy),
      map(res => {
        if (this.util.canForEach(res.listUser)) {
          res.listUser.forEach(item => {
            item.maxShowBranch = this.maxShowBranchInit;
          });
        }
        return res;
      }),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.userList = res.listUser;
      this.totalItem = res.totalRecord;
    });
  }

  gotoView(userId: string) {
    this.router.navigate(['user', 'view', userId],  { queryParams: {isApprove: this.isApprove}});
  }

  gotoUpdate(userId: string) {
    this.router.navigate(['user', 'update', userId],{ queryParams: {isApprove: this.isApprove}});
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
        this.userService.deleteUser(user.user.userName).subscribe(() => {
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
      status: [{code: UserEnum.STATUS_ALL}],
      branch: [{code: UserEnum.STATUS_ALL}],
      userType: [{code: UserEnum.STATUS_ALL}]
    });

  }
  destroy() {
    super.destroy();
    // clear dynamic dialog
    if (this.dialogRef) {
      this.dialogRef.close(false);
    }
  }

  checkAllRows() {
    if (this.checkAll.checked) {
      this.selectedUser = [];

    } else {
      this.selectedUser = this.userList;
    }

  }


  gotoApprove(status: string) {
    if (this.selectedUser.length === 0) {
      return;
    }
    const userApprove = [];
    const userName = [];
    this.selectedUser.forEach(e => {
      userApprove.push({username: e.user.userName, status});
      userName.push(e.user.userName);
    });
    let msgResult = '';
    let confirmMsg = '';
    if (status === this.userConst.ACTIVE) {
      msgResult = this.translate.instant('message.approveSuccess');
      confirmMsg = this.translate.instant('confirm.approvedMessage', { name: userName });
    } else if (status === this.userConst.CANCEL) {
      msgResult = this.translate.instant('message.cancelSuccess');
      confirmMsg = this.translate.instant('confirm.cancelMessage', { name: userName });
    }
    this.confirmationService.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: confirmMsg,
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.userService.approved(userApprove).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: msgResult
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
}
