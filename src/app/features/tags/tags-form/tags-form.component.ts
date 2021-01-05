import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TagsEnum} from '../model/tags.enum';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, map, startWith} from 'rxjs/operators';
import {UserService} from '../../user/service/user.service';
import {UtilService} from '../../../core/service/util.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {TagDetail, TagsUser} from '../model/tags';

@Component({
  selector: 'aw-tags-form',
  templateUrl: './tags-form.component.html',
  styles: [
  ],
  providers: [UserService]
})
export class TagsFormComponent implements OnInit, OnChanges {
  tagsType = [];
  userList = [];
  formTags: FormGroup;
  readonly nameMaxLength = 100;
  @Input() mode = 'create';
  @Input() valueForm: TagsUser;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  statusList = [];
  constructor(
    private appTranslate: AppTranslateService,
    private translate: TranslateService,
    private userService: UserService,
    private util: UtilService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.mode === 'update') {
      this.formTags.get('code').disable();
    }
    if (this.mode === 'create') {
      this.formTags.get('status').disable();
    }
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('const').pipe(
        res => res
      ))
    ).subscribe(res => {
      this.tagsType = [
        { name: res.select, code: ''},
        { name: res.news, code: TagsEnum.NEWS },
        { name: res.kpi, code: TagsEnum.KPI }
      ];
      this.statusList = [
        { name: res.active, code: TagsEnum.STATUS_ACTIVE },
        { name: res.inactive, code: TagsEnum.STATUS_INACTIVE }
      ];
    });

    this.userService.getAllUser().subscribe(res => {
      this.userList = res;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const tag: TagDetail = changes.valueForm.currentValue;
        this.formTags.patchValue({
          id: tag.id,
          name: tag.value,
          type: { code: tag.type },
          code: tag.keyTag,
          status: { code: tag.status }
        });
      }
    }
  }

  doSave() {
    if (this.formTags.invalid) {
      this.util.validateAllFields(this.formTags);
    } else {
      this.save.emit(this.formTags.getRawValue());
    }
  }

  doCancel() {
    this.initForm();
    this.cancel.emit();
  }

  initForm() {
    this.formTags = this.fb.group({
      id: [],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(this.nameMaxLength)]],
      type: [null, [Validators.required]],
      assign: [null],
      status: [TagsEnum.STATUS_ACTIVE]
    });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formTags.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

}
