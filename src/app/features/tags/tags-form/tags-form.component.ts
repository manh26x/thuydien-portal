import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TagsEnum} from '../model/tags.enum';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, map, startWith} from 'rxjs/operators';
import {UserService} from '../../user/service/user.service';
import {UtilService} from '../../../core/service/util.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {TagsUser} from '../model/tags';

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
      this.formTags.get('name').disable();
    }
    if (this.mode === 'view') {
      this.formTags.get('name').disable();
      this.formTags.get('type').disable();
      this.formTags.get('assign').disable();
    }
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('type').pipe(
        res => res
      ))
    ).subscribe(res => {
      this.tagsType = [
        { name: res.news, code: TagsEnum.NEWS },
        { name: res.tool, code: TagsEnum.TOOL },
        { name: res.qna, code: TagsEnum.QNA },
        { name: res.kpi, code: TagsEnum.KPI }
      ];
    });

    this.userService.getAllUser().subscribe(res => {
      this.userList = res;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const tag: TagsUser = changes.valueForm.currentValue;
        this.formTags.setValue({
          id: tag.tagId,
          name: tag.tagValue,
          type: tag.tagType.map(tagType => {
            return { code: tagType };
          }),
          assign: tag.assignee.map(tagUser => {
            return { userName: tagUser.userId };
          })
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
      name: ['', [Validators.required, Validators.maxLength(this.nameMaxLength)]],
      type: [null, [Validators.required]],
      assign: [null, [Validators.required]]
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
