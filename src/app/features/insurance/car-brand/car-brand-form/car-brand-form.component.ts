import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'aw-car-brand-form',
  templateUrl: './car-brand-form.component.html',
  styles: [
  ]
})
export class CarBrandFormComponent implements OnInit {

  @Input() isEdit = false;
  carBrandForm: any;
  statusList = [];

  constructor() { }

  ngOnInit(): void {
  }

  hasErrorFilter(searchValue: string, pattern: string) {

  }

  save() {

  }

  doCancel() {

  }
}
