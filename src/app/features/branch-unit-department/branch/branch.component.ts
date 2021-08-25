import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchService} from './branch.service';
import {BranchFilterRequest, BranchFilterResponse} from './model/branch';
import {concatMap, finalize, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {Paginator} from 'primeng/paginator';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {AppTranslateService} from '../../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {BaseComponent} from '../../../core/base.component';
import {BranchEnum} from './model/branch.enum';
import {ApiErrorResponse} from '../../../core/model/error-response';

@Component({
  selector: 'aw-branch',
  templateUrl: './branch.component.html',
  styles: []
})
export class BranchComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('branchPaging') paging: Paginator;
  formFilter: FormGroup;
  sortBy: string;
  sortOrder: string;
  statusList = [];
  branchList: Array<BranchFilterResponse> = [];
  display = false;
  brandRequestSearch: BranchFilterRequest;
  page = 0;
  pageSize = 10;
  totalItems = 0;
  branchEnum = BranchEnum;

  isCreated: boolean;
  isUpdated: boolean;
  branchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private indicator: IndicatorService,
    private branchService: BranchService,
    private appTranslate: AppTranslateService,
    private translate: TranslateService,
    private messageService: MessageService,
    private dialog: ConfirmationService,
              ) {
    super();
  }

  /* Search Form Feature */
  ngOnInit(): void {
    this.initFormFilter();
  }
  ngAfterViewInit(): void {
    this.initStatusList();
  }
  initFormFilter() {
    this.formFilter = this.fb.group({
      searchValue: ['']
    });
  }
  changePage(eve: any) {
    this.page = eve.page;
    this.pageSize = eve.rows;
    this.getListBranch();
  }

  lazyLoadBranch( evt: LazyLoadEvent) {
    this.sortBy = evt.sortField;
    this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
    this.getListBranch();
  }

  doFilter() {
    this.paging.changePage(0);
  }

  getListBranch() {
    this.indicator.showActivityIndicator();
    this.branchList = [];
    this.totalItems = 0;
    // @ts-ignore
    this.brandRequestSearch  =  {
      keyword: this.formFilter.get('searchValue').value,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };
    this.branchService.filterBranch(this.brandRequestSearch).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.branchList = res.content;
      this.totalItems = res.totalElements ? res.totalElements : 0;
    });

  }
  deleteBranch(branch) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('branch.confirm.delete'),
      message: this.translate.instant('branch.confirm.deleteMessage', { name: branch.name }),
      acceptLabel: this.translate.instant('branch.confirm.accept'),
      rejectLabel: this.translate.instant('branch.confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.branchService.deleteBranch(branch.id).pipe(
          switchMap(async () => this.getListBranch())
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('branch.message.deleteSuccess')
          });
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('branch.message.deleteNotFound')
            });
          } else {
            throw err;
          }
        });
      },
    });
  }

 /* Branch Form Feature */
  initStatusList() {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.active, value: BranchEnum.STATUS_ACTIVE },
        { label: res.inActive, value: BranchEnum.STATUS_INACTIVE }
      ];
    });

  }

  gotoCreate() {
    this.initFormBranch();
    this.showDialog();
    this.isCreated = true;
    this.isUpdated = false;
  }
  initFormBranch() {
    this.branchForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(9)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      status: [BranchEnum.STATUS_ACTIVE, [Validators.required]],
      address: ['', [Validators.maxLength(100)]],
    });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.branchForm.get(controlName);
    if (control == null) {
      return false;
    }

    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  showDialog() {
    this.display = true;
  }

  submitBranchForm() {
    this.branchForm.get('code').setValue(this.branchForm.get('code').value.trim());
    this.branchForm.get('name').setValue(this.branchForm.get('name').value.trim());
    if (this.branchForm.get('address').value !== null) {
      this.branchForm.get('address').setValue(this.branchForm.get('address').value.trim());
    }
    if (!this.branchForm.invalid) {
      const body = this.branchForm.value;

      if (this.isCreated) {
        this.indicator.showActivityIndicator();
        this.branchService.createBranch(body).pipe().subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail:  this.translate.instant('branch.message.insertSuccess')
          });
          this.indicator.hideActivityIndicator();
          this.display = false;
          this.getListBranch();
        }, err => {
          this.indicator.hideActivityIndicator();
          throw err;
        });
      } else if (this.isUpdated) {
        this.indicator.showActivityIndicator();
        this.branchService.updateBranch(body).pipe().subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail:  this.translate.instant('branch.message.updateSuccess')
          });
          this.display = false;
          this.indicator.hideActivityIndicator();
          this.getListBranch();
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '202') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('message.branchExisted')
            });
          } else {
            throw err;
          }
        });
      }

    }
  }


  gotoUpdate(branches: any) {
    this.branchForm = this.fb.group({
      id: [branches.id],
      code: [branches.code, [Validators.required, Validators.maxLength(9)]],
      name: [branches.name, [Validators.required, Validators.maxLength(100)]],
      status: [branches.status, [Validators.required]],
      address: [branches.address, [Validators.maxLength(100)]],
    });
    this.showDialog();
    this.isCreated = false;
    this.isUpdated = true;
  }
}
