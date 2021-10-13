import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";

@Component({
  selector: 'aw-car-modal-update',
  templateUrl: './car-modal-update.component.html',
  styles: [
  ]
})
export class CarModalUpdateComponent  extends BaseComponent implements OnInit {

  constructor(
    private insuranceService: InsuranceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.insuranceService.setPage('updateCarModal');
  }

}
