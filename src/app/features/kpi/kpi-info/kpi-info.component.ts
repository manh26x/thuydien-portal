import {Component, Input, OnInit} from '@angular/core';
import {KpiReport} from '../model/kpi';

@Component({
  selector: 'aw-kpi-info',
  templateUrl: './kpi-info.component.html',
  styles: [
  ]
})
export class KpiInfoComponent implements OnInit {
  @Input() kpiData: KpiReport = {};
  constructor() { }

  ngOnInit(): void {
  }

}
