import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {QaService} from "../service/qa.service";

@Component({
  selector: 'aw-qa-create',
  templateUrl: './qa-create.component.html',
  styles: [
  ]
})
export class QaCreateComponent extends BaseComponent implements OnInit {

  constructor(
    private qaService: QaService
) {
    super();
  }

  ngOnInit(): void {
    this.qaService.setPage('create');
  }

}
