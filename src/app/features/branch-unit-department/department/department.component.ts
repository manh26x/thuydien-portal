import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Paginator} from 'primeng/paginator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {DepartmentService} from './department.service';
import {AppTranslateService} from '../../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {DepartmentFilterRequest, DepartmentFilterResponse} from './model/department';
import {concatMap, finalize, startWith, takeUntil} from 'rxjs/operators';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {DepartmentEnum} from './model/department.enum';
import {BaseComponent} from '../../../core/base.component';

@Component({
  selector: 'aw-department',
  templateUrl: './department.component.html',
  styles: [
  ]
})
export class DepartmentComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('departmentPaging') paging: Paginator;
  formFilter: FormGroup;
  sortBy: string;
  sortOrder: string;
  page = 0;
  pageSize = 10;
  totalItems = 0;
  statusList = [];
  departmentRequestSearch: DepartmentFilterRequest;
  departmentList: Array<DepartmentFilterResponse> = [];

  departmentForm: FormGroup;
  display = false;
  isCreated: boolean;
  isUpdated: boolean;
  departmentEnum = DepartmentEnum;
  constructor(
      private fb: FormBuilder,
      private indicator: IndicatorService,
      private departmentService: DepartmentService,
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
  changePage(eve) {
    this.page = eve.page;
    this.pageSize = eve.rows;
    this.getListDepartment();
  }

  lazyLoadDepartment( evt: LazyLoadEvent) {
    this.sortBy = evt.sortField;
    this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
    this.getListDepartment();
  }

  doFilter() {
    this.paging.changePage(0);
  }

  getListDepartment() {
    this.indicator.showActivityIndicator();
    this.departmentList = [];
    this.totalItems = 0;
    // @ts-ignore
    this.departmentRequestSearch  =  {
      keyword: this.formFilter.get('searchValue').value,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };
    this.departmentService.filterDepartment(this.departmentRequestSearch).pipe(
        finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {

      this.departmentList = res.content;
      this.totalItems = res.totalElements;
    });

  }
  deleteDepartment(department) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('department.confirm.delete'),
      message: this.translate.instant('department.confirm.deleteMessage', { name: department.name }),
      acceptLabel: this.translate.instant('department.confirm.accept'),
      rejectLabel: this.translate.instant('department.confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.departmentService.deleteDepartment(department.id).pipe(
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('department.message.deleteSuccess')
          });
          this.getListDepartment();
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('department.message.deleteNotFound')
            });
          } else {
            throw err;
          }
        });
      },
    });
  }

  /* Department Form Feature */
  initStatusList() {
    this.appTranslate.languageChanged$.pipe(
        takeUntil(this.nextOnDestroy),
        startWith(''),
        concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.active, value: DepartmentEnum.STATUS_ACTIVE },
        { label: res.inActive, value: DepartmentEnum.STATUS_INACTIVE }
      ];
    });

  }

  gotoCreate() {
    this.initFormDepartment();
    this.showDialog();
    this.isCreated = true;
    this.isUpdated = false;
  }
  initFormDepartment() {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      status: [DepartmentEnum.STATUS_ACTIVE, [Validators.required]],
      description: ['', [Validators.maxLength(100)]],
    });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.departmentForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  showDialog() {
    this.display = true;
  }

  submitDepartmentForm() {
    if (!this.departmentForm.invalid) {
      const body = this.departmentForm.value;

      if (this.isCreated) {
        this.indicator.showActivityIndicator();
        this.departmentService.createDepartment(body).pipe().subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail:  this.translate.instant('department.message.insertSuccess')
          });
          this.indicator.hideActivityIndicator();
          this.display = false;
          this.getListDepartment();
        }, err => {
          this.indicator.hideActivityIndicator();
          throw err;
        });
      } else if (this.isUpdated) {
        this.indicator.showActivityIndicator();
        this.departmentService.updateDepartment(body).pipe().subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail:  this.translate.instant('department.message.updateSuccess')
          });
          this.display = false;
          this.indicator.hideActivityIndicator();
          this.getListDepartment();
        }, err => {
          this.indicator.hideActivityIndicator();
          throw err;
        });
      }

    }
  }


  gotoUpdate(departments: any) {
    this.departmentForm = this.fb.group({
      id: [departments.id],
      name: [departments.name, [Validators.required, Validators.maxLength(100)]],
      status: [departments.status, [Validators.required]],
      description: [departments.description, [Validators.maxLength(100)]],
    });
    this.showDialog();
    this.isCreated = false;
    this.isUpdated = true;
  }

}
