import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AreaEnum} from '../model/area.enum';
import {UtilService} from '../../../core/service/util.service';
import {Area} from '../model/area';
import {BaseComponent} from '../../../core/base.component';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {startWith, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'aw-area-form',
  templateUrl: './area-form.component.html',
  styles: [
  ]
})
export class AreaFormComponent extends BaseComponent implements OnInit, OnChanges {
  areaForm: FormGroup;
  readonly priorityList = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
    { label: '11', value: 11 },
    { label: '12', value: 12 },
    { label: '13', value: 13 },
    { label: '14', value: 14 },
    { label: '15', value: 15 },
    { label: '16', value: 16 },
    { label: '17', value: 17 },
    { label: '18', value: 18 },
    { label: '19', value: 19 },
    { label: '20', value: 20 },
    { label: '21', value: 21 },
    { label: '22', value: 22 },
    { label: '23', value: 23 },
    { label: '24', value: 24 },
    { label: '25', value: 25 },
    { label: '26', value: 26 },
    { label: '27', value: 27 },
    { label: '28', value: 28 },
    { label: '29', value: 29 },
    { label: '30', value: 30 }
  ];

  areaStatus = [];

  @Input() mode = 'create';
  @Input() valueForm: Area;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  constructor(
      private fb: FormBuilder,
      private router: Router,
      private util: UtilService,
      private translate: TranslateService,
      private appTranslate: AppTranslateService
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    this.appTranslate.languageChanged$.pipe(
        takeUntil(this.nextOnDestroy),
        startWith(''),
        switchMap(_ => this.translate.get('area.const'))
    ).subscribe(res => {
      this.areaStatus = [
        { label: res.active, value: AreaEnum.STATUS_ACTIVE },
        { label: res.inactive, value: AreaEnum.STATUS_INACTIVE }
      ];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const area: Area = changes.valueForm.currentValue;
        this.areaForm.patchValue({
          id: area.id,
          name: area.name,
          color: area.color,
          priority: area.priority,
          status: area.status
        });
      }
    }
  }

  doSave() {
    const value = this.areaForm.getRawValue();
    this.areaForm.patchValue({
      name: value.name?.trim()
    });
    if (this.areaForm.valid) {
      this.save.emit(value);
    } else {
      this.util.validateAllFields(this.areaForm);
    }
  }

  doCancel() {
    this.router.navigate(['management-kpi', 'report']);
  }

  initForm() {
    this.areaForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.maxLength(300)]],
      color: ['#000000', [Validators.required]],
      priority: [1],
      status: [{value: AreaEnum.STATUS_ACTIVE, disabled: true}]
    });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.areaForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

}
