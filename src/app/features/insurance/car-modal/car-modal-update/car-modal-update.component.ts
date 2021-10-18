import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs/operators";
import {ApiErrorResponse} from "../../../../core/model/error-response";
import {IndicatorService} from "../../../../shared/indicator/indicator.service";
import {UtilService} from "../../../../core/service/util.service";
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "primeng/api";

@Component({
  selector: 'aw-car-modal-update',
  templateUrl: './car-modal-update.component.html',
  styles: [
  ]
})
export class CarModalUpdateComponent  extends BaseComponent implements OnInit {
  carModal: any;

  constructor(
    private insuranceService: InsuranceService,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private router: Router,
    private util: UtilService,
    private translate: TranslateService,
    private messageService: MessageService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.insuranceService.setPage('updateCarModal');
    this.insuranceService.carModelDetail(this.route.snapshot.paramMap.get('id')).subscribe(res => {
      this.carModal = res;
    });
  }

  doSave(evt) {
    const carModel = {
      brandId: evt.brandId.id,
      model: evt.model,
      modelId: evt.modelId,
      status: evt.status.code
    };

    this.insuranceService.updateCarModel(carModel).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.updateSuccess')
      });
      this.route.queryParams.subscribe(params => {
        this.router.navigate(['insurance']);
      });
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '201') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('message.updateNotFound')
        });
      } else if (err instanceof ApiErrorResponse && err.code === '205') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('message.updateNotPermission')
        });
      } else {
        throw err;
      }
    });
  }

}
