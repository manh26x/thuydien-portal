import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";

@Component({
  selector: 'aw-car-brand-update',
  templateUrl: './car-brand-update.component.html',
  styles: [
  ]
})
export class CarBrandUpdateComponent extends BaseComponent implements OnInit {

  constructor(
    private insuranceService: InsuranceService
) {
    super();
  }

  ngOnInit(): void {
    this.insuranceService.setPage('updateCarBrand');
  }

}
