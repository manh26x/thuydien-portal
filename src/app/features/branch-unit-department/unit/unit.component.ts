import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../core/base.component';
import {Paginator} from 'primeng/paginator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {UnitService} from './unit.service';
import {AppTranslateService} from '../../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {UnitFilterRequest} from './model/unit';
import {concatMap, finalize, startWith, takeUntil} from 'rxjs/operators';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {UnitEnum} from './model/unit.enum';

@Component({
  selector: 'aw-unit',
  templateUrl: './unit.component.html',
  styles: [
  ]
})
export class UnitComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('unitPaging') paging: Paginator;
  formFilter: FormGroup;
  sortBy: string;
  sortOrder: string;
  isCreated: boolean;
  isUpdated: boolean;
  constructor(
      private fb: FormBuilder,
      private indicator: IndicatorService,
      private unitService: UnitService,
      private appTranslate: AppTranslateService,
      private translate: TranslateService,
      private messageService: MessageService,
      private dialog: ConfirmationService,
  ) {
    super();
  }
  statusList: any;
  unitForm: FormGroup;

  unitList: any;
  display = false;
  unitRequestSearch: UnitFilterRequest;

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
      this.getListUnit();
    }
  }

  lazyLoadUnit( evt: LazyLoadEvent) {
    this.sortBy = evt.sortField;
    this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
    this.getListUnit();
  }

  doFilter() {
    this.paging.changePage(0);
    this.getListUnit();
  }

  getListUnit() {
    this.indicator.showActivityIndicator();
    this.unitList = [];
    this.totalItems = 0;
    // @ts-ignore
    this.unitRequestSearch  =  {
      keyword: this.formFilter.get('searchValue').value,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };
    this.unitService.filterUnit(this.unitRequestSearch).pipe(
        finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {

      this.unitList = res.content;
      this.totalItems = res.totalElements;
    });

  }
  deleteUnit(unit) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('unit.confirm.delete'),
      message: this.translate.instant('unit.confirm.deleteMessage', { name: unit.name }),
      acceptLabel: this.translate.instant('unit.confirm.accept'),
      rejectLabel: this.translate.instant('unit.confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.unitService.deleteUnit(unit.id).pipe(
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('unit.message.deleteSuccess')
          });
          this.getListUnit();
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('unit.message.deleteNotFound')
            });
          } else {
            throw err;
          }
        });
      },
    });
  }

  /* Unit Form Feature */
  initStatusList() {
    this.appTranslate.languageChanged$.pipe(
        takeUntil(this.nextOnDestroy),
        startWith(''),
        concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.active, value: UnitEnum.STATUS_ACTIVE },
        { label: res.inActive, value: UnitEnum.STATUS_INACTIVE }
      ];
    });

  }

  gotoCreate() {
    this.initFormUnit();
    this.showDialog();
    this.isCreated = true;
    this.isUpdated = false;
  }
  initFormUnit() {
    this.unitForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      status: [UnitEnum.STATUS_ACTIVE, [Validators.required]],
      description: ['', [Validators.maxLength(100)]],
    });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.unitForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  showDialog() {
    this.display = true;
  }

  submitUnitForm() {
    if (!this.unitForm.invalid) {
      const body = this.unitForm.value;

      if (this.isCreated) {
        this.indicator.showActivityIndicator();
        this.unitService.createUnit(body).pipe().subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail:  this.translate.instant('unit.message.insertSuccess')
          });
          this.indicator.hideActivityIndicator();
          this.display = false;
          this.getListUnit();
        }, err => {
          this.indicator.hideActivityIndicator();
          throw err;
        });
      } else if (this.isUpdated) {
        this.indicator.showActivityIndicator();
        this.unitService.updateUnit(body).pipe().subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail:  this.translate.instant('unit.message.updateSuccess')
          });
          this.display = false;
          this.indicator.hideActivityIndicator();
          this.getListUnit();
        }, err => {
          this.indicator.hideActivityIndicator();
          throw err;
        });
      }

    }
  }


  gotoUpdate(units: any) {
    this.unitForm = this.fb.group({
      id: [units.id],
      name: [units.name, [Validators.required, Validators.maxLength(100)]],
      status: [units.status, [Validators.required]],
      description: [units.description, [Validators.maxLength(100)]],
    });
    this.showDialog();
    this.isCreated = false;
    this.isUpdated = true;
  }

}

