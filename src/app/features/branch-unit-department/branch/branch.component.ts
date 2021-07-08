import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchService} from './branch.service';
import {BranchFilterRequest, BranchFilterResponse} from './model/branch';
import {concatMap, finalize,  startWith, takeUntil} from 'rxjs/operators';
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
  isCreated: boolean;
  isUpdated: boolean;
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
  statusList: any;
  branchForm: FormGroup;

  branchList: Array<BranchFilterResponse> = [];
  display = false;
  brandRequestSearch: BranchFilterRequest;

  page = 0;
  pageSize = 10;
  totalItems: any;

  /* Search Form Feature */
  ngOnInit(): void {
    this.initFormFilter();
  }
  ngAfterViewInit(): void {
    this.doFilter();
    this.initStatusList();
  }
  initFormFilter() {
    this.formFilter = this.fb.group({
      searchValue: ['']
    });
  }
  changePage(eve: any) {
    if (this.page !== eve.page || this.pageSize !== eve.rows) {
      this.page = eve.page;
      this.pageSize = eve.rows;
      this.getListBranch();
    }
  }

  lazyLoadBranch( evt: LazyLoadEvent) {
  this.sortBy = evt.sortField;
  this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
  this.getListBranch();
  }

  doFilter() {
    this.paging.changePage(0);
    this.getListBranch();
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
      this.totalItems = res.totalElements;
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
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('branch.message.deleteSuccess')
          });
          this.getListBranch();
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
      status: ['1', [Validators.required]],
      notes: ['', [Validators.maxLength(100)]],
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
    if (!this.branchForm.invalid) {
      const body = this.branchForm.value;
      body.address = body.notes;

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
          throw err;
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
      notes: [branches.address, [Validators.maxLength(100)]],
    });
    this.showDialog();
    this.isCreated = false;
    this.isUpdated = true;
  }
}
