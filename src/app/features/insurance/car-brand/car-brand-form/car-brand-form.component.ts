import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CarBrand, CarBrandConst} from "../../model/car-brand";
import {FormBuilder, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../../core/service/translate.service";
import {concatMap, startWith} from "rxjs/operators";
import {UtilService} from "../../../../core/service/util.service";
import {Router} from "@angular/router";

@Component({
  selector: 'aw-car-brand-form',
  templateUrl: './car-brand-form.component.html',
  styles: [
  ]
})
export class CarBrandFormComponent implements OnInit, OnChanges {

  @Input() isEdit = false;
  @Input() carBrand: CarBrand;
  @Output() doSave: EventEmitter<any> = new EventEmitter();

  carBrandForm: any;
  statusList = [];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private router: Router,
    private util: UtilService,
  ) {
    this.carBrandForm = this.fb.group({
      id: [null],
      brand: ['', [Validators.required]],
      status: [{code: CarBrandConst.ACTIVE}]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.carBrand) {
      if (!changes.carBrand.firstChange) {
        const carBr: CarBrand = changes.carBrand.currentValue;
        this.carBrandForm.patchValue({
          id: carBr.id,
          brand: carBr.brand,
          status: {code: carBr.status},
        });
      }
    }

  }
  ngOnInit(): void {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        {label: res.active, code: CarBrandConst.ACTIVE},
        {label: res.inactive, code: CarBrandConst.INACTIVE}
      ];
    });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.carBrandForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  save() {
    const value = this.carBrandForm.getRawValue();
    this.carBrandForm.patchValue({
      brand: value.brand.trim()
    });
    if (this.carBrandForm.valid) {
      this.doSave.emit(this.carBrandForm.value);
    } else  {
      this.util.validateAllFields(this.carBrandForm);
    }
  }

  doCancel() {
    this.router.navigate(['insurance']);
  }

  create() {
    const value = this.carBrandForm.getRawValue();
    this.carBrandForm.patchValue({
      brand: value.brand.trim()
    });
    if (this.carBrandForm.valid) {
      this.doSave.emit(this.carBrandForm.get('brand').value);
    } else  {
      this.util.validateAllFields(this.carBrandForm);
    }
  }
}
