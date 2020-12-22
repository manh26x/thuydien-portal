import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'aw-image-upload',
  templateUrl: './image-upload.component.html',
  styles: [`
    .drag-area{
      font-size: 1.1rem;
      border: 1px solid #bbb; padding: 40px 20px;
      background-color: #fff;
      color: #bbb;
      border-radius: 4px;
    }
    .drop-area{
      font-size: 1.1rem;
      border: 1px dashed #bbb; padding: 40px 20px;
      background-color: #eff;
      color: #aaa;
    }
    .image-preview {
      border: 1px solid #bbb;
      background-color: #fff;
      border-radius: 4px;
      position: relative;
    }
    .image-preview img {
      width: 100%;
      border-radius: 4px;
    }
    .image-preview .img-action {
      position: absolute;
      right: 5px;
      bottom: 5px;
    }
    .image-preview .btn-action {
      border: 1px solid rgb(242, 242, 242);
      color: #ffffff;
      background: rgb(165 165 165);
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      width: 35px;
      height: 35px;
      opacity: 0.8;
    }
    .image-preview .btn-action i {
      font-size: 1.3rem;
    }
  `]
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('file', { static: true }) file: ElementRef;
  @ViewChild('imgPreview', { static: true }) imgPreview: ElementRef;
  errors: Array<string> = [];
  maxFiles = 1;
  fileExt = '.jpg, .gif, .png';
  maxSize = 5; // MB
  zoneFileClass = 'drag-area';
  isSelect = true;
  @Input() uploadTitle = 'Tải ảnh lên';
  @Input() maxFileErrorMsg = 'Vượt quá số lượng cho phép';
  @Input() fileExtErrorMsg = 'File không đúng định dạng';
  @Input() fileSizeErrorMsg = 'File vượt quá dung lượng cho phép';
  @Output() changeFile: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearFile: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  onFileChange(event) {
    const files = event.target.files;
    this.errors = [];
    if (this.isValidFiles(files)) {
      this.previewFile(files);
      return;
    } else {
      this.file.nativeElement.value = '';
    }
  }

  clearImage() {
    this.isSelect = true;
    this.file.nativeElement.value = '';
    this.clearFile.emit();
  }

  previewFile(files) {
    const objUrl = window.URL.createObjectURL(files[0]);
    this.imgPreview.nativeElement.onload = () => window.URL.revokeObjectURL(objUrl);
    this.imgPreview.nativeElement.src = objUrl;
    this.isSelect = false;
    this.changeFile.emit(files);
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

  @HostListener('dragover', ['$event']) onDragOver(event) {
    this.zoneFileClass = 'drop-area';
    event.preventDefault();
  }
  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.zoneFileClass = 'drop-area';
    event.preventDefault();
  }
  @HostListener('dragend', ['$event']) onDragEnd(event) {
    this.zoneFileClass = 'drag-area';
    event.preventDefault();
  }
  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.zoneFileClass = 'drag-area';
    event.preventDefault();
  }
  @HostListener('drop', ['$event']) onDrop(event) {
    this.zoneFileClass = 'drag-area';
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    this.errors = [];
    if (this.isValidFiles(files)) {
      this.previewFile(files);
      return;
    } else {
      this.file.nativeElement.value = '';
    }
  }

}
