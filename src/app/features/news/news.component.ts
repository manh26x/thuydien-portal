import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {NewsService} from './service/news.service';

@Component({
  selector: 'aw-news',
  templateUrl: './news.component.html',
  styleUrls: []
})

export class NewsComponent implements OnInit {


  constructor(private newsService: NewsService) {
  }

  ngOnInit(): void {

  }
}
