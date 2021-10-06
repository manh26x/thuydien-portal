import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {QaService} from "../service/qa.service";

@Component({
  selector: 'aw-qa-view',
  templateUrl: './qa-view.component.html',
  styles: [
  ]
})
export class QaViewComponent extends BaseComponent implements OnInit {

  constructor(
    private qaService: QaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.qaService.setPage('view');
  }

}
