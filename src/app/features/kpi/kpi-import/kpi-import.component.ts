import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {KpiService} from '../service/kpi.service';
import {TagDetail} from '../../tags/model/tags';
import {takeUntil} from 'rxjs/operators';
import {UtilService} from '../../../core/service/util.service';
import {FormControl, Validators} from '@angular/forms';
import {BaseComponent} from '../../../core/base.component';
import {InputUploadComponent} from '../../../shared/custom-file-upload/input-upload/input-upload.component';

@Component({
  selector: 'aw-kpi-import',
  templateUrl: './kpi-import.component.html',
  styles: [
  ]
})
export class KpiImportComponent extends BaseComponent implements OnInit {
  @ViewChild(InputUploadComponent, {static: true}) inputFile: InputUploadComponent;
  fileImport: any[];
  reportType: FormControl = new FormControl('', Validators.required);
  @Input() listTagKpi: TagDetail[] = [];
  @Output() checkFile: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    super();
  }

  ngOnInit(): void {}

  doChangeFile(files) {
    this.fileImport = files;
  }

  doCheckFile() {
    if (this.fileImport && this.reportType.valid) {
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


