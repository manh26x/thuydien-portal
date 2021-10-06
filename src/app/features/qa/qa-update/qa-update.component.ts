import { Component, OnInit } from '@angular/core';
import {QaService} from '../service/qa.service';
import {BaseComponent} from '../../../core/base.component';

@Component({
  selector: 'aw-qa-update',
  templateUrl: './qa-update.component.html',
  styles: [
  ]
})
export class QaUpdateComponent extends BaseComponent implements OnInit {

  constructor(
    private qaService: QaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.qaService.setPage('update');
  }

}
