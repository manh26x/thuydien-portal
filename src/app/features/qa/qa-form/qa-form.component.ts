import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseComponent} from "../../../core/base.component";
import {QaEnum, QaObject} from "../qa";
import {NewsDetail} from "../../news/model/news";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {map, startWith, switchMap, takeUntil} from "rxjs/operators";
import {UtilService} from "../../../core/service/util.service";
import {QaConst} from "../model/qa";

@Component({
  selector: 'aw-qa-form',
  templateUrl: './qa-form.component.html',
  styles: [
  ]
})
export class QaFormComponent extends BaseComponent implements OnChanges, OnInit {

  @Input() mode = 'view';
  @Input() qaObj: QaObject;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  qaForm: any;
  statusList = [];
  qaConst: QaConst;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private util: UtilService,
              ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.qaObj) {
      if (!changes.qaObj.firstChange) {
        const qa: QaObject = changes.qaObj.currentValue;
        this.qaForm.patchValue({
          question: qa.question,
          status: {value: qa.status},
          answer: qa.answer,
          id: qa.id
        });
        if (this.mode === 'view') {
          this.qaForm.disable();
        }
      }
    }

  }

  doCancel() {
    this.router.navigate(['/qa']);
  }

  ngOnInit(): void {
    this.qaForm = this.fb.group({
      question: ['', [Validators.required, Validators.maxLength(3000)]],
      status: [{value: 1}, [Validators.required]],
      answer: ['', [Validators.required, Validators.maxLength(3000)]],
      id: [null]
    });

    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      switchMap(lang => this.translate.get('const').pipe(
        map(resConst => ({ lang, resConst }))
      ))
    ).subscribe(({lang, resConst}) => {

      this.statusList = [
        { label: resConst.active, value: QaEnum.ACTIVE },
        { label: resConst.inactive, value: QaEnum.INACTIVE }
      ];
    });
    if(this.mode === 'create') {
      this.qaForm.get('status').disable();
    }
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.qaForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  doSave() {
    this.qaForm.get('question').setValue(this.qaForm.get('question').value.trim());
    this.qaForm.get('answer').setValue(this.qaForm.get('answer').value.trim());
    if (this.qaForm.invalid) {
      this.util.validateAllFields(this.qaForm);
    } else  {
      this.save.emit({
        id: this.qaForm.get('id').value,
        question: this.qaForm.get('question').value,
        answer: this.qaForm.get('answer').value,
        status: this.qaForm.get('status').value.value
      });

    }
  }
}
