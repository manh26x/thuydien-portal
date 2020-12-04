import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'aw-news-filter-form',
  templateUrl: './news-filter-form.component.html',
  styles: [
  ]
})
export class NewsFilterFormComponent implements OnInit {
  statusList: SelectItem[] = [
    { label: 'Hoạt động', value: 'A' },
    { label: 'Không hoạt động', value: 'IA' }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
