import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AreaEnum} from '../../model/area.enum';
import {UtilService} from '../../../../core/service/util.service';
import {UserDetail} from '../../../user/model/user';
import {Area} from '../../model/area';

@Component({
  selector: 'aw-area-form',
  templateUrl: './area-form.component.html',
  styles: [
  ]
})
export class AreaFormComponent implements OnInit, OnChanges {
  areaForm: FormGroup;
  readonly priorityList = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 }
  ];

  readonly areaStatus = [
    { label: 'Hoạt động', value: AreaEnum.STATUS_ACTIVE },
    { label: 'Không hoạt động', value: AreaEnum.STATUS_INACTIVE }
  ];

  @Input() mode = 'create';
  @Input() valueForm: Area;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private router: Router, private util: UtilService) {
    this.initForm();
  }

  ngOnInit(): void {
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
    if (this.areaForm.valid) {
      this.save.emit(this.areaForm.getRawValue());
    } else {
      this.util.validateAllFields(this.areaForm);
    }
    console.log(this.areaForm.getRawValue());
  }

  doCancel() {
    this.router.navigate(['management-kpi', 'report']);
  }

  initForm() {
    this.areaForm = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
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
