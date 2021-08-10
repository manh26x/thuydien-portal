import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TagDetail} from '../../tags/model/tags';
import {FormControl, Validators} from '@angular/forms';
import {InputUploadComponent} from '../../../shared/custom-file-upload/input-upload/input-upload.component';
import {KpiTerm} from "../model/kpi";

@Component({
  selector: 'aw-kpi-import',
  templateUrl: './kpi-import.component.html',
  styles: [
  ]
})
export class KpiImportComponent implements OnInit {
  @ViewChild(InputUploadComponent, {static: true}) inputFile: InputUploadComponent;
  fileImport: any[];
  reportType: FormControl = new FormControl('', Validators.required);
  term: FormControl = new FormControl('', Validators.required);
  @Input() tagKpiList: TagDetail[] = [];
  @Output() checkFile: EventEmitter<any> = new EventEmitter<any>();
  @Input() termKpiList: KpiTerm[] = [];
  constructor() {
  }

  ngOnInit(): void {}

  doChangeFile(files) {
    this.fileImport = files;
  }

  doCheckFile() {
    if (this.fileImport && this.reportType.valid && this.fileImport[0]) {
      this.checkFile.emit({ file: this.fileImport, reportType: this.reportType.value });
    } else {
      this.reportType.markAsDirty();
    }
  }

  clearForm(): void {
    this.reportType = new FormControl('', Validators.required);
    this.inputFile.clearFile();
  }

}


