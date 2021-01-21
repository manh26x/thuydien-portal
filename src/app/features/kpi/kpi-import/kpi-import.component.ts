import { Component, OnInit } from '@angular/core';
import {KpiService} from '../service/kpi.service';
import {TagDetail} from '../../tags/model/tags';
import {takeUntil} from 'rxjs/operators';
import {UtilService} from '../../../core/service/util.service';
import {FormControl} from '@angular/forms';
import {BaseComponent} from '../../../core/base.component';

@Component({
  selector: 'aw-kpi-import',
  templateUrl: './kpi-import.component.html',
  styles: [
  ]
})
export class KpiImportComponent extends BaseComponent implements OnInit {
  listKpi = [{}];
  fileImport: any[];
  listTagKpi: TagDetail[] = [];
  reportType: FormControl = new FormControl('');
  constructor(
    private kpiService: KpiService,
    private util: UtilService
  ) {
    super();
  }

  ngOnInit(): void {
    this.kpiService.getTagKpi().pipe(
      takeUntil(this.nextOnDestroy)
    ).subscribe(res => {
      this.listTagKpi = res;
    });
  }

  doChangeFile(files) {
    this.fileImport = files;
  }

  doCheckFile() {
    if (this.fileImport) {
      const value: TagDetail = this.reportType.value;
      const fileFormData: FormData = new FormData();
      fileFormData.append('file', this.fileImport[0], this.fileImport[0].name);
      fileFormData.append('typeReport', value.keyTag);
      this.kpiService.checkDataImport(fileFormData).subscribe(res => {
        console.log(res);
      });
    }
  }

}


