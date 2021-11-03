import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IndicatorService} from "../../../../shared/indicator/indicator.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'aw-insurance-view',
  templateUrl: './insurance-view.component.html',
  styles: [
  ]
})
export class InsuranceViewComponent extends BaseComponent implements OnInit {

  insurance: any;



  constructor(
    private insuranceService: InsuranceService,
    private route: ActivatedRoute,
    private router: Router,
    private indicator: IndicatorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.indicator.showActivityIndicator();
    this.insuranceService.setPage('viewInsurance');
    this.insuranceService.insuranceDetail(this.route.snapshot.paramMap.get('id'))
      .pipe(finalize(() => this.indicator.hideActivityIndicator()))
      .subscribe(res => {
        this.insurance = res;
      });
  }

  doCancel() {
    this.router.navigate(['insurance']);
  }
}
