import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'aw-qa-import',
  templateUrl: './qa-import.component.html',
  styles: [
  ]
})
export class QaImportComponent implements AfterViewInit {
  private fileImport: any;
  display = false;
  @ViewChild('qnaTable') qnaTable: Table;
  tableEmit$: BehaviorSubject<Table>;
  qnaList = [
    {question: 'Câu hỏi 1', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 2', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 3', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 4', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 5', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 6', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 7', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 9', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 10', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 11', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 12', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 13', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 14', answer: ' Câu trả lời'},
    {question: 'Câu hỏi 15', answer: ' Câu trả lời'},
  ];

  constructor() { }

  ngAfterViewInit(): void {
    this.tableEmit$.next(this.qnaTable);
  }

  doChangeFile(files) {
    this.fileImport = files;

  }

  doCheckFile() {
    this.display = true;
  }
}
