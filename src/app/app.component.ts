import {Component, OnInit} from '@angular/core';
import {AppTranslateService} from './core/service/translate.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'aw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  saleApp = 'TPBank Sales App';
  constructor(private translate: AppTranslateService, private title: Title) {
    this.title.setTitle(this.saleApp);
  }

  ngOnInit() {
    this.translate.initialize();
  }
}
