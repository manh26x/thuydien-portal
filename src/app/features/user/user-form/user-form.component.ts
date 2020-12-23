import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, startWith} from 'rxjs/operators';
import {UserEnum} from '../model/user.enum';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../../../core/service/util.service';
import {UserService} from '../service/user.service';
import {TagsService} from '../../tags/service/tags.service';
import {TagsEnum} from '../../tags/model/tags.enum';
import {TagsUser} from '../../tags/model/tags';
import {forkJoin} from 'rxjs';
import {UserDetail} from '../model/user';

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
  providers: [TagsService]
})
export class UserFormComponent implements OnInit, OnChanges {
  roleList = [];
  statusList = [];
  branchList = [];
  formUser: FormGroup;
  tagNewsList: TagsUser[];
  tagNewsSelectedList: TagsUser[] = [];
  tagKpiList: TagsUser[];
  tagTypeEnum = TagsEnum;
  filteredUser = [];
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
    private tagService: TagsService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.mode === 'update') {
      this.formUser.get('userId').disable();
    } else if (this.mode === 'view') {
      this.formUser.get('fullName').disable();
      this.formUser.get('role').disable();
      this.formUser.get('status').disable();
      this.formUser.get('userId').disable();
      this.formUser.get('email').disable();
      this.formUser.get('phone').disable();
      this.formUser.get('position').disable();
      this.formUser.get('branch').disable();
      this.formUser.get('tagQna').disable();
      this.formUser.get('tagNews').disable();
      this.formUser.get('tagKpi').disable();
      this.formUser.get('tagTool').disable();
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

    const obsTagNews = this.filterTagByType('', TagsEnum.NEWS);
    const obsTagKpi = this.filterTagByType('', TagsEnum.KPI);
    const obsBranch = this.userService.getBranchList();
    forkJoin([obsBranch, obsTagNews, obsTagKpi]).subscribe(res => {
      this.branchList = res[0];
      this.tagNewsList = res[1].tagsList;
      this.tagKpiList = res[2].tagsList;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const userInfo: UserDetail = changes.valueForm.currentValue;
        this.formUser.setValue({
          fullName: userInfo.user.fullName,
          role: {code: userInfo.user.role},
          status: {code: userInfo.user.statusCode},
          userId: userInfo.user.userName,
          email: userInfo.user.email,
          phone: userInfo.user.phone,
          position: userInfo.user.position,
          branch: userInfo.userBranchList.map(br => {
            return { id: br.branchId };
          }),
          tagQna: userInfo.listTagQnA.map(qna => {
            return { tagId:  qna.tagId };
          }),
          tagNews: userInfo.listTagNews.map(qna => {
            return { tagId:  qna.tagId };
          }),
          tagKpi: userInfo.listTagKPI.map(qna => {
            return { tagId:  qna.tagId };
          }),
          tagTool: userInfo.listTagTool.map(qna => {
            return { tagId:  qna.tagId };
          }),
        });
      }
    }
  }

  doSave() {
    if (this.formUser.invalid) {
      this.util.validateAllFields(this.formUser);
    } else {
      this.save.emit(this.formUser.getRawValue());
    }
  }

  doCancel() {
    this.cancel.emit();
  }

  filterUser(evt) {
    this.userService.getUserByUsername(evt.query).subscribe(res => {
      this.filteredUser = res;
    });
  }

  doSelectUser(evt) {
    this.userService.getUserInfo(evt).subscribe(res => {
      this.formUser.patchValue({
        status: res.user.statusCode,
        fullName: res.user.fullName,
        phone: res.user.phone,
        email: res.user.email,
        branch: res.userBranchList.map(item => { return { id: item.branchId }; }),
        position: res.user.position
      });
    });
  }

  filterTagByType(query, type) {
    return this.tagService.searchTagExp({tagType: type, sortOrder: 'ASC', sortBy: 'id', page: 0, pageSize: 500, searchValue: query });
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
