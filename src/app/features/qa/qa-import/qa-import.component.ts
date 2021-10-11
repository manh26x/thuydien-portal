import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {BehaviorSubject} from 'rxjs';
import {QaService} from "../service/qa.service";
import {BaseComponent} from "../../../core/base.component";
import {switchMap} from "rxjs/operators";
import {ApiErrorResponse} from "../../../core/model/error-response";
import {ConfirmationService, MessageService} from "primeng/api";
import {IndicatorService} from "../../../shared/indicator/indicator.service";
import {AppTranslateService} from "../../../core/service/translate.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'aw-qa-import',
  templateUrl: './qa-import.component.html',
  styles: [
  ]
})
export class QaImportComponent extends BaseComponent implements AfterViewInit {
  private fileImport: any;
  display = false;
  @ViewChild('qnaTable') qnaTable: Table;
  tableEmit$: BehaviorSubject<Table>;
  qnaList = [];
  @Output() doFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private confirmDialog: ConfirmationService,
    private messageService: MessageService,
    private indicator: IndicatorService,
    private appTranslate: AppTranslateService,
    private translate: TranslateService,
    private qaService: QaService,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.tableEmit$.next(this.qnaTable);
  }

  doChangeFile(files) {

    this.fileImport = files;

  }

  doCheckFile() {
    if (this.fileImport && this.fileImport.length > 0) {
      const fileFormData: FormData = new FormData();
      fileFormData.append('file', this.fileImport[0], this.fileImport[0].name);
      this.qaService.checkDataImport(fileFormData).subscribe(res => {
        this.qnaList = res;
        this.display = true;
      }, error => console.log(error));
    }
  }

  doSave() {
    this.qaService.saveList(this.qnaList).subscribe(() => {
      this.display = false;
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('qa.message.insertSuccess')
      });
      this.doFilter.emit();
    }, err => {
      this.indicator.hideActivityIndicator();
      if (err instanceof ApiErrorResponse && err.code === '201') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('qa.message.insertError')
        });
      } else {
        throw err;
      }
    });
  }
}
