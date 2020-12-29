import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, startWith} from 'rxjs/operators';
import {UserEnum} from '../model/user.enum';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../../../core/service/util.service';
import {UserService} from '../service/user.service';
import {TagsEnum} from '../../tags/model/tags.enum';
import {TagsUser} from '../../tags/model/tags';
import {UserDetail} from '../model/user';
import {xorBy} from 'lodash-es';

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
  `]
})
export class UserFormComponent implements OnInit, OnChanges {
  roleList = [];
  statusList = [];

  formUser: FormGroup;
  tagTypeEnum = TagsEnum;
  filteredUser = [];
  tagNewsSelectedList: TagsUser[] = [];
  tagKpiSelectedList: TagsUser[] = [];
  @Input() branchList = [];
  @Input() tagNewsList: TagsUser[];
  @Input() tagKpiList: TagsUser[];
  @Input() mode = 'create';
  @Input() valueForm: UserDetail;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private fb: FormBuilder,
    private util: UtilService,
    private userService: UserService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.mode === 'update') {
      this.formUser.get('userId').disable();
      this.formUser.get('status').disable();
    }
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('const').pipe(res => res))
    ).subscribe(res => {
      this.statusList = [
        {code: UserEnum.ACTIVE, name: res.active},
        {code: UserEnum.INACTIVE, name: res.inactive}
      ];
      this.roleList = [
        {code: UserEnum.ADMIN, name: res.roleAdmin},
        {code: UserEnum.SUPPER_ADMIN, name: res.supperAdmin},
      ];
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
        this.tagKpiSelectedList = userInfo.listTagKPI;
        this.tagNewsSelectedList = userInfo.listTagNews;
      }
    }
  }

  doSave() {
    this.formUser.patchValue({
      tagNews: this.tagNewsSelectedList,
      tagKpi: this.tagKpiSelectedList
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

  doSelectUser(evt) {
    this.tagKpiList = [...this.tagKpiSelectedList, ...this.tagKpiList];
    this.tagNewsList = [...this.tagNewsSelectedList, ...this.tagNewsList];
    this.userService.getUserInfo(evt).subscribe(res => {
      this.formUser.patchValue({
        status: {code: res.user.statusCode},
        fullName: res.user.fullName,
        phone: res.user.phone,
        email: res.user.email,
        branch: res.userBranchList.map(item => ({ id: item.branchId })),
        position: res.user.position,
        role: {code: res.user.role}
      });
      this.tagKpiList = xorBy(this.tagKpiList, res.listTagKPI, 'tagId');
      this.tagKpiSelectedList = res.listTagKPI;
      this.tagNewsList = xorBy(this.tagNewsList, res.listTagNews, 'tagId');
      this.tagNewsSelectedList = res.listTagNews;
    });
  }

  initForm() {
    this.formUser = this.fb.group({
      fullName: [{value: '', disabled: true}],
      role: [ {value: {code: UserEnum.ADMIN}, disabled: true }, [Validators.required]],
      status: [{code: UserEnum.ACTIVE}],
      userId: ['', [Validators.required]],
      email: [{value: '', disabled: true}],
      phone: [{value: '', disabled: true}],
      position: [{value: '', disabled: true}],
      branch: [{value: '', disabled: true}],
      tagNews: [],
      tagKpi: []
    }, { validators: this.tagsMatcher, updateOn: 'blur' });
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
