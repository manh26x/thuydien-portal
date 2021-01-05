import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExportService {

  constructor() { }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    import('xlsx').then(xlsx => {
      const worksheet: any = xlsx.utils.json_to_sheet(json);
      const wb: any = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      if (!wb.Workbook) { wb.Workbook = {}; }
      if (!wb.Workbook.Views) { wb.Workbook.Views = []; }
      if (!wb.Workbook.Views[0]) { wb.Workbook.Views[0] = {}; }
      const excelBuffer: any = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
