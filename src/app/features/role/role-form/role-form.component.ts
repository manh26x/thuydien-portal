import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {concatMap, startWith} from 'rxjs/operators';
import {AppTranslateService} from '../../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {RoleEnum} from '../../../shared/model/role';

@Component({
  selector: 'aw-role-form',
  templateUrl: './role-form.component.html',
  styles: [
  ]
})
export class RoleFormComponent implements OnInit {
  @Input() roleForm: FormGroup;
  statusList: SelectItem[] = [];
  constructor(
    private fb: FormBuilder,
    private appTranslate: AppTranslateService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.active, value: RoleEnum.STATUS_ACTIVE },
        { label: res.inactive, value: RoleEnum.STATUS_INACTIVE }
      ];
    });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.roleForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

}
