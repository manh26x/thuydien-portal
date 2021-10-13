import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'aw-car-modal-form',
  templateUrl: './car-modal-form.component.html',
  styles: [
  ]
})
export class CarModalFormComponent  implements OnInit {

  @Input() isEdit = false;
  carModalForm: any;
  statusList = [];
  brandList = [];

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
