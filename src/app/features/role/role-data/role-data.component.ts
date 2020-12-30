import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BaseComponent} from '../../../core/base.component';

@Component({
  selector: 'aw-role-data',
  templateUrl: './role-data.component.html',
  styles: [
  ]
})
export class RoleDataComponent extends BaseComponent implements OnInit {
  formFilter: FormGroup;
  statusList = [];
  constructor(
    private fb: FormBuilder
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm() {
    this.formFilter = this.fb.group({
      name: [''],
      status: ['']
    });
  }

}
