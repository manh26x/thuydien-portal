import { Component } from '@angular/core';
import {AppTranslateService} from './core/service/translate.service';

@Component({
  selector: 'aw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sale-web-portal';
  constructor(private translate: AppTranslateService) {
    this.translate.initialize();
  }
}
