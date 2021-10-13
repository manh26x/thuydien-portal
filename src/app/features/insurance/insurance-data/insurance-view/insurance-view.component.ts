import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";

@Component({
  selector: 'aw-insurance-view',
  templateUrl: './insurance-view.component.html',
  styles: [
  ]
})
export class InsuranceViewComponent extends BaseComponent implements OnInit {

  constructor(
    private insuranceService: InsuranceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.insuranceService.setPage('viewInsurance');
  }

}
