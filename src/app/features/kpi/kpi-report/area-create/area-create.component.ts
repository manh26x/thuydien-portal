import { Component, OnInit } from '@angular/core';
import {KpiService} from '../../service/kpi.service';
import {Area} from '../../model/area';
import {IndicatorService} from '../../../../shared/indicator/indicator.service';
import {finalize} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'aw-area-create',
  templateUrl: './area-create.component.html',
  styles: [
  ]
})
export class AreaCreateComponent implements OnInit {

  constructor(
    private kpiService: KpiService,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  doSave(value): void {
    this.indicator.showActivityIndicator();
    const area: Area = {
      name: value.name,
      priority: value.priority,
      color: value.color
    };
    this.kpiService.insertArea(area).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      this.messageService.add({
        key: 'area-msg',
        severity: 'success',
        summary: '',
        detail: 'Thêm mới phân vùng dữ liệu thành công'
      });
      this.router.navigate(['management-kpi', 'report']);
    });
  }

}
