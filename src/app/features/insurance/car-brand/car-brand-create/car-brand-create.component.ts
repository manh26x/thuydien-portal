import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";

@Component({
  selector: 'aw-car-brand-create',
  templateUrl: './car-brand-create.component.html',
  styles: [
  ]
})
export class CarBrandCreateComponent extends BaseComponent implements OnInit {

  constructor(
    private insuranceService: InsuranceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.insuranceService.setPage('createCarBrand');
  }

}
