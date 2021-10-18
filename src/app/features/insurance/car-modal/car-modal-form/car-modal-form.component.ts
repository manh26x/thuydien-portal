import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CarBrand, CarBrandConst, CarModel} from "../../model/car-brand";
import {InsuranceService} from "../../service/insurance.service";
import {FormBuilder, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../../core/service/translate.service";
import {Router} from "@angular/router";
import {UtilService} from "../../../../core/service/util.service";
import {concatMap, startWith} from "rxjs/operators";

@Component({
  selector: 'aw-car-modal-form',
  templateUrl: './car-modal-form.component.html',
  styles: [
  ]
})
export class CarModalFormComponent  implements OnInit, OnChanges {

  @Input() isEdit = false;
  @Input() carModal;
  @Output() doSave: EventEmitter<any> = new EventEmitter();
  carModalForm: any;
  statusList = [];
  brandList = [];

  constructor(
    private insuranceService: InsuranceService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private router: Router,
    private util: UtilService,
  ) {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        {label: res.active, code: CarBrandConst.ACTIVE},
        {label: res.inactive, code: CarBrandConst.INACTIVE}
      ];
    });
    this.carModalForm = this.fb.group({
      modelId: [null],
      model: ['', [Validators.required]],
      status: [{code: CarBrandConst.ACTIVE}],
      brandId: [{brandId: null}]
    });
  }

  ngOnInit(): void {
    this.insuranceService.carBrandActive().subscribe(res => {
      this.brandList = res;
      this.carModalForm.patchValue({
        brandId: {id: this.brandList[0].id}
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.carModal) {
      if (!changes.carModal.firstChange) {
        const carModel: CarModel = changes.carModal.currentValue;
        this.carModalForm.patchValue({
          modelId: carModel.id,
          model: carModel.model,
          status: {code: carModel.status},
          brandId: {id: carModel.brandId}
        });
      }
    }

  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.carModalForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  save() {
    const value = this.carModalForm.getRawValue();
    this.carModalForm.patchValue({
      model: value.model.trim()
    });
    if (this.carModalForm.valid) {
      this.doSave.emit(this.carModalForm.value);
    } else  {
      this.util.validateAllFields(this.carModalForm);
    }
  }

  doCancel() {
    this.router.navigate(['insurance']);
  }

}
