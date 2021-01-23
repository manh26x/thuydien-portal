import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Area} from '../model/area';
import {AreaEnum} from '../model/area.enum';

@Component({
  selector: 'aw-area-data',
  templateUrl: './area-data.component.html',
  styles: [
  ]
})
export class AreaDataComponent implements OnInit {
  areaConst = AreaEnum;
  @Input() data: Area[] = [];
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  gotoCreate() {
    this.router.navigate(['management-kpi', 'create-area']);
  }

  gotoUpdate(area: Area) {
    this.router.navigate(['management-kpi', 'update-area', area.id]);
  }

  doDelete(area: Area) {
    this.delete.emit(area);
  }

}
