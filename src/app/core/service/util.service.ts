import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, FormArray, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public isNullOrEmpty(str: string): boolean {
    return typeof str === 'undefined' || str === null || str.length === 0;
  }

  public extractAmount(input: string): string {
    return typeof input === 'string' ? input.replace(/[A-z \,]/g, '') : input;
  }

  public validateAllFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormArray) {
        control.markAsTouched();
      }
      if (control instanceof FormControl) {
        control.markAsTouched({
          onlySelf: true
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }

  public printHtml(selector: string): void {
    const elem = document.querySelector(selector);
    const domClone = elem.cloneNode(true);
    const printSection = document.createElement('div');
    printSection.id = 'printSection';
    printSection.appendChild(domClone);
    printSection.setAttribute('style', 'height:' + elem.clientHeight + 'px');
    document.body.insertBefore(printSection, document.body.firstChild);
    document.querySelector('body aw-root').classList.add('print-div');
    window.print();
    document.querySelector('body aw-root').classList.remove('print-div');
    const oldElem = document.getElementById('printSection');
    if (oldElem !== null) {
      oldElem.parentNode.removeChild(oldElem);
    }
  }

  public removeSpaces(control: AbstractControl) {
    if (control && control.value && control.value.indexOf(' ') > -1) {
      control.setValue(control.value.replace(/\s/g, ''));
    }
    return null;
  }

  public canForEach(arr): boolean {
    return Array.isArray(arr) && arr.length > 0;
  }

  public formatAmount(str: string, thousandSeperator = ',', decimalPoint = '.') {
    if (!str) { return ''; }
    let value = str.toString().replace(new RegExp(thousandSeperator, 'g'), '');
    const parts = value.split(decimalPoint);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeperator);
    if (parts[1]) {
      parts[1] = parts[1].length > 2 ? parts[1].slice(0, 2) : parts[1];
    }
    return parts.join(decimalPoint);
  }

  public padNumber(n: number) {
    return `0${n}`.slice(-2);
  }
}
