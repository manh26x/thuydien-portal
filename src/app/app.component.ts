import {Component, OnInit} from '@angular/core';
import {AppTranslateService} from './core/service/translate.service';

@Component({
  selector: 'aw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sale-web-portal';
  constructor(private translate: AppTranslateService) {

  }

  ngOnInit() {
    this.translate.initialize();
  }
}
