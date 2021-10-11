import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {QaService} from "../service/qa.service";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {IndicatorService} from "../../../shared/indicator/indicator.service";
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'aw-qa-create',
  templateUrl: './qa-create.component.html',
  styles: [
  ]
})
export class QaCreateComponent extends BaseComponent implements OnInit {

  constructor(
    private qaService: QaService,
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
    this.qaService.setPage('create');
  }

  doSave(evt) {
    this.indicator.showActivityIndicator()
    this.qaService.createQa(evt).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('qa.message.insertSuccess'),
      });
      this.router.navigate(['/qa']);
    }, () => {
      this.messageService.add({
        severity: 'error',
        detail: this.translate.instant('qa.message.insertFail'),
      });
    }, () => this.indicator.hideActivityIndicator());
  }
}
