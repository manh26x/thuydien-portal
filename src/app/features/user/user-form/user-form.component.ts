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
  styles: [],
  providers: [TagsService]
})
export class UserFormComponent implements OnInit, OnChanges {
  roleList = [];
  statusList = [];
  branchList = [];
  formUser: FormGroup;
  tagQnaList: TagsUser[];
  tagNewsList: TagsUser[];
  tagKpiList: TagsUser[];
  tagToolList: TagsUser[];
  tagTypeEnum = TagsEnum;
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
    const obsTagTool = this.filterTagByType('', TagsEnum.TOOL);
    const obsTagKpi = this.filterTagByType('', TagsEnum.KPI);
    const obsTagQna = this.filterTagByType('', TagsEnum.QNA);
    const obsBranch = this.userService.getBranchList();
    forkJoin([obsBranch, obsTagNews, obsTagTool, obsTagKpi, obsTagQna]).subscribe(res => {
      this.branchList = res[0];
      this.tagNewsList = res[1].tagsList;
      this.tagToolList = res[2].tagsList;
      this.tagKpiList = res[3].tagsList;
      this.tagQnaList = res[4].tagsList;
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
          // password: userInfo.userPortal.password,
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

  filterTagByType(query, type) {
    return this.tagService.searchTagExp({tagType: type, sortOrder: 'ASC', sortBy: 'id', page: 0, pageSize: 500, searchValue: query });
  }

  initForm() {
    this.formUser = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      role: [{code: UserEnum.ADMIN}, [Validators.required]],
      status: [{code: UserEnum.ACTIVE}],
      userId: ['', [Validators.required, Validators.maxLength(100)]],
      // password: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.pattern(/^[\d\s]*$/), Validators.maxLength(20)]],
      position: [''],
      branch: [],
      tagQna: [],
      tagNews: [],
      tagKpi: [],
      tagTool: []
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
    const tagQna = abstract.get('tagQna');
    const tagNews = abstract.get('tagNews');
    const tagKpi = abstract.get('tagKpi');
    const tagTool = abstract.get('tagTool');
    if (
      (Array.isArray(tagQna.value) && tagQna.value.length > 0)
      || (Array.isArray(tagNews.value) && tagNews.value.length > 0 )
      || (Array.isArray(tagKpi.value) && tagKpi.value.length > 0 )
      || (Array.isArray(tagTool.value) && tagTool.value.length > 0 )
    ) {
      tagQna.setErrors(null);
      return null;
    }
    tagQna.setErrors({oneTagRequired: true});
    return { match: true };
  }

}
