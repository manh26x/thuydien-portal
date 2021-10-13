import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";

@Component({
  selector: 'aw-car-modal-create',
  templateUrl: './car-modal-create.component.html',
  styles: [
  ]
})
export class CarModalCreateComponent extends BaseComponent implements OnInit {

  constructor(
    private insuranceService: InsuranceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.insuranceService.setPage('createCarModal');
  }

}
