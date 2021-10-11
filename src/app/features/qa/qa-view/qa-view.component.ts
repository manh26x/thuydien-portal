import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {QaService} from "../service/qa.service";
import {ActivatedRoute} from "@angular/router";
import {QaObject} from "../qa";

@Component({
  selector: 'aw-qa-view',
  templateUrl: './qa-view.component.html',
  styles: [
  ]
})
export class QaViewComponent extends BaseComponent implements OnInit {

  qaObj: QaObject;

  constructor(
    private qaService: QaService,
    private activeRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.qaService.setPage('view');

    this.qaService.getQaDetail(this.activeRoute.snapshot.paramMap.get('id'))
      .subscribe(res => this.qaObj = res);
  }

}
