import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'aw-news-form',
  templateUrl: './news-form.component.html',
  styles: []
})
export class NewsFormComponent implements OnInit {
  statusList: SelectItem[] = [
    { label: 'Hoạt động', value: 'A' },
    { label: 'Không hoạt động', value: 'IA' }
  ];
  yearSelect = `${new Date().getFullYear()}:${new Date().getFullYear() + 10}`;
  min = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
