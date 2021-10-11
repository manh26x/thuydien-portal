import { Component, OnInit } from '@angular/core';
import {QaService} from '../service/qa.service';
import {BaseComponent} from '../../../core/base.component';
import {ActivatedRoute, Router} from "@angular/router";
import {QaObject} from "../qa";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {IndicatorService} from "../../../shared/indicator/indicator.service";

@Component({
  selector: 'aw-qa-update',
  templateUrl: './qa-update.component.html',
  styles: [
  ]
})
export class QaUpdateComponent extends BaseComponent implements OnInit {

  qaObj: QaObject;

  constructor(
    private qaService: QaService,
    private activeRoute: ActivatedRoute,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private confirmDialog: ConfirmationService,
    private messageService: MessageService,
    private indicator: IndicatorService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.qaService.setPage('update');

    this.qaService.getQaDetail(this.activeRoute.snapshot.paramMap.get('id'))
      .subscribe(res => this.qaObj = res);
  }

  doSave(evt) {
    this.indicator.showActivityIndicator();
    this.qaService.updateQa(evt).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('qa.message.updateSuccess'),
      });
      this.router.navigate(['/qa']);
    }, () => {
      this.messageService.add({
        severity: 'error',
        detail: this.translate.instant('qa.message.updateFail'),
      });
    }, () => this.indicator.hideActivityIndicator());
  }

}
