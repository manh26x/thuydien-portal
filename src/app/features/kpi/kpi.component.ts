import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../core/base.component';

@Component({
  selector: 'aw-kpi',
  templateUrl: './kpi.component.html'
})

export class KpiComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
