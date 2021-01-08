import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, finalize, startWith, takeUntil} from 'rxjs/operators';
import {UserEnum} from '../model/user.enum';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../../../core/service/util.service';
import {UserService} from '../service/user.service';
import {TagsEnum} from '../../tags/model/tags.enum';
import {TagsUser} from '../../tags/model/tags';
import {UserDetail} from '../model/user';
import {xorBy} from 'lodash-es';
import {BaseComponent} from '../../../core/base.component';
import {RoleService} from '../../role/service/role.service';
import {Role, RoleEnum} from '../../../shared/model/role';
import {UnitService} from '../../../shared/service/unit.service';
import {BranchService} from '../../../shared/service/branch.service';
import {DepartmentService} from '../../../shared/service/department.service';
import {forkJoin} from 'rxjs';
import {Unit} from '../../../shared/model/unit';
import {Department} from '../../../shared/model/department';
import {IndicatorService} from '../../../shared/indicator/indicator.service';

@Component({
  selector: 'aw-user-form',
  templateUrl: './user-form.component.html',
  styles: [`
    .tag-item {
      display: flex;
      align-items: center;
      padding: 0;
      width: 100%;
    }
  `],
  providers: [RoleService, UnitService, BranchService, DepartmentService]
})
export class UserFormComponent extends BaseComponent implements OnInit, OnChanges {
  roleList: Role[] = [];
  statusList = [];
  unitList: Unit[] = [];
  departmentList: Department[] = [];

  formUser: FormGroup;
  tagTypeEnum = TagsEnum;
  filteredUser = [];
  roleSelectedList: Role[] = [];
  branchList = [];
  @Input() mode = 'create';
  @Input() valueForm: UserDetail;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private fb: FormBuilder,
    private util: UtilService,
    private userService: UserService,
    private roleService: RoleService,
    private unitService: UnitService,
    private branchService: BranchService,
    private departmentService: DepartmentService,
    private indicator: IndicatorService
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    if (this.mode === 'update') {
      this.formUser.get('userId').disable();
      this.formUser.get('status').disable();
    }
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const').pipe(res => res))
    ).subscribe(res => {
      this.statusList = [
        {code: UserEnum.ACTIVE, name: res.active},
        {code: UserEnum.INACTIVE, name: res.inactive}
      ];
    });
    this.indicator.showActivityIndicator();
    const obsUnit = this.unitService.getAllUnit();
    const obsBranch = this.branchService.getBranchList();
    const obsDepartment = this.departmentService.getAllDepartment();
    const obsRole = this.roleService.getRoleList('', RoleEnum.STATUS_ACTIVE);
    forkJoin([obsUnit, obsBranch, obsDepartment, obsRole]).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      this.unitList = res[0];
      this.branchList = res[1];
      this.departmentList = res[2];
      this.roleList = res[3];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const userInfo: UserDetail = changes.valueForm.currentValue;
        this.formUser.patchValue({
          userId: userInfo.user ? userInfo.user.userName : null,
          status: userInfo.user ? {code: userInfo.user.statusCode} : null,
          fullName: userInfo.user.fullName,
          phone: userInfo.user.phone,
          email: userInfo.user.email,
          branch: userInfo.userBranchList ? userInfo.userBranchList.map(item => ({ id: item.branchId })) : null,
          position: userInfo.user.position,
          role: userInfo.user ? {code: userInfo.user.role} : null
        });
      }
    }
  }

  doSave() {
    this.formUser.patchValue({
      role: this.roleSelectedList
    });
    if (this.formUser.invalid) {
      this.util.validateAllFields(this.formUser);
    } else {
      this.save.emit(this.formUser.getRawValue());
    }
  }

  doCancel() {
    this.cancel.emit();
  }

  filterUser(evt?: any) {
    const query = evt ? evt.query : this.formUser.value.userId;
    this.userService.getUserByUsername(query).subscribe(res => {
      this.filteredUser = res;
    }, err => {
      this.filteredUser = [];
      throw err;
    });
  }


  initForm() {
    this.formUser = this.fb.group({
      fullName: ['', Validators.required],
      role: ['', [Validators.required]],
      status: [{ value: {code: UserEnum.ACTIVE}, disabled: true }, [Validators.required]],
      userId: ['', [Validators.required]],
      email: [''],
      phone: [''],
      position: ['', [Validators.maxLength(100)]],
      branch: ['', [Validators.required]],
      tagNews: [],
      tagKpi: [],
      unit: ['', [Validators.required]],
      department: ['', [Validators.required]]
    }, { updateOn: 'blur' });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formUser.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  tagsMatcher(abstract: AbstractControl): { [key: string]: boolean } | null {
    const tagNews = abstract.get('tagNews');
    const tagKpi = abstract.get('tagKpi');
    if (
      (Array.isArray(tagNews.value) && tagNews.value.length > 0 )
      || (Array.isArray(tagKpi.value) && tagKpi.value.length > 0 )
    ) {
      tagNews.setErrors(null);
      return null;
    }
    tagNews.setErrors({oneTagRequired: true});
    return { match: true };
  }

}
