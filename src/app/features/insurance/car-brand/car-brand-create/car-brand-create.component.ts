import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";
import {finalize} from "rxjs/operators";
import {ApiErrorResponse} from "../../../../core/model/error-response";
import {ActivatedRoute, Router} from "@angular/router";
import {IndicatorService} from "../../../../shared/indicator/indicator.service";
import {UtilService} from "../../../../core/service/util.service";
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "primeng/api";

@Component({
  selector: 'aw-car-brand-create',
  templateUrl: './car-brand-create.component.html',
  styles: [
  ]
})
export class CarBrandCreateComponent extends BaseComponent implements OnInit {

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
    this.insuranceService.setPage('createCarBrand');
  }

  doCreate(evt) {
    this.indicator.showActivityIndicator();
    const carBrand = evt;
    this.insuranceService.createCarBrand(carBrand).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.insertSuccess')
      });
      this.route.queryParams.subscribe(params => {
        this.router.navigate(['insurance']);
      });
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '202') {
        const obj = {
          severity: 'error',
          detail: this.translate.instant('message.insertExisted')
        };
        this.messageService.add(obj);
      } else {
        throw err;
      }
    });
  }
}
