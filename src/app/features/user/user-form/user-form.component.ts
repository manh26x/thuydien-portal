import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, startWith, takeUntil} from 'rxjs/operators';
import {UserEnum} from '../model/user.enum';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../../../core/service/util.service';
import {UserDetail} from '../model/user';
import {BaseComponent} from '../../../core/base.component';
import {Role} from '../../../shared/model/role';
import {Unit} from '../../../shared/model/unit';
import {Department} from '../../../shared/model/department';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent extends BaseComponent implements OnInit, OnChanges {
  statusList = [];
  formUser: FormGroup;
  roleSelectedList: Role[] = [];
  user: string ='user'
  admin: string = 'admin'
  @Input() unitList: Unit[] = [];
  @Input() departmentList: Department[] = [];
  @Input() roleList: Role[] = [];
  @Input() branchList = [];
  @Input() mode = 'create';
  @Input() valueForm: UserDetail;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private fb: FormBuilder,
    private util: UtilService
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    if (this.mode === 'update') {
      this.formUser.get('userId').disable();
      this.formUser.get('status').enable();
    }
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        {code: UserEnum.ACTIVE, name: res.active},
        {code: UserEnum.INACTIVE, name: res.inactive}
      ];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const userInfo: UserDetail = changes.valueForm.currentValue;
        if (this.mode === 'update') {
          this.formUser.get('fullName').disable();
          this.formUser.get('email').disable();
        }
        this.formUser.patchValue({
          userId: userInfo.user ? userInfo.user.userName : null,
          status: userInfo.user ? {code: userInfo.user.status} : null,
          fullName: userInfo.user.fullName,
          phone: userInfo.user.phone,
          email: userInfo.user.email,
          branch: userInfo.userBranchList ? userInfo.userBranchList.map(item => ({ code: item.branchId })) : null,
          position: userInfo.user.position,
          unit: {id: userInfo.user.unitId, name: userInfo.user.unitName},
          department: {id: userInfo.user.departmentId, name: userInfo.user.departmentName}
        });
        this.roleSelectedList = userInfo.userRoleList;
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

  city: string;

  initForm() {
    this.formUser = this.fb.group({
      fullName: ['', Validators.required],
      role: ['', [Validators.required]],
      status: [{ value: { code: UserEnum.ACTIVE }, disabled: true }, [Validators.required]],
      userId: ['', [Validators.required, Validators.pattern(/^((\w)|(\.))*$/), Validators.maxLength(100)]],
      email: [''],
      phone: [''],
      position: ['', [Validators.maxLength(100)]],
      branch: ['', [Validators.required]],
      tagNews: [],
      tagKpi: [],
      unit: ['', [Validators.required]],
      department: ['', [Validators.required]],
      typeUser:[''],
    }, { updateOn: 'blur' });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formUser.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

}
