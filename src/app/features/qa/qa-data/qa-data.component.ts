import { Component, OnInit } from '@angular/core';
import {QaConst} from "../model/qa";
import {Router} from "@angular/router";
import {BaseComponent} from "../../../core/base.component";

@Component({
  selector: 'aw-qa-data',
  templateUrl: './qa-data.component.html',
  styles: [
  ]
})
export class QaDataComponent extends BaseComponent implements OnInit {
  formFilter: any;
  statusList = [];
  qnaList = [
    {question: 'Câu hỏi 1', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '1'},
    {question: 'Câu hỏi 2', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '1'},
    {question: 'Câu hỏi 3', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '0'},
    {question: 'Câu hỏi 4', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '1'},
    {question: 'Câu hỏi 5', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '1'},
    {question: 'Câu hỏi 6', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '0'},
    {question: 'Câu hỏi 7', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '1'},
    {question: 'Câu hỏi 9', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '1'},
    {question: 'Câu hỏi 10', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '1'},
    {question: 'Câu hỏi 11', answer: ' Câu trả lời', createDate: new Date(), id: 1, status: '1'},
  ];
  qaConst = QaConst;
  isHasDel = true;
  isHasEdit = true;
  pageSize = 10;
  totalItem = 14;

  constructor(
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
  }

  doFilter() {

  }

  hasErrorFilter(searchValue: string, pattern: string) {
    return false;
  }

  gotoCreate() {
    this.router.navigate(['qa', 'create']);
  }

  lazyLoadUser($event: any) {

  }

  doDelete(qa: any) {

  }

  gotoUpdate(id) {
    this.router.navigate(['qa', 'update', id]);
  }

  gotoView(id) {
    this.router.navigate(['qa', 'view', id]);
  }

  changePage($event: any) {

  }
}
