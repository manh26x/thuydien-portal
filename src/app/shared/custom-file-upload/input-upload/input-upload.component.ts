import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'aw-input-upload',
  templateUrl: './input-upload.component.html',
  styles: [
  ]
})
export class InputUploadComponent {
  formFile: FormControl = new FormControl({value: '', disabled: true});
  maxFiles = 1;
  errors: Array<string> = [];
  @ViewChild('inputFile', { static: true }) file: ElementRef;
  @Input() selectLabel = 'Chọn file';
  @Input() fileExt = '.xls, .xlsx';
  @Input() maxSize = 5; // MB
  @Input() maxFileErrorMsg = 'Vượt quá số lượng cho phép';
  @Input() fileExtErrorMsg = 'File không đúng định dạng';
  @Input() fileSizeErrorMsg = 'File vượt quá dung lượng cho phép';
  @Output() changeFile: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  onFileChange(event) {
    const files = event.target.files;
    this.errors = [];
    if (this.isValidFiles(files)) {
      this.formFile.setValue(files[0].name);
      this.changeFile.emit(files);
    } else {
      this.clearFile();
    }
  }

  private isValidFiles(files) {
    // Check Number
    if (files.length > this.maxFiles) {
      this.errors.push(this.maxFileErrorMsg);
      return;
    }
    this.isValidFileExtension(files);
    return this.errors.length === 0;
  }

  private isValidFileExtension(files) {
    // Check extensions
    const extensions = (this.fileExt.split(','))
      // tslint:disable-next-line:only-arrow-functions
      .map(function(x) { return x.toLocaleUpperCase().trim(); });
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
      const exists = extensions.indexOf('.' + ext);
      if (exists === -1) {
        this.errors.push(this.fileExtErrorMsg);
      }
      this.isValidFileSize(files[i]);
    }
  }

  private isValidFileSize(file) {
    // Check size
    const fileSizeinMB = file.size / (1024 * 1000);
    const sizeFile = Math.round(fileSizeinMB * 100) / 100;
    if (sizeFile > this.maxSize) {
      this.errors.push(this.fileSizeErrorMsg);
    }
  }

  clearFile(): void {
    this.formFile.setValue('');
    this.file.nativeElement.value = '';
  }

}
