import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CarBrand} from "../../model/car-brand";
import {finalize} from "rxjs/operators";
import {ApiErrorResponse} from "../../../../core/model/error-response";
import {IndicatorService} from "../../../../shared/indicator/indicator.service";
import {UtilService} from "../../../../core/service/util.service";
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "primeng/api";

@Component({
  selector: 'aw-car-brand-update',
  templateUrl: './car-brand-update.component.html',
  styles: [
  ]
})
export class CarBrandUpdateComponent extends BaseComponent implements OnInit {

  carBrand: CarBrand;

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
    this.insuranceService.setPage('updateCarBrand');
    this.insuranceService.carBrandDetail(this.route.snapshot.paramMap.get('id')).subscribe(
      res => {
      this.carBrand = res;
    });
  }

  doSave(evt) {
    this.indicator.showActivityIndicator();
    const carBrand = evt;
    carBrand.status = evt.status.code;
    console.log(evt);
    this.insuranceService.updateCarBrand(carBrand).pipe(
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
