import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../core/base.component";
import {InsuranceService} from "../../service/insurance.service";

@Component({
  selector: 'aw-insurance-form',
  templateUrl: './insurance-form.component.html',
  styles: [
  ]
})
export class InsuranceFormComponent extends BaseComponent implements OnInit {

  @Input() isEdit: boolean;
  insuranceForm: any;

  constructor(
    private insuranceService: InsuranceService
  ) {
    super();
  }

  ngOnInit(): void {

  }

  hasErrorFilter(searchValue: string, pattern: string) {

  }

  doCancel() {

  }

  doUpdate() {

  }
}
