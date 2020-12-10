import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aw-dashboard',
  template: `<p>{{'welcome' | translate}}</p>`
})

export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
