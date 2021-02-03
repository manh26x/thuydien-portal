import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'aw-dashboard',
  template: `
    <p>{{'welcome' | translate}}</p>
    <p>Version: {{version}}</p>
  `
})

export class DashboardComponent implements OnInit {
  readonly version = environment.version;
  constructor() { }

  ngOnInit() { }
}
