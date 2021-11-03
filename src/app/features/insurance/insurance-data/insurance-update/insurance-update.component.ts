import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../core/base.component';
import {InsuranceService} from '../../service/insurance.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IndicatorService} from '../../../../shared/indicator/indicator.service';
import {finalize, map, mergeMap} from 'rxjs/operators';
import {FormBuilder, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {DropdownOptionsList} from '../../model/insurance';
import {UtilService} from '../../../../core/service/util.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'aw-insurance-update',
  templateUrl: './insurance-update.component.html',
  styles: [
  ]
})
export class InsuranceUpdateComponent extends BaseComponent implements OnInit {
  isEdit: any;

  insurance: any;
  brandList = [];
  modelList = [];
  insuranceForm: any;
  statusList = DropdownOptionsList.statusList;
  targetList = DropdownOptionsList.targetList;
  typeCarList = DropdownOptionsList.peopleList;
  customerTypeList = DropdownOptionsList.customerTypeList;
  readonly yearSelect = `${new Date().getFullYear() - 100}:${new Date().getFullYear() + 100}`;

  constructor(
    private insuranceService: InsuranceService,
    private route: ActivatedRoute,
    private router: Router,
    private indicator: IndicatorService,
    private fb: FormBuilder,
    private util: UtilService,
    private message: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.insuranceForm = this.fb.group({
      hang_XE: [{id: null}, [Validators.required]],
      hieu_XE: [{id: null}, [Validators.required]],
      bien_XE: [''],
      so_MAY: [''],
      ngay_HL: [new Date()],
      phi_BAOHIEM: [null],
      so_KHUNG: [null],
      so_CN: [null, [Validators.required]],
      ttai: [null],
      gia_XE: [null],
      mdsd: ['K', [Validators.required]],
      so_LPX: [null],
      bs002: ['K'],
      mdsdn: ['K'],
      mdsdh: ['K'],
      mdsdt: ['K'],
      xen1: ['K'],
      xen2: ['K'],
      xen3: ['K'],
      xen4: ['K'],
      xen5: ['K'],
      xen6: ['K'],
      xen7: ['K'],
      xen8: ['K'],
      xen10: ['K'],
      xeh1: ['K'],
      xeh2: ['K'],
      xeh3: ['K'],
      xeh4: ['K'],
      xeh5: ['K'],
      xeh6: ['K'],
      xeh7: ['K'],
      xeh8: ['K'],
      xet1: ['K'],
      xet2: ['K'],
      tv: [0, [Validators.max(16000000000)]],

      nam_SX: [null, [Validators.required]],
      ngay_KT: [new Date(), [Validators.required]],
      bbtn: ['K', [Validators.required]],
      tl: [null],

      lkh: ['K'],
      ten: ['', [Validators.required]],
      mobi: [''],
      dchi: [''],
      cmt: [''],
      email: [''],
      target: [null],
      loai_XE: [null]

    });
    this.indicator.showActivityIndicator();
    this.insuranceService.setPage('updateInsurance');

    forkJoin([this.insuranceService.insuranceDetail(this.route.snapshot.paramMap.get('id'))
      , this.insuranceService.carBrandActive()])
      .pipe(
        mergeMap(res => {
          this.insurance = res[0];
          this.brandList = res[1];
          let id = -1;
          this.brandList.forEach(e => id = e.brand === this.insurance.hang_XE ? e.id : id);
          this.insuranceForm.patchValue({
            hang_XE: {id},
            bien_XE: this.insurance.bien_XE,
            so_MAY: this.insurance.so_MAY,
            ngay_HL: this.insurance.ngay_HL,
            phi_BAOHIEM: this.insurance.phi_BAOHIEM,
            so_KHUNG: this.insurance.so_KHUNG,
            so_CN: this.insurance.so_CN,
            ttai: this.insurance.ttai,
            gia_XE: this.insurance.gia_XE,
            mdsd: this.insurance.mdsd,
            so_LPX: this.insurance.so_LPX,
            mdsdn: this.insurance.mdsdn,
            mdsdh: this.insurance.mdsdh,
            mdsdt: this.insurance.mdsdt,

            nam_SX: this.insurance.nam_SX,
            ngay_KT: this.insurance.ngay_KT,
            bbtn: this.insurance.bbtn,
            tl: this.insurance.tl,
            tv: this.insurance.tv,
            lkh: this.insurance.lkh,
            ten: this.insurance.ten,
            mobi: this.insurance.mobi,
            dchi: this.insurance.dchi,
            cmt: this.insurance.cmt,
            email: this.insurance.email,
            bs002: {code: this.insurance.bs002}
          });
          if (this.insurance.mdsdn === 'C') {
            this.insuranceForm.patchValue({target: {code: 'mdsdn'} });
            this.changeTarget({value: {code: 'mdsdn'}});
          } else if (this.insurance.mdsdh === 'C') {
            this.insuranceForm.patchValue({target: {code: 'mdsdh'}});
            this.changeTarget({value: {code: 'mdsdh'}});
          } else if (this.insurance.mdsdt === 'C') {
            this.insuranceForm.patchValue({target: {code: 'mdsdt'}});
            this.changeTarget({value: {code: 'mdsdt'}});
          }

          if (this.insurance.xen1 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xen1'}});
          } else if (this.insurance.xen2 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xen2'}});
          } else if (this.insurance.xen3 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xen3'}});
          } else if (this.insurance.xen4 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xen4'}});
          } else if (this.insurance.xen5 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xen5'}});
          } else if (this.insurance.xen6 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xen6'}});
          } else if (this.insurance.xen7 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xen7'}});
          } else if (this.insurance.xen8 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xen8'}});
          } else if (this.insurance.xen10 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xen10'}});
          } else if (this.insurance.xeh1 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xeh1	'}});
          } else if (this.insurance.xeh2 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xeh2	'}});
          } else if (this.insurance.xeh3 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xeh3	'}});
          } else if (this.insurance.xeh4 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xeh4	'}});
          } else if (this.insurance.xeh5 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xeh5	'}});
          } else if (this.insurance.xeh6 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xeh6	'}});
          } else if (this.insurance.xeh7 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xeh7	'}});
          } else if (this.insurance.xeh8 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xeh8	'}});
          } else if (this.insurance.xet1 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xet1	'}});
          } else if (this.insurance.xet2 === 'C') {
            this.insuranceForm.patchValue({loai_XE: {code: 'xet2	'}});
          }
          return this.insuranceService.carModelActive(id);
        }),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe(modelList => {
      this.modelList = modelList;
      let id = null;
      this.modelList.forEach(e => id = e.brandValue === this.insurance.hieu_XE ? e.brandId : id);
      this.insuranceForm.patchValue({hieu_XE: {brandId: id}});
    });
  }

    doCancel() {
      this.router.navigate(['insurance']);
    }

    doUpdate() {
      if (this.insuranceForm.invalid) {
        this.util.validateAllFields(this.insuranceForm);
        this.message.add({
          severity: 'error',
          detail: 'Xin kiểm tra lại các trường thông tin'
        });
        return;
      }
      const value = this.insuranceForm.value;
      if (value.tl > 0 && !value.so_LPX) {
        this.message.add({
          severity: 'error',
          detail: 'Số lái phụ xe( bắt buộc trong trường hợp mua tai nạn lái phụ xe)'
        });
        return;
      }
      if (value.target.code === 'mdsdh' && (!value.ttai || value.ttai <= 0)) {
        this.message.add({
          severity: 'error',
          detail: 'Trọng tải ( bắt buộc với loại xe trở hàng)'
        });
        return;
      }

      if (!value.bien_XE && (!value.so_KHUNG || !value.so_MAY)) {
        this.message.add({
          severity: 'error',
          detail: 'Số khung và số máy bắt buộc trong trường hợp xe chưa có biển kiểm soát'
        });
        return;
      }

      const bodyBphi = {
        kieu_HD: this.insurance.kieu_HD,
        nv: this.insurance.nv,
        nam_SX: value.nam_SX,
        so_CN: value.so_CN,
        ttai: value.ttai,
        so_LPX: value.so_LPX,
        mdsd: value.mdsd,
        ngay_HL: value.ngay_HL.toString(),
        ngay_KT: value.ngay_KT.toString(),
        mdsdn: value.target.code === 'mdsdn' ? 'C' : 'K',
        mdsdh: value.target.code === 'mdsdh' ? 'C' : 'K',
        mdsdt: value.target.code === 'mdsdt' ? 'C' : 'K',
        xen1: value.loai_XE.code === 'xen1' ? 'C' : 'K',
        xen5: value.loai_XE.code === 'xen5' ? 'C' : 'K',
        xen4: value.loai_XE.code === 'xen4' ? 'C' : 'K',
        xen2: value.loai_XE.code === 'xen2' ? 'C' : 'K',
        xen3: value.loai_XE.code === 'xen3' ? 'C' : 'K',
        xen6: value.loai_XE.code === 'xen6' ? 'C' : 'K',
        xen7: value.loai_XE.code === 'xen7' ? 'C' : 'K',
        xen8: value.loai_XE.code === 'xen8' ? 'C' : 'K',
        xen10: value.loai_XE.code === 'xen10' ? 'C' : 'K',
        xeh1: value.loai_XE.code === 'xeh1' ? 'C' : 'K',
        xeh2: value.loai_XE.code === 'xeh2' ? 'C' : 'K',
        xeh3: value.loai_XE.code === 'xeh3' ? 'C' : 'K',
        xeh4: value.loai_XE.code === 'xeh4' ? 'C' : 'K',
        xeh5: value.loai_XE.code === 'xeh5' ? 'C' : 'K',
        xeh6: value.loai_XE.code === 'xeh6' ? 'C' : 'K',
        xeh7: value.loai_XE.code === 'xeh7' ? 'C' : 'K',
        xeh8: value.loai_XE.code === 'xeh8' ? 'C' : 'K',
        xet1: value.loai_XE.code === 'xet1' ? 'C' : 'K',
        xet2: value.loai_XE.code === 'xet2' ? 'C' : 'K',
        bbtn: value.bbtn,
        tk: this.insurance.tk,
        tl: value.tl,
        gia_XE: value.gia_XE,
        tv: value.tv,
        bs002: value.bs002.code
      };
      this.indicator.showActivityIndicator();
      this.insuranceService.insuranceBphi(bodyBphi)
        .pipe(
          mergeMap(resMic => {
            const bodyTra = {
              insuranceId: resMic.data[0].localMicId,
              xmlinput: {
                kieu_HD: this.insurance.kieu_HD,
                nv: this.insurance.nv,
                nam_SX: value.nam_SX,
                so_CN: value.so_CN,
                ttai: value.ttai,
                so_LPX: value.so_LPX,
                mdsd: value.mdsd,
                ngay_HL: value.ngay_HL.toString(),
                ngay_KT: value.ngay_KT.toString(),
                mdsdn: value.target.code === 'mdsdn' ? 'C' : 'K',
                mdsdh: value.target.code === 'mdsdh' ? 'C' : 'K',
                mdsdt: value.target.code === 'mdsdt' ? 'C' : 'K',
                xen1: value.loai_XE.code === 'xen1' ? 'C' : 'K',
                xen5: value.loai_XE.code === 'xen5' ? 'C' : 'K',
                xen4: value.loai_XE.code === 'xen4' ? 'C' : 'K',
                xen2: value.loai_XE.code === 'xen2' ? 'C' : 'K',
                xen3: value.loai_XE.code === 'xen3' ? 'C' : 'K',
                xen6: value.loai_XE.code === 'xen6' ? 'C' : 'K',
                xen7: value.loai_XE.code === 'xen7' ? 'C' : 'K',
                xen8: value.loai_XE.code === 'xen8' ? 'C' : 'K',
                xen10: value.loai_XE.code === 'xen10' ? 'C' : 'K',
                xeh1: value.loai_XE.code === 'xeh1' ? 'C' : 'K',
                xeh2: value.loai_XE.code === 'xeh2' ? 'C' : 'K',
                xeh3: value.loai_XE.code === 'xeh3' ? 'C' : 'K',
                xeh4: value.loai_XE.code === 'xeh4' ? 'C' : 'K',
                xeh5: value.loai_XE.code === 'xeh5' ? 'C' : 'K',
                xeh6: value.loai_XE.code === 'xeh6' ? 'C' : 'K',
                xeh7: value.loai_XE.code === 'xeh7' ? 'C' : 'K',
                xeh8: value.loai_XE.code === 'xeh8' ? 'C' : 'K',
                xet1: value.loai_XE.code === 'xet1' ? 'C' : 'K',
                xet2: value.loai_XE.code === 'xet2' ? 'C' : 'K',
                bbtn: value.bbtn,
                tk: this.insurance.tk,
                tl: value.tl,
                gia_XE: value.gia_XE,
                tv: value.tv,
                bs002: value.bs002.code,

                bien_XE: value.bien_XE,
                so_KHUNG: value.so_KHUNG,
                so_MAY: value.so_MAY,
                hang_XE: value.hang_XE.brand,
                hieu_XE: value.hieu_XE.brandValue,
                lkh: value.lkh.code,
                ten: value.ten,
                cmt: value.cmt,
                mobi: value.mobi,
                email: value.email,
                dchi: value.dchi,
                ng_HUONG: this.insurance.ng_HUONG,
                so_HDL: this.insurance.so_HDL,
                dbhm: this.insurance.dbhm,
                lkhm: this.insurance.lkhm,
                cmtm: this.insurance.cmtm,
                mobim: this.insurance.mobim,
                emailm: this.insurance.emailm,
                tenm: this.insurance.tenm,
                dchim: this.insurance.dchim,
                ng_SINHM: this.insurance.ng_SINHM
              }
            };
            return this.insuranceService.insuranceTra(bodyTra);
          }),
          finalize(() => this.indicator.hideActivityIndicator()))
        .subscribe(res => {
          const parser = new DOMParser();
          const result = parser.parseFromString(res.data[0].Body.ws_GCN_TRAResponse.ws_GCN_TRAResult , 'text/xml');
          if (result.getElementsByTagName('Status')[0].childNodes[0].nodeValue === 'True') {
            this.message.add({
              severity: 'success',
              detail: 'Cập nhật thành công'
            });
            this.router.navigate(['insurance']);
            return;
          }
          this.message.add({
            severity: 'error',
            detail: result.getElementsByTagName('ErrorDesc')[0].childNodes[0].nodeValue
          });
        });
    }
  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.insuranceForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }
    selectBrand(evt) {
        this.insuranceService.carModelActive(evt.value.id).subscribe(res => {
          this.modelList = res;
        });
      }

    changeTarget(evt) {
        if (evt.value.code === 'mdsdn') {
          this.typeCarList = DropdownOptionsList.peopleList;
        } else if (evt.value.code === 'mdsdh') {
          this.typeCarList = DropdownOptionsList.goodsList;
        } else {
          this.typeCarList = DropdownOptionsList.otherList;
        }
      }
}
